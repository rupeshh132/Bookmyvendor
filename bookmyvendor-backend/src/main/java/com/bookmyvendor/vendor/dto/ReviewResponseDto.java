package com.bookmyvendor.vendor.dto;

import com.bookmyvendor.vendor.entity.VendorReview;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewResponseDto {
    private UUID id;
    private UUID vendorId;
    private UUID customerId;
    private String customerName;
    private UUID bookingId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponseDto fromEntity(VendorReview review) {
        return ReviewResponseDto.builder()
                .id(review.getId())
                .vendorId(review.getVendor().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getFullName())
                .bookingId(review.getBooking().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
