package com.bookmyvendor.auth.repository;

import com.bookmyvendor.auth.entity.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, UUID> {
    Optional<VendorProfile> findByUserId(UUID userId);

    // Basic search by category and city
    List<VendorProfile> findByCategoryAndCityAndKycStatus(
            String category, 
            String city, 
            VendorProfile.KycStatus kycStatus
    );

    // Advanced search: PostGIS radius search (native query) using ST_DWithin
    // Requires lat/lon input and distance in meters
    @Query(value = "SELECT * FROM vendor_profiles v " +
            "WHERE v.category = :category " +
            "AND v.kyc_status = 'APPROVED' " +
            "AND v.deleted_at IS NULL " +
            "AND ST_DWithin(v.location_point, ST_MakePoint(:lon, :lat)::geography, :radiusMeters) " +
            "ORDER BY v.trust_score DESC, v.avg_rating DESC", nativeQuery = true)
    List<VendorProfile> searchVendorsInRadius(
            @Param("category") String category,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") double radiusMeters
    );
    List<VendorProfile> findByKycStatus(VendorProfile.KycStatus kycStatus);
    long countByKycStatus(VendorProfile.KycStatus kycStatus);
}

