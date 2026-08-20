package com.bookmyvendor.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateVendorProfileRequest {
    @NotBlank(message = "Business name is required")
    private String businessName;

    private String bio;

    private BigDecimal basePrice;
    
    private String priceUnit;

    @NotBlank(message = "City is required")
    private String city;

    private String state;

    private Integer serviceRadiusKm;

    // Optional GPS update
    private Double latitude;
    private Double longitude;
}
