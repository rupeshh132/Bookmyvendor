package com.bookmyvendor.auth.dto;

import com.bookmyvendor.auth.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn;          // seconds
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private UUID id;
        private String email;
        private String phone;
        private String fullName;
        private User.Role role;
        private boolean emailVerified;
        private boolean phoneVerified;
        private boolean profileComplete; // false → redirect to profile setup
    }
}
