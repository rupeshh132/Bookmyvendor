-- ============================================================
-- BookMyVendor — Database Migration V1
-- Core Schema: Users, Vendor Profiles, Customer Profiles
-- Sprint 0 | Author: BookMyVendor Team
-- ============================================================

-- Enable PostGIS for location-based search
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users (Base identity table) ──────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- ── Customer Profiles ─────────────────────────────────────────────
CREATE TABLE customer_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    full_name       VARCHAR(255) NOT NULL,
    default_city    VARCHAR(100),
    profile_image   VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);

-- ── Vendor Profiles ───────────────────────────────────────────────
CREATE TABLE vendor_profiles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    business_name       VARCHAR(255) NOT NULL,
    category            VARCHAR(100) NOT NULL,
    -- Location
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100),
    location_point      GEOGRAPHY(POINT, 4326),   -- PostGIS for geo-radius search
    service_radius_km   INTEGER DEFAULT 50,
    -- Profile
    bio                 TEXT,
    base_price          DECIMAL(12, 2),
    price_unit          VARCHAR(50) DEFAULT 'per_event',
    -- KYC & Verification
    kyc_status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                        CHECK (kyc_status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    kyc_rejection_note  TEXT,
    -- Stats (cached, updated by batch job)
    avg_rating          DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews       INTEGER DEFAULT 0,
    trust_score         DECIMAL(5, 2) DEFAULT 0.00,
    -- Subscription
    subscription_tier   VARCHAR(20) DEFAULT 'FREE'
                        CHECK (subscription_tier IN ('FREE', 'PRO', 'ELITE')),
    is_featured         BOOLEAN DEFAULT false,
    -- Timestamps
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP
);

CREATE INDEX idx_vendor_profiles_user_id ON vendor_profiles(user_id);
CREATE INDEX idx_vendor_profiles_category ON vendor_profiles(category);
CREATE INDEX idx_vendor_profiles_city ON vendor_profiles(city);
CREATE INDEX idx_vendor_profiles_kyc_status ON vendor_profiles(kyc_status);
CREATE INDEX idx_vendor_profiles_location ON vendor_profiles USING GIST(location_point);

-- ── Refresh Tokens ────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(500) NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    is_revoked  BOOLEAN DEFAULT false,
    device_info VARCHAR(500)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ── Updated_at auto-trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
