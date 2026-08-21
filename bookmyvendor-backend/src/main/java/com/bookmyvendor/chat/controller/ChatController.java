package com.bookmyvendor.chat.controller;

import com.bookmyvendor.chat.dto.ChatMessageDto;
import com.bookmyvendor.chat.dto.SendMessageRequest;
import com.bookmyvendor.chat.service.ChatService;
import com.bookmyvendor.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // ── WebSocket Endpoint ──────────────────────────────────────────
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        if (principal == null) {
            throw new IllegalArgumentException("User not authenticated via WebSocket");
        }
        
        UUID senderId = UUID.fromString(principal.getName());
        ChatMessageDto savedMessage = chatService.saveMessage(senderId, request);
        
        // Broadcast to the specific booking request room
        messagingTemplate.convertAndSend("/topic/booking/" + request.getBookingRequestId(), savedMessage);
    }

    // ── REST Endpoint for History ───────────────────────────────────
    @GetMapping("/api/v1/chat/{bookingId}")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getChatHistory(
            Principal principal,
            @PathVariable UUID bookingId
    ) {
        UUID userId = UUID.fromString(principal.getName());
        List<ChatMessageDto> history = chatService.getChatHistory(userId, bookingId);
        return ResponseEntity.ok(ApiResponse.success(history, "Chat history retrieved"));
    }
}
