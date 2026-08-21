package com.bookmyvendor.chat.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SendMessageRequest {
    private UUID bookingRequestId;
    private String content;
}
