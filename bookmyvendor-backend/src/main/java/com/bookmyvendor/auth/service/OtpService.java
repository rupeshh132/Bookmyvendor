package com.bookmyvendor.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Map;

/**
 * OTP Service using MSG91 (India-specific SMS gateway)
 * Redis used for OTP storage with TTL (5 minutes)
 * Rate limit: max 3 OTP requests per phone per 10 minutes
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;

    @Value("${app.msg91.auth-key:}")
    private String msg91AuthKey;

    @Value("${app.msg91.template-id:}")
    private String msg91TemplateId;

    @Value("${app.otp.expiry-minutes:5}")
    private int otpExpiryMinutes;

    @Value("${app.otp.dev-mode:true}")
    private boolean devMode;  // In dev: log OTP instead of sending SMS

    private static final int OTP_LENGTH = 6;
    private static final int MAX_ATTEMPTS = 3;
    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String RATE_LIMIT_PREFIX = "otp:rate:";

    // ── Send OTP to phone ────────────────────────────────────────
    public void sendOtp(String phone) {
        // Rate limit check (max 3 OTPs per 10 minutes)
        String rateLimitKey = RATE_LIMIT_PREFIX + phone;
        Long count = redisTemplate.opsForValue().increment(rateLimitKey);
        if (count != null && count == 1) {
            redisTemplate.expire(rateLimitKey, Duration.ofMinutes(10));
        }
        if (count != null && count > 3) {
            throw new RuntimeException("Too many OTP requests. Please wait 10 minutes.");
        }

        String otp = generateOtp();
        String otpKey = OTP_KEY_PREFIX + phone;

        // Store: "otp:attempts" format → "123456:0"
        redisTemplate.opsForValue().set(otpKey, otp + ":0", Duration.ofMinutes(otpExpiryMinutes));

        if (devMode) {
            // Development: just log the OTP
            log.info("=== DEV MODE OTP for {} === OTP: {} ===", phone, otp);
        } else {
            // Production: send via MSG91
            sendViaMSG91(phone, otp);
        }
    }

    // ── Verify OTP ───────────────────────────────────────────────
    public boolean verifyOtp(String phone, String submittedOtp) {
        String otpKey = OTP_KEY_PREFIX + phone;
        String stored = redisTemplate.opsForValue().get(otpKey);

        if (stored == null) {
            throw new RuntimeException("OTP expired or not found. Please request a new one.");
        }

        String[] parts = stored.split(":");
        String storedOtp = parts[0];
        int attempts = Integer.parseInt(parts[1]);

        if (attempts >= MAX_ATTEMPTS) {
            redisTemplate.delete(otpKey);
            throw new RuntimeException("Too many wrong attempts. Please request a new OTP.");
        }

        if (!storedOtp.equals(submittedOtp)) {
            // Increment attempts
            redisTemplate.opsForValue().set(otpKey, storedOtp + ":" + (attempts + 1),
                    redisTemplate.getExpire(otpKey, java.util.concurrent.TimeUnit.SECONDS),
                    java.util.concurrent.TimeUnit.SECONDS);
            throw new RuntimeException("Incorrect OTP. " + (MAX_ATTEMPTS - attempts - 1) + " attempts remaining.");
        }

        // OTP correct — delete it (single use)
        redisTemplate.delete(otpKey);
        return true;
    }

    // ── Generate 6-digit OTP ─────────────────────────────────────
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // ── MSG91 API call ───────────────────────────────────────────
    private void sendViaMSG91(String phone, String otp) {
        try {
            RestClient restClient = RestClient.create();
            String indianPhone = "91" + phone;  // Add country code

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
