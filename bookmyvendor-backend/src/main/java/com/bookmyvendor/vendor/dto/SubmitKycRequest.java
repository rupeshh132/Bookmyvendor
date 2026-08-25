package com.bookmyvendor.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmitKycRequest {
    @NotBlank(message = "Aadhar number is required")
    private String aadharNumber;

    @NotBlank(message = "PAN number is required")
    private String panNumber;
}
