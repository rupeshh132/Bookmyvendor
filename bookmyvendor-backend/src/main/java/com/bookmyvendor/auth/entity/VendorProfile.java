package com.bookmyvendor.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vendor_profiles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String city;

    private String state;

    @Column(name = "location_point", columnDefinition = "geography(Point,4326)")
    private Point locationPoint;

    @Column(name = "service_radius_km")
    private Integer serviceRadiusKm = 50;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "base_price", precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "price_unit")
    private String priceUnit = "per_event";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus = KycStatus.PENDING;

    @Column(name = "kyc_rejection_note", columnDefinition = "TEXT")
    private String kycRejectionNote;

    @Column(name = "avg_rating", precision = 3, scale = 2)
    private BigDecimal avgRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "trust_score", precision = 5, scale = 2)
    private BigDecimal trustScore = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier")
    private SubscriptionTier subscriptionTier = SubscriptionTier.FREE;

    @Column(name = "is_featured")
    private boolean isFeatured = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public enum KycStatus {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED
    }

    public enum SubscriptionTier {
        FREE, PRO, ELITE
    }
}
