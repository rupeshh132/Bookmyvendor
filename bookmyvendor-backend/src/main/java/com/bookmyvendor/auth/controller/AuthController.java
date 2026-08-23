package com.bookmyvendor.auth.controller;

import com.bookmyvendor.auth.dto.*;
import com.bookmyvendor.auth.service.AuthService;
import com.bookmyvendor.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ── POST /api/v1/auth/register ──────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse auth = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(auth, "Registration successful"));
    }

    // ── POST /api/v1/auth/login ─────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse auth = authService.login(req);
        return ResponseEntity.ok(ApiResponse.success(auth, "Login successful"));
    }

    // ── POST /api/v1/auth/otp/send ──────────────────────────────
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpSendRequest req) {
        authService.sendLoginOtp(req.getPhone());
        return ResponseEntity.ok(ApiResponse.success(null, "OTP sent to " + maskPhone(req.getPhone())));
    }

    // ── POST /api/v1/auth/otp/verify ────────────────────────────
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest req) {
        AuthResponse auth = authService.verifyOtpAndLogin(req);
        return ResponseEntity.ok(ApiResponse.success(auth, "OTP verified successfully"));
    }

    // ── POST /api/v1/auth/google ─────────────────────────────────
    // Frontend sends Google ID token → backend verifies and issues JWT
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");

        if (idToken == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("idToken is required"));
        }

        AuthResponse auth = authService.loginWithGoogle(idToken);
        return ResponseEntity.ok(ApiResponse.success(auth, "Google login successful"));
    }

    // ── POST /api/v1/auth/forgot-password ───────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.getEmail());
        // Always return 200 (don't leak whether email exists)
        return ResponseEntity.ok(ApiResponse.success(null,
                "If an account exists with that email, a reset link has been sent."));
    }

    // ── POST /api/v1/auth/reset-password ────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successful. Please login."));
    }

    // ── Mask phone for response (e.g., 98****7654) ──────────────
    private String maskPhone(String phone) {
        if (phone.length() < 6) return phone;
        return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 4);
    }
}
