package com.bookmyvendor.booking.controller;

import com.bookmyvendor.booking.dto.BookingRequestDto;
import com.bookmyvendor.booking.dto.CreateBookingRequestDto;
import com.bookmyvendor.booking.service.BookingService;
import com.bookmyvendor.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ── Customer: Create a Request ────────────────────────────────
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<BookingRequestDto>> createRequest(
            Principal principal,
            @Valid @RequestBody CreateBookingRequestDto req
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        BookingRequestDto result = bookingService.createRequest(customerUserId, req);
        return ResponseEntity.ok(ApiResponse.success(result, "Booking request sent successfully"));
    }

    // ── Customer: View own requests ───────────────────────────────
    @GetMapping("/customer")
    public ResponseEntity<ApiResponse<List<BookingRequestDto>>> getCustomerRequests(Principal principal) {
        UUID customerUserId = UUID.fromString(principal.getName());
        List<BookingRequestDto> results = bookingService.getMyRequestsAsCustomer(customerUserId);
        return ResponseEntity.ok(ApiResponse.success(results, "Fetched customer requests"));
    }

    // ── Vendor: View incoming requests ────────────────────────────
    @GetMapping("/vendor")
    public ResponseEntity<ApiResponse<List<BookingRequestDto>>> getVendorRequests(Principal principal) {
        UUID vendorUserId = UUID.fromString(principal.getName());
        List<BookingRequestDto> results = bookingService.getMyRequestsAsVendor(vendorUserId);
        return ResponseEntity.ok(ApiResponse.success(results, "Fetched vendor requests"));
    }

    // ── Vendor: Send Quote ────────────────────────────────────────
    @PutMapping("/{id}/quote")
    public ResponseEntity<ApiResponse<BookingRequestDto>> sendQuote(
            Principal principal,
            @PathVariable UUID id,
            @RequestParam BigDecimal amount
    ) {
        UUID vendorUserId = UUID.fromString(principal.getName());
        BookingRequestDto result = bookingService.sendQuote(vendorUserId, id, amount);
        return ResponseEntity.ok(ApiResponse.success(result, "Quote sent successfully"));
    }

    // ── Customer: Accept Quote ────────────────────────────────────
    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<BookingRequestDto>> acceptQuote(
            Principal principal,
            @PathVariable UUID id
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        BookingRequestDto result = bookingService.acceptQuote(customerUserId, id);
        return ResponseEntity.ok(ApiResponse.success(result, "Quote accepted successfully"));
    }

    // ── Vendor: Reject Request ────────────────────────────────────
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BookingRequestDto>> rejectRequest(
            Principal principal,
            @PathVariable UUID id
    ) {
        UUID vendorUserId = UUID.fromString(principal.getName());
        BookingRequestDto result = bookingService.rejectRequest(vendorUserId, id);
        return ResponseEntity.ok(ApiResponse.success(result, "Booking request rejected"));
    }

    // ── Customer: Cancel Request ──────────────────────────────────
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingRequestDto>> cancelRequest(
            Principal principal,
            @PathVariable UUID id
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        BookingRequestDto result = bookingService.cancelRequest(customerUserId, id);
        return ResponseEntity.ok(ApiResponse.success(result, "Booking request cancelled"));
    }
}
