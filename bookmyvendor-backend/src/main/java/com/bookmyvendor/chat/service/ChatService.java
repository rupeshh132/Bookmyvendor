package com.bookmyvendor.chat.service;

import com.bookmyvendor.auth.entity.User;
import com.bookmyvendor.auth.repository.UserRepository;
import com.bookmyvendor.booking.entity.BookingRequest;
import com.bookmyvendor.booking.repository.BookingRequestRepository;
import com.bookmyvendor.chat.dto.ChatMessageDto;
import com.bookmyvendor.chat.dto.SendMessageRequest;
import com.bookmyvendor.chat.entity.ChatMessage;
import com.bookmyvendor.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final BookingRequestRepository bookingRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageDto saveMessage(UUID senderId, SendMessageRequest request) {
        BookingRequest booking = bookingRequestRepository.findById(request.getBookingRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Booking request not found"));
                
        // Ensure sender is either the customer or the vendor of this booking
        if (!booking.getCustomer().getId().equals(senderId) && !booking.getVendor().getUser().getId().equals(senderId)) {
            throw new IllegalArgumentException("You are not part of this booking request");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatMessage message = ChatMessage.builder()
                .bookingRequest(booking)
                .sender(sender)
                .content(request.getContent())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        return ChatMessageDto.fromEntity(saved);
    }

    public List<ChatMessageDto> getChatHistory(UUID userId, UUID bookingRequestId) {
        BookingRequest booking = bookingRequestRepository.findById(bookingRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
                
        // Auth check
        if (!booking.getCustomer().getId().equals(userId) && !booking.getVendor().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        return chatMessageRepository.findByBookingRequestIdOrderByCreatedAtAsc(bookingRequestId)
                .stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
    }
}
