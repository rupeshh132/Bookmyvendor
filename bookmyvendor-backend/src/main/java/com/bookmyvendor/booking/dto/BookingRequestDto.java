package com.bookmyvendor.booking.dto;

import com.bookmyvendor.booking.entity.BookingRequest;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BookingRequestDto {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private UUID vendorId;
    private String vendorBusinessName;
    
    private String eventType;
    private LocalDate eventDate;
    private Integer guestCount;
    private String message;
    
    private BookingRequest.RequestStatus status;
    private BigDecimal quotedAmount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingRequestDto fromEntity(BookingRequest entity, String customerName) {
        return BookingRequestDto.builder()
                .id(entity.getId())
                .customerId(entity.getCustomer().getId())
                .customerName(customerName) // Pass fetched name
                .vendorId(entity.getVendor().getId())
                .vendorBusinessName(entity.getVendor().getBusinessName())
                .eventType(entity.getEventType())
                .eventDate(entity.getEventDate())
                .guestCount(entity.getGuestCount())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .quotedAmount(entity.getQuotedAmount())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
