package com.bookmyvendor.admin.service;

import com.bookmyvendor.admin.dto.AdminDashboardStatsDto;
import com.bookmyvendor.admin.dto.KycActionRequest;
import com.bookmyvendor.auth.entity.User;
import com.bookmyvendor.auth.entity.VendorProfile;
import com.bookmyvendor.auth.repository.UserRepository;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.booking.repository.BookingRequestRepository;
import com.bookmyvendor.payment.repository.PaymentTransactionRepository;
import com.bookmyvendor.vendor.dto.VendorProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final BookingRequestRepository bookingRequestRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public AdminDashboardStatsDto getDashboardStats() {
        long customers = userRepository.countByRole(User.Role.CUSTOMER);
        long vendors = userRepository.countByRole(User.Role.VENDOR);
        long pendingKyc = vendorProfileRepository.countByKycStatus(VendorProfile.KycStatus.PENDING);
        long totalBookings = bookingRequestRepository.count();
        BigDecimal totalRevenue = paymentTransactionRepository.sumSuccessfulPayments();

        return AdminDashboardStatsDto.builder()
                .totalCustomers(customers)
                .totalVendors(vendors)
                .pendingKycCount(pendingKyc)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .build();
    }

    public List<VendorProfileDto> getPendingKycVendors() {
        return vendorProfileRepository.findByKycStatus(VendorProfile.KycStatus.PENDING)
                .stream()
                .map(VendorProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public VendorProfileDto processKyc(UUID vendorProfileId, KycActionRequest action) {
        VendorProfile profile = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        profile.setKycStatus(action.getStatus());
        if (action.getStatus() == VendorProfile.KycStatus.REJECTED) {
            profile.setKycRejectionNote(action.getRejectionNote());
        } else {
            profile.setKycRejectionNote(null);
        }

        VendorProfile saved = vendorProfileRepository.save(profile);
        return VendorProfileDto.fromEntity(saved);
    }
}
