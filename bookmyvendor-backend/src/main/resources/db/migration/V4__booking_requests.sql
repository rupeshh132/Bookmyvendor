-- ============================================================
-- BookMyVendor — Migration V4
-- Booking / Quotation Requests
-- Sprint 4 | Author: BookMyVendor Team
-- ============================================================

CREATE TABLE booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    guest_count INTEGER,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CANCELLED')),
    quoted_amount DECIMAL(12, 2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_req_customer ON booking_requests(customer_id);
CREATE INDEX idx_booking_req_vendor ON booking_requests(vendor_id);
CREATE INDEX idx_booking_req_status ON booking_requests(status);

-- Trigger for updated_at
CREATE TRIGGER update_booking_requests_updated_at
    BEFORE UPDATE ON booking_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
