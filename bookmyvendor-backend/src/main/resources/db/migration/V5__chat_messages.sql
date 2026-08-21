-- ============================================================
-- BookMyVendor — Migration V5
-- Chat Messages
-- Sprint 5 | Author: BookMyVendor Team
-- ============================================================

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_request_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_msg_booking ON chat_messages(booking_request_id);
CREATE INDEX idx_chat_msg_created ON chat_messages(created_at);
