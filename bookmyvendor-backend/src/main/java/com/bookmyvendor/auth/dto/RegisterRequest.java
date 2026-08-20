package com.bookmyvendor.auth.dto;

import com.bookmyvendor.auth.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    // ── Customer fields ──────────────────────────────────────────
    // At least email OR phone required (validated in service)
    @Email(message = "Valid email required")
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Valid 10-digit Indian phone number required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Role is required")
    private User.Role role;   // CUSTOMER or VENDOR

    // ── Common ───────────────────────────────────────────────────
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
    private String fullName;   // For CUSTOMER: full name | For VENDOR: business name

    // ── Vendor-only fields (required if role = VENDOR) ───────────
    private String category;   // e.g., PHOTOGRAPHER, CATERER

    @Size(max = 100)
    private String city;
}
