package com.bookmyvendor.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OTP Service using MSG91 (India-specific SMS gateway)
 * In-memory map used for OTP storage (No Redis required!)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {

    @Value("${app.msg91.auth-key:}")
    private String msg91AuthKey;

    @Value("${app.msg91.template-id:}")
    private String msg91TemplateId;

    @Value("${app.otp.expiry-minutes:5}")
    private int otpExpiryMinutes;

    @Value("${app.otp.dev-mode:true}")
    private boolean devMode;

    private static final int OTP_LENGTH = 6;
    private static final int MAX_ATTEMPTS = 3;

    // In-Memory store instead of Redis (phone -> {otp, attempts, expiry})
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final Map<String, RateLimitData> rateLimitStore = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        int attempts;
        LocalDateTime expiry;
        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.attempts = 0;
            this.expiry = expiry;
        }
    }

    private static class RateLimitData {
        int count;
        LocalDateTime expiry;
        RateLimitData(LocalDateTime expiry) {
            this.count = 1;
            this.expiry = expiry;
        }
    }

    public void sendOtp(String phone) {
        // Rate limit check (max 3 OTPs per 10 minutes)
        LocalDateTime now = LocalDateTime.now();
        RateLimitData rateLimit = rateLimitStore.get(phone);
        if (rateLimit != null && now.isBefore(rateLimit.expiry)) {
            if (rateLimit.count >= 3) {
                throw new RuntimeException("Too many OTP requests. Please wait 10 minutes.");
            }
            rateLimit.count++;
        } else {
            rateLimitStore.put(phone, new RateLimitData(now.plusMinutes(10)));
        }

        String otp = generateOtp();
        
        otpStore.put(phone, new OtpData(otp, now.plusMinutes(otpExpiryMinutes)));

        if (devMode) {
            log.info("=== DEV MODE OTP for {} === OTP: {} ===", phone, otp);
        } else {
            sendViaMSG91(phone, otp);
        }
    }

    public boolean verifyOtp(String phone, String submittedOtp) {
        OtpData data = otpStore.get(phone);

        if (data == null || LocalDateTime.now().isAfter(data.expiry)) {
            otpStore.remove(phone);
            throw new RuntimeException("OTP expired or not found. Please request a new one.");
        }

        if (data.attempts >= MAX_ATTEMPTS) {
            otpStore.remove(phone);
            throw new RuntimeException("Too many wrong attempts. Please request a new OTP.");
        }

        if (!data.otp.equals(submittedOtp)) {
            data.attempts++;
            throw new RuntimeException("Incorrect OTP. " + (MAX_ATTEMPTS - data.attempts) + " attempts remaining.");
        }

        // OTP correct
        otpStore.remove(phone);
        return true;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private void sendViaMSG91(String phone, String otp) {
        try {
            RestClient restClient = RestClient.create();
            String indianPhone = "91" + phone;

            restClient.post()
                .uri("https://api.msg91.com/api/v5/otp")
                .header("authkey", msg91AuthKey)
                .header("Content-Type", "application/json")
                .body(Map.of(
                    "template_id", msg91TemplateId,
                    "mobile", indianPhone,
                    "otp", otp
                ))
                .retrieve()
                .toBodilessEntity();

            log.info("OTP sent successfully to {}", phone);
        } catch (Exception e) {
            log.error("Failed to send OTP via MSG91: {}", e.getMessage());
            throw new RuntimeException("Failed to send OTP. Please try again.");
        }
    }
}
