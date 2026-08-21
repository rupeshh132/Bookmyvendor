package com.bookmyvendor.vendor.controller;

import com.bookmyvendor.common.dto.ApiResponse;
import com.bookmyvendor.vendor.dto.PortfolioImageDto;
import com.bookmyvendor.vendor.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // ── Public: Get Portfolio for a specific vendor ─────────────────
    @GetMapping("/{vendorProfileId}/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioImageDto>>> getVendorPortfolio(@PathVariable UUID vendorProfileId) {
        List<PortfolioImageDto> images = portfolioService.getVendorPortfolio(vendorProfileId);
        return ResponseEntity.ok(ApiResponse.success(images, "Portfolio retrieved successfully"));
    }

    // ── Protected: Get Own Portfolio ────────────────────────────────
    @GetMapping("/me/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioImageDto>>> getMyPortfolio(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        List<PortfolioImageDto> images = portfolioService.getMyPortfolio(userId);
        return ResponseEntity.ok(ApiResponse.success(images, "Your portfolio retrieved"));
    }

    // ── Protected: Upload Image to Portfolio ────────────────────────
    @PostMapping("/me/portfolio")
    public ResponseEntity<ApiResponse<PortfolioImageDto>> uploadImage(
            Principal principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        UUID userId = UUID.fromString(principal.getName());
        PortfolioImageDto image = portfolioService.uploadImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(image, "Image uploaded successfully"));
    }

    // ── Protected: Delete Image from Portfolio ──────────────────────
    @DeleteMapping("/me/portfolio/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            Principal principal,
            @PathVariable UUID imageId
    ) {
        UUID userId = UUID.fromString(principal.getName());
        portfolioService.deleteImage(userId, imageId);
        return ResponseEntity.ok(ApiResponse.success(null, "Image deleted successfully"));
    }
}
