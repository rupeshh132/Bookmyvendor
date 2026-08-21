-- ============================================================
-- BookMyVendor — Migration V3
-- Vendor Portfolio Images
-- Sprint 3 | Author: BookMyVendor Team
-- ============================================================

CREATE TABLE vendor_portfolio_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL,
    public_id VARCHAR(500) NOT NULL, -- Used for deleting from Cloudinary
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_portfolio_vendor_id ON vendor_portfolio_images(vendor_profile_id);
CREATE INDEX idx_vendor_portfolio_order ON vendor_portfolio_images(vendor_profile_id, display_order);
