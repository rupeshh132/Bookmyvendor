package com.bookmyvendor.admin.controller;

import com.bookmyvendor.admin.dto.AdminDashboardStatsDto;
import com.bookmyvendor.admin.dto.KycActionRequest;
import com.bookmyvendor.admin.service.AdminService;
import com.bookmyvendor.common.dto.ApiResponse;
import com.bookmyvendor.vendor.dto.VendorProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats(), "Admin stats retrieved"));
    }

    @GetMapping("/kyc-queue")
    public ResponseEntity<ApiResponse<List<VendorProfileDto>>> getKycQueue() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingKycVendors(), "KYC queue retrieved"));
    }

    @PutMapping("/kyc/{vendorProfileId}")
    public ResponseEntity<ApiResponse<VendorProfileDto>> processKyc(
            @PathVariable UUID vendorProfileId,
            @Valid @RequestBody KycActionRequest action
    ) {
        VendorProfileDto updated = adminService.processKyc(vendorProfileId, action);
        return ResponseEntity.ok(ApiResponse.success(updated, "KYC status updated successfully"));
    }
}
