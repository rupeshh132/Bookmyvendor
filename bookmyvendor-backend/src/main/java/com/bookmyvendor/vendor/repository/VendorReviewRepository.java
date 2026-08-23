package com.bookmyvendor.vendor.repository;

import com.bookmyvendor.vendor.entity.VendorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VendorReviewRepository extends JpaRepository<VendorReview, UUID> {
    
    List<VendorReview> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);
    
    boolean existsByBookingId(UUID bookingId);

    @Query("SELECT COUNT(r) FROM VendorReview r WHERE r.vendor.id = :vendorId")
    long countByVendorId(@Param("vendorId") UUID vendorId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM VendorReview r WHERE r.vendor.id = :vendorId")
    double getAverageRatingByVendorId(@Param("vendorId") UUID vendorId);
}
