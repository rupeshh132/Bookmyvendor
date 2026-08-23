package com.bookmyvendor.vendor.service;

import com.bookmyvendor.auth.entity.CustomerProfile;
import com.bookmyvendor.auth.entity.VendorProfile;
import com.bookmyvendor.auth.repository.CustomerProfileRepository;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.booking.entity.BookingRequest;
import com.bookmyvendor.booking.repository.BookingRequestRepository;
import com.bookmyvendor.vendor.dto.ReviewRequestDto;
import com.bookmyvendor.vendor.dto.ReviewResponseDto;
import com.bookmyvendor.vendor.entity.VendorReview;
import com.bookmyvendor.vendor.repository.VendorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final VendorReviewRepository reviewRepository;
    private final BookingRequestRepository bookingRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final VendorProfileRepository vendorProfileRepository;

    @Transactional
    public ReviewResponseDto addReview(UUID customerUserId, ReviewRequestDto req) {
        CustomerProfile customer = customerProfileRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found"));

        BookingRequest booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not authorized to review this booking");
        }

        if (booking.getStatus() != BookingRequest.RequestStatus.ACCEPTED) {
            throw new IllegalStateException("You can only review accepted bookings");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new IllegalStateException("You have already reviewed this booking");
        }

        VendorProfile vendor = booking.getVendor();

        VendorReview review = VendorReview.builder()
                .vendor(vendor)
                .customer(customer)
                .booking(booking)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        VendorReview savedReview = reviewRepository.save(review);

        // Transactional Recalculation
        long count = reviewRepository.countByVendorId(vendor.getId());
        double avg = reviewRepository.getAverageRatingByVendorId(vendor.getId());

        vendor.setTotalReviews((int) count);
        vendor.setAvgRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        
        vendorProfileRepository.save(vendor);

        return ReviewResponseDto.fromEntity(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviewsForVendor(UUID vendorId) {
        return reviewRepository.findByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
