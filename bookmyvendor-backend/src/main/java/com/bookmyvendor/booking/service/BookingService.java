package com.bookmyvendor.booking.service;

import com.bookmyvendor.auth.entity.CustomerProfile;
import com.bookmyvendor.auth.entity.User;
import com.bookmyvendor.auth.entity.VendorProfile;
import com.bookmyvendor.auth.repository.CustomerProfileRepository;
import com.bookmyvendor.auth.repository.UserRepository;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.booking.dto.BookingRequestDto;
import com.bookmyvendor.booking.dto.CreateBookingRequestDto;
import com.bookmyvendor.booking.entity.BookingRequest;
import com.bookmyvendor.booking.repository.BookingRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRequestRepository bookingRequestRepository;
    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Transactional
    public BookingRequestDto createRequest(UUID customerUserId, CreateBookingRequestDto dto) {
        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        VendorProfile vendor = vendorProfileRepository.findById(dto.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

        BookingRequest request = BookingRequest.builder()
                .customer(customer)
                .vendor(vendor)
                .eventType(dto.getEventType())
                .eventDate(dto.getEventDate())
                .guestCount(dto.getGuestCount())
                .message(dto.getMessage())
                .status(BookingRequest.RequestStatus.PENDING)
                .build();

        BookingRequest saved = bookingRequestRepository.save(request);

        String customerName = getCustomerName(customerUserId, customer.getEmail());
        return BookingRequestDto.fromEntity(saved, customerName);
    }

    public List<BookingRequestDto> getMyRequestsAsCustomer(UUID customerUserId) {
        return bookingRequestRepository.findByCustomerIdOrderByCreatedAtDesc(customerUserId)
                .stream()
                .map(req -> BookingRequestDto.fromEntity(req, getCustomerName(customerUserId, req.getCustomer().getEmail())))
                .collect(Collectors.toList());
    }

    public List<BookingRequestDto> getMyRequestsAsVendor(UUID vendorUserId) {
        VendorProfile profile = vendorProfileRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        return bookingRequestRepository.findByVendorIdOrderByCreatedAtDesc(profile.getId())
                .stream()
                .map(req -> BookingRequestDto.fromEntity(req, getCustomerName(req.getCustomer().getId(), req.getCustomer().getEmail())))
                .collect(Collectors.toList());
    }

    private String getCustomerName(UUID userId, String fallbackEmail) {
        return customerProfileRepository.findByUserId(userId)
                .map(CustomerProfile::getFullName)
                .orElse(fallbackEmail);
    }
}
