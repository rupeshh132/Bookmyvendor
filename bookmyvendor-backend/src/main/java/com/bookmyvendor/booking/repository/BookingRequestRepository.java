package com.bookmyvendor.booking.repository;

import com.bookmyvendor.booking.entity.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, UUID> {
    List<BookingRequest> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    List<BookingRequest> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);
}
