package com.bookmyvendor.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    // email OR phone — at least one required (validated in service)
    private String email;
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;
}
