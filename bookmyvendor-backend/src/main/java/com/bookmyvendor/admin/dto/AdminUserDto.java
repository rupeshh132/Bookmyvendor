package com.bookmyvendor.admin.dto;

import com.bookmyvendor.auth.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminUserDto {
    private UUID id;
    private String email;
    private String phone;
    private User.Role role;
    private boolean isActive;
    private LocalDateTime createdAt;
}