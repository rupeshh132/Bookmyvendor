package com.bookmyvendor.payment.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentOrderResponse {
    private String orderId;
    private BigDecimal amount; // in whole INR, frontend handles conversion if needed, but we usually return what we got
    private String currency;
    private String keyId; // So frontend knows which key to use
}
