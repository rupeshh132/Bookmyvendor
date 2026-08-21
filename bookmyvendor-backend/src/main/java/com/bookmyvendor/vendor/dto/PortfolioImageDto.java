package com.bookmyvendor.vendor.dto;

import com.bookmyvendor.vendor.entity.VendorPortfolioImage;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PortfolioImageDto {
    private UUID id;
    private String imageUrl;
    private String publicId;
    private Integer displayOrder;

    public static PortfolioImageDto fromEntity(VendorPortfolioImage entity) {
        return PortfolioImageDto.builder()
                .id(entity.getId())
                .imageUrl(entity.getImageUrl())
                .publicId(entity.getPublicId())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }
}
