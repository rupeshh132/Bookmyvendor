-- ============================================================
-- BookMyVendor — Migration V6
-- Payment Transactions (Razorpay)
-- Sprint 6 | Author: BookMyVendor Team
-- ============================================================

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_request_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_type VARCHAR(50) NOT NULL DEFAULT 'ADVANCE', -- ADVANCE or FULL
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED', -- CREATED, SUCCESS, FAILED
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_booking ON payment_transactions(booking_request_id);
CREATE INDEX idx_payment_rzp_order ON payment_transactions(razorpay_order_id);

-- Trigger for updated_at
CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
