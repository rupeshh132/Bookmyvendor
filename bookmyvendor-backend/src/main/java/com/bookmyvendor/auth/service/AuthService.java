package com.bookmyvendor.auth.service;

import com.bookmyvendor.auth.dto.*;
import com.bookmyvendor.auth.entity.*;
import com.bookmyvendor.auth.repository.*;
import com.bookmyvendor.auth.repository.CustomerProfileRepository;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final OAuthAccountRepository oAuthAccountRepository;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.access-token-expiry-ms}")
    private long accessTokenExpiryMs;

    // ══════════════════════════════════════════════════════════════
    // 1. EMAIL/PASSWORD REGISTER
    // ══════════════════════════════════════════════════════════════
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        // Validate: at least email OR phone
        if (!StringUtils.hasText(req.getEmail()) && !StringUtils.hasText(req.getPhone())) {
            throw new IllegalArgumentException("Email or phone number is required.");
        }
        // Validate vendor fields
        if (req.getRole() == User.Role.VENDOR) {
            if (!StringUtils.hasText(req.getCategory())) throw new IllegalArgumentException("Category is required for vendors.");
            if (!StringUtils.hasText(req.getCity()))     throw new IllegalArgumentException("City is required for vendors.");
        }
        // Check duplicates
        if (StringUtils.hasText(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        if (StringUtils.hasText(req.getPhone()) && userRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("An account with this phone number already exists.");
        }

        // Create user
        User user = User.builder()
                .email(req.getEmail())
                .phone(req.getPhone())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .authProvider(User.AuthProvider.LOCAL)
                .isActive(true)
                .build();
                userRepository.save(user);

        // Create Profile based on Role
        if (req.getRole() == User.Role.CUSTOMER) {
            CustomerProfile customerProfile = CustomerProfile.builder()
                    .user(user)
                    .fullName(req.getFullName())
                    .build();
            customerProfileRepository.save(customerProfile);
        } else if (req.getRole() == User.Role.VENDOR) {
            VendorProfile vendorProfile = VendorProfile.builder()
                    .user(user)
                    .businessName(req.getFullName())
                    .category(req.getCategory())
                    .city(req.getCity())
                    .kycStatus(VendorProfile.KycStatus.PENDING)
                    .build();
            vendorProfileRepository.save(vendorProfile);
        }

        // Send welcome email async
        if (StringUtils.hasText(req.getEmail())) {
            emailService.sendWelcomeEmail(req.getEmail(), req.getFullName());
        }

        log.info("New user registered: {} [{}]", user.getId(), req.getRole());
        return buildAuthResponse(user, req.getFullName(), false);
    }

    // ══════════════════════════════════════════════════════════════
    // 2. EMAIL/PASSWORD LOGIN
    // ══════════════════════════════════════════════════════════════
    public AuthResponse login(LoginRequest req) {
        User user;
        if (StringUtils.hasText(req.getEmail())) {
            user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("No account found with this email."));
        } else if (StringUtils.hasText(req.getPhone())) {
            user = userRepository.findByPhone(req.getPhone())
                    .orElseThrow(() -> new IllegalArgumentException("No account found with this phone number."));
        } else {
            throw new IllegalArgumentException("Email or phone is required.");
        }

        if (user.getAuthProvider() != User.AuthProvider.LOCAL) {
            throw new IllegalArgumentException("This account uses Google login. Please sign in with Google.");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password. Please try again.");
        }
        if (!user.isActive()) {
            throw new IllegalArgumentException("Your account has been deactivated. Contact support.");
        }

        return buildAuthResponse(user, null, false);
    }

    // ══════════════════════════════════════════════════════════════
    // 3. PHONE OTP LOGIN
    // ══════════════════════════════════════════════════════════════
    public void sendLoginOtp(String phone) {
        otpService.sendOtp(phone);
    }

    @Transactional
    public AuthResponse verifyOtpAndLogin(OtpVerifyRequest req) {
        otpService.verifyOtp(req.getPhone(), req.getOtp());

        // Find or create user by phone
        User user = userRepository.findByPhone(req.getPhone()).orElseGet(() -> {
            User newUser = User.builder()
                    .phone(req.getPhone())
                    .role(User.Role.CUSTOMER)  // default — will complete profile
                    .authProvider(User.AuthProvider.LOCAL)
                    .phoneVerified(true)
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        user.setPhoneVerified(true);
                userRepository.save(user);



        boolean profileIncomplete = user.getEmail() == null && user.getPhone() != null
                && !StringUtils.hasText(user.getPasswordHash());

        return buildAuthResponse(user, null, profileIncomplete);
    }

    // ══════════════════════════════════════════════════════════════
    // 4. GOOGLE OAUTH LOGIN
    // (Called after frontend sends Google ID token)
    // ══════════════════════════════════════════════════════════════
    @Transactional
    public AuthResponse loginWithGoogle(String idToken) {
        try {
            com.google.firebase.auth.FirebaseToken decodedToken = com.google.firebase.auth.FirebaseAuth.getInstance().verifyIdToken(idToken);
            String googleId = decodedToken.getUid();
            String email = decodedToken.getEmail();
            String name = (String) decodedToken.getClaims().get("name");

            OAuthAccount oauthAccount = oAuthAccountRepository
                    .findByProviderAndProviderId(OAuthAccount.OAuthProvider.GOOGLE, googleId)
                    .orElse(null);
    
            User user;
            if (oauthAccount != null) {
                user = oauthAccount.getUser();
            } else {
                user = userRepository.findByEmail(email).orElse(null);
                if (user != null && user.getAuthProvider() == User.AuthProvider.LOCAL) {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                } else if (user == null) {
                                        user = User.builder()
                            .email(email)
                            
                            .phone("GOOG_" + googleId.substring(0, Math.min(10, googleId.length())))
                            .passwordHash("")
                            .authProvider(User.AuthProvider.GOOGLE)
                            .role(User.Role.CUSTOMER)
                            .isEmailVerified(true)
                            .isActive(true)
                            .build();
                    userRepository.save(user);
                }
                OAuthAccount newOAuth = OAuthAccount.builder()
                        .user(user)
                        .provider(OAuthAccount.OAuthProvider.GOOGLE)
                        .providerId(googleId)
                        .providerEmail(email)
                        .build();
                oAuthAccountRepository.save(newOAuth);
            }
            return buildAuthResponse(user, name, false);
        } catch (Exception e) {
            log.error("Firebase token verification failed. Exception: ", e); e.printStackTrace();
            throw new IllegalArgumentException("Invalid Google token");
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 5. FORGOT PASSWORD
    // ══════════════════════════════════════════════════════════════
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        // Always return success (don't leak if email exists)
        if (user == null) {
            log.warn("Forgot password requested for non-existent email: {}", email);
            return;
        }
        if (user.getAuthProvider() != User.AuthProvider.LOCAL) {
            log.warn("Forgot password requested for OAuth account: {}", email);
            return;
        }

        // Invalidate previous reset tokens
        resetTokenRepository.invalidateAllForUser(user.getId());

        // Generate secure reset token
        String rawToken = UUID.randomUUID().toString() + UUID.randomUUID().toString();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        resetTokenRepository.save(resetToken);

        // Send email async
        String displayName = user.getEmail().split("@")[0];
        emailService.sendPasswordResetEmail(email, rawToken, displayName);

        log.info("Password reset email sent to {}", email);
    }

    // ══════════════════════════════════════════════════════════════
    // 6. RESET PASSWORD
    // ══════════════════════════════════════════════════════════════
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String tokenHash = hashToken(req.getToken());

        PasswordResetToken resetToken = resetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset link."));

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("This reset link has already been used.");
        }
        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("This reset link has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
                userRepository.save(user);



        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        log.info("Password reset successful for user {}", user.getId());
    }

    // ══════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ══════════════════════════════════════════════════════════════
    private AuthResponse buildAuthResponse(User user, String displayName, boolean profileIncomplete) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getRole().name());

        String name = displayName != null ? displayName
                : (user.getEmail() != null ? user.getEmail().split("@")[0] : user.getPhone());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs / 1000)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .fullName(name)
                        .role(user.getRole())
                        .emailVerified(user.isEmailVerified())
                        .phoneVerified(user.isPhoneVerified())
                        .profileComplete(!profileIncomplete)
                        .build())
                .build();
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Token hashing failed", e);
        }
    }
}







