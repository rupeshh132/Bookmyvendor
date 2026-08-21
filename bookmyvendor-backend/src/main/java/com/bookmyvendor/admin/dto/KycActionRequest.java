package com.bookmyvendor.admin.dto;

import com.bookmyvendor.auth.entity.VendorProfile;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KycActionRequest {
    @NotNull
    private VendorProfile.KycStatus status;
    private String rejectionNote;
}
