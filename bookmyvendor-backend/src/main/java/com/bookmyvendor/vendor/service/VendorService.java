package com.bookmyvendor.vendor.service;

import com.bookmyvendor.auth.entity.VendorProfile;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.vendor.dto.UpdateVendorProfileRequest;
import com.bookmyvendor.vendor.dto.VendorProfileDto;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorProfileRepository vendorProfileRepository;
    
    // SRID 4326 for WGS84 (Standard GPS)
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    // ── Vendor Dashboard: Get Own Profile ───────────────────────────
    public VendorProfileDto getVendorProfile(UUID userId) {
        VendorProfile profile = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));
        return VendorProfileDto.fromEntity(profile);
    }

    // ── Vendor Dashboard: Update Profile ────────────────────────────
    @Transactional
    public VendorProfileDto updateProfile(UUID userId, UpdateVendorProfileRequest req) {
        VendorProfile profile = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        profile.setBusinessName(req.getBusinessName());
        profile.setBio(req.getBio());
        profile.setBasePrice(req.getBasePrice());
        profile.setPriceUnit(req.getPriceUnit());
        profile.setCity(req.getCity());
        profile.setState(req.getState());
        
        if (req.getServiceRadiusKm() != null) {
            profile.setServiceRadiusKm(req.getServiceRadiusKm());
        }

        if (req.getLatitude() != null && req.getLongitude() != null) {
            Point point = geometryFactory.createPoint(new Coordinate(req.getLongitude(), req.getLatitude()));
            profile.setLocationPoint(point);
        }

        VendorProfile updated = vendorProfileRepository.save(profile);
        return VendorProfileDto.fromEntity(updated);
    }

    // ── Customer View: Search by Category & City ────────────────────
    public List<VendorProfileDto> searchVendors(String category, String city) {
        List<VendorProfile> vendors = vendorProfileRepository
                .findByCategoryAndCityAndKycStatus(category, city, VendorProfile.KycStatus.APPROVED);
                
        return vendors.stream()
                .map(VendorProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Customer View: Search by Radius (PostGIS) ───────────────────
    public List<VendorProfileDto> searchVendorsInRadius(String category, double lat, double lon, double radiusKm) {
        double radiusMeters = radiusKm * 1000;
        List<VendorProfile> vendors = vendorProfileRepository
                .searchVendorsInRadius(category, lat, lon, radiusMeters);
                
        return vendors.stream()
                .map(VendorProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Public View: Get Single Vendor by ID ────────────────────────
    public VendorProfileDto getVendorById(UUID vendorId) {
        VendorProfile profile = vendorProfileRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        return VendorProfileDto.fromEntity(profile);
    }
}
