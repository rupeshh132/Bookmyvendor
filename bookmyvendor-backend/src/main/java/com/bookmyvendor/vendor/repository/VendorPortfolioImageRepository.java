package com.bookmyvendor.vendor.repository;

import com.bookmyvendor.vendor.entity.VendorPortfolioImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorPortfolioImageRepository extends JpaRepository<VendorPortfolioImage, UUID> {
    List<VendorPortfolioImage> findByVendorProfileIdOrderByDisplayOrderAsc(UUID vendorProfileId);
    Optional<VendorPortfolioImage> findByIdAndVendorProfileId(UUID id, UUID vendorProfileId);
}
