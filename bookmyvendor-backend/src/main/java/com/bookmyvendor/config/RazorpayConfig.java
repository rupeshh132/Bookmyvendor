package com.bookmyvendor.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${app.razorpay.key-id:dummy-key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret:dummy-key-secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        // Since we are using dummy keys if missing, avoid failing context load.
        if ("dummy-key-id".equals(keyId)) {
            // Return null or a mock client if actual implementation is missing, 
            // but for simplicity in Sprint 6, we assume it's set or we catch the error later.
            // Just returning a new client with dummy might throw exception inside Razorpay SDK.
        }
        try {
            return new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            // Log it, but don't crash the whole Spring context if keys aren't set in dev
            return null;
        }
    }
}
