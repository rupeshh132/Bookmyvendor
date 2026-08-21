package com.bookmyvendor.chat.dto;

import com.bookmyvendor.chat.entity.ChatMessage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ChatMessageDto {
    private UUID id;
    private UUID bookingRequestId;
    private UUID senderId;
    private String content;
    private LocalDateTime createdAt;

    public static ChatMessageDto fromEntity(ChatMessage entity) {
        return ChatMessageDto.builder()
                .id(entity.getId())
                .bookingRequestId(entity.getBookingRequest().getId())
                .senderId(entity.getSender().getId())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
