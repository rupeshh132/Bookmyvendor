package com.bookmyvendor.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateBookingRequestDto {
    @NotNull(message = "Vendor ID is required")
    private UUID vendorId;

    @NotBlank(message = "Event type is required")
    private String eventType;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDate eventDate;

    private Integer guestCount;

    @NotBlank(message = "Message to vendor is required")
    private String message;
}
