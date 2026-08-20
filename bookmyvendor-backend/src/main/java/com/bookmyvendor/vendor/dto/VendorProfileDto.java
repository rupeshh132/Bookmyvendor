package com.bookmyvendor.vendor.dto;

import com.bookmyvendor.auth.entity.VendorProfile;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class VendorProfileDto {
    private UUID id;
    private UUID userId;
    private String businessName;
    private String category;
    private String city;
    private String state;
    private String bio;
    private BigDecimal basePrice;
    private String priceUnit;
    private Integer serviceRadiusKm;
    
    // Stats
    private BigDecimal avgRating;
    private Integer totalReviews;
    private BigDecimal trustScore;
    
    // Status
    private VendorProfile.KycStatus kycStatus;
    private boolean isFeatured;

    // Optional location for returning to client
    private Double latitude;
    private Double longitude;

    public static VendorProfileDto fromEntity(VendorProfile entity) {
        Double lat = null;
        Double lon = null;
        if (entity.getLocationPoint() != null) {
            lat = entity.getLocationPoint().getY();
            lon = entity.getLocationPoint().getX();
        }

        return VendorProfileDto.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .businessName(entity.getBusinessName())
                .category(entity.getCategory())
                .city(entity.getCity())
                .state(entity.getState())
                .bio(entity.getBio())
                .basePrice(entity.getBasePrice())
                .priceUnit(entity.getPriceUnit())
                .serviceRadiusKm(entity.getServiceRadiusKm())
                .avgRating(entity.getAvgRating())
                .totalReviews(entity.getTotalReviews())
                .trustScore(entity.getTrustScore())
                .kycStatus(entity.getKycStatus())
                .isFeatured(entity.isFeatured())
                .latitude(lat)
                .longitude(lon)
                .build();
    }
}
