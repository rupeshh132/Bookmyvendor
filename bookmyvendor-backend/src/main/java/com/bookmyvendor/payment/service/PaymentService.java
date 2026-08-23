package com.bookmyvendor.payment.service;

import com.bookmyvendor.booking.entity.BookingRequest;
import com.bookmyvendor.booking.repository.BookingRequestRepository;
import com.bookmyvendor.payment.dto.PaymentOrderResponse;
import com.bookmyvendor.payment.dto.PaymentVerificationRequest;
import com.bookmyvendor.payment.entity.PaymentTransaction;
import com.bookmyvendor.payment.repository.PaymentTransactionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final BookingRequestRepository bookingRequestRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${app.razorpay.key-id:dummy-key-id}")
    private String keyId;
    
    @Value("${app.razorpay.key-secret:dummy-key-secret}")
    private String keySecret;

    @Transactional
    public PaymentOrderResponse createAdvancePaymentOrder(UUID customerUserId, UUID bookingId) {
        BookingRequest booking = bookingRequestRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customerUserId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        if (booking.getStatus() != BookingRequest.RequestStatus.QUOTED) {
            throw new IllegalArgumentException("Can only pay advance for QUOTED bookings");
        }

        // Calculate 20% advance
        BigDecimal advanceAmount = booking.getQuotedAmount().multiply(new BigDecimal("0.20"));
        int amountInPaise = advanceAmount.multiply(new BigDecimal("100")).intValue();

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + bookingId.toString().substring(0, 8));

            String orderId;
            if (razorpayClient != null) {
                Order order = razorpayClient.orders.create(orderRequest);
                orderId = order.get("id");
            } else {
                // Mock behavior if client failed to init (dev mode without real keys)
                orderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 8);
            }

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .bookingRequest(booking)
                    .razorpayOrderId(orderId)
                    .amount(advanceAmount)
                    .currency("INR")
                    .paymentType(PaymentTransaction.PaymentType.ADVANCE)
                    .status(PaymentTransaction.PaymentStatus.CREATED)
                    .build();

            paymentTransactionRepository.save(transaction);

            return PaymentOrderResponse.builder()
                    .orderId(orderId)
                    .amount(advanceAmount)
                    .currency("INR")
                    .keyId(keyId)
                    .build();

        } catch (Exception e) {
            log.error("Failed to create Razorpay order", e);
            throw new RuntimeException("Failed to initiate payment", e);
        }
    }

    @Transactional
    public void verifyPayment(UUID customerUserId, PaymentVerificationRequest req) {
        PaymentTransaction txn = paymentTransactionRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (!txn.getBookingRequest().getCustomer().getId().equals(customerUserId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        try {
            if (razorpayClient != null) {
                // Verify signature using Razorpay Utils
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", req.getRazorpayOrderId());
                options.put("razorpay_payment_id", req.getRazorpayPaymentId());
                options.put("razorpay_signature", req.getRazorpaySignature());

                boolean status = Utils.verifyPaymentSignature(options, keySecret);
                if (!status) {
                    throw new IllegalArgumentException("Invalid payment signature");
                }
            }

            // Update Transaction
            txn.setRazorpayPaymentId(req.getRazorpayPaymentId());
            txn.setRazorpaySignature(req.getRazorpaySignature());
            txn.setStatus(PaymentTransaction.PaymentStatus.SUCCESS);
            paymentTransactionRepository.save(txn);

            // Update Booking Status to ACCEPTED (since advance is paid)
            BookingRequest booking = txn.getBookingRequest();
            booking.setStatus(BookingRequest.RequestStatus.ACCEPTED);
            bookingRequestRepository.save(booking);

        } catch (Exception e) {
            txn.setStatus(PaymentTransaction.PaymentStatus.FAILED);
            paymentTransactionRepository.save(txn);
            log.error("Payment verification failed", e);
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}
