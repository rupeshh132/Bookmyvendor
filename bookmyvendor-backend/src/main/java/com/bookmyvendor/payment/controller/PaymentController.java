package com.bookmyvendor.payment.controller;

import com.bookmyvendor.common.dto.ApiResponse;
import com.bookmyvendor.payment.dto.PaymentOrderResponse;
import com.bookmyvendor.payment.dto.PaymentVerificationRequest;
import com.bookmyvendor.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            Principal principal,
            @PathVariable UUID bookingId
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        PaymentOrderResponse response = paymentService.createAdvancePaymentOrder(customerUserId, bookingId);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment order created"));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(
            Principal principal,
            @Valid @RequestBody PaymentVerificationRequest req
    ) {
        UUID customerUserId = UUID.fromString(principal.getName());
        paymentService.verifyPayment(customerUserId, req);
        return ResponseEntity.ok(ApiResponse.success(null, "Payment verified successfully. Booking confirmed!"));
    }
}
