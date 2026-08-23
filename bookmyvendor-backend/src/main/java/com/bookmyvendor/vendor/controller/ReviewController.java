package com.bookmyvendor.vendor.controller;

import com.bookmyvendor.common.dto.ApiResponse;
import com.bookmyvendor.vendor.dto.ReviewRequestDto;
import com.bookmyvendor.vendor.dto.ReviewResponseDto;
import com.bookmyvendor.vendor.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponseDto>> addReview(
            Principal principal,
            @Valid @RequestBody ReviewRequestDto req
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        ReviewResponseDto result = reviewService.addReview(customerUserId, req);
        return ResponseEntity.ok(ApiResponse.success(result, "Review added successfully"));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDto>>> getVendorReviews(@PathVariable UUID vendorId) {
        List<ReviewResponseDto> results = reviewService.getReviewsForVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success(results, "Reviews retrieved"));
    }
}
