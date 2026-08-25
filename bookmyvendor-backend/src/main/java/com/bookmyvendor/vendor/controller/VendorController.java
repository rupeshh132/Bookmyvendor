package com.bookmyvendor.vendor.controller;

import com.bookmyvendor.common.dto.ApiResponse;
import com.bookmyvendor.vendor.dto.UpdateVendorProfileRequest;
import com.bookmyvendor.vendor.dto.SubmitKycRequest;
import com.bookmyvendor.vendor.dto.VendorProfileDto;
import com.bookmyvendor.vendor.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    // ── Public: Search Vendors ──────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VendorProfileDto>>> searchVendors(
            @RequestParam String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(defaultValue = "50") Double radiusKm
    ) {
        List<VendorProfileDto> results;
        if (lat != null && lon != null) {
            results = vendorService.searchVendorsInRadius(category, lat, lon, radiusKm);
        } else {
            results = vendorService.searchVendors(category, city);
        }
        return ResponseEntity.ok(ApiResponse.success(results, "Vendors found"));
    }

    // ── Public: Get Vendor Details ──────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorProfileDto>> getVendor(@PathVariable UUID id) {
        VendorProfileDto vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(ApiResponse.success(vendor, "Vendor details retrieved"));
    }

    // ── Protected (Vendor Role): Get Own Profile ────────────────────
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<VendorProfileDto>> getMyProfile(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        VendorProfileDto profile = vendorService.getVendorProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved"));
    }

    // ── Protected (Vendor Role): Update Own Profile ─────────────────
    @PutMapping("/me")
        @PostMapping("/me/kyc")
    public ResponseEntity<ApiResponse<VendorProfileDto>> submitKyc(
            Principal principal,
            @Valid @RequestBody SubmitKycRequest req
    ) {
        UUID userId = UUID.fromString(principal.getName());
        VendorProfileDto updated = vendorService.submitKyc(userId, req);
        return ResponseEntity.ok(ApiResponse.success(updated, "KYC submitted successfully"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<VendorProfileDto>> updateMyProfile(
            Principal principal,
            @Valid @RequestBody UpdateVendorProfileRequest req
    ) {
        UUID userId = UUID.fromString(principal.getName());
        VendorProfileDto updated = vendorService.updateProfile(userId, req);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }
}

