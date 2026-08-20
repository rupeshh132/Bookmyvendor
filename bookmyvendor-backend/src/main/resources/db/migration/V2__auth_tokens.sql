-- ============================================================
-- BookMyVendor — Migration V2
-- Auth: OTP Tokens, Password Reset Tokens, OAuth Accounts
-- Sprint 1 | Author: BookMyVendor Team
-- ============================================================

-- ── OTP Tokens (Phone & Email OTP — stored in Redis ideally, DB as fallback) ──
CREATE TABLE otp_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier  VARCHAR(255) NOT NULL,   -- phone number or email
    otp_type    VARCHAR(20) NOT NULL CHECK (otp_type IN ('PHONE_LOGIN', 'EMAIL_VERIFY', 'PHONE_VERIFY')),
    otp_hash    VARCHAR(255) NOT NULL,   -- hashed OTP (never store plain)
    expires_at  TIMESTAMP NOT NULL,
    is_used     BOOLEAN DEFAULT false,
    attempts    INTEGER DEFAULT 0,       -- max 3 wrong attempts
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_tokens_identifier ON otp_tokens(identifier);
CREATE INDEX idx_otp_tokens_expires ON otp_tokens(expires_at);

-- ── Password Reset Tokens ─────────────────────────────────────────
CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(500) NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    is_used     BOOLEAN DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token_hash);

-- ── OAuth Accounts (Google, future: Facebook etc.) ───────────────
CREATE TABLE oauth_accounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL CHECK (provider IN ('GOOGLE', 'FACEBOOK')),
    provider_id     VARCHAR(255) NOT NULL,   -- Google's sub/id
    provider_email  VARCHAR(255),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON oauth_accounts(provider, provider_id);

-- ── Add phone_verified column to users ───────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'LOCAL'
    CHECK (auth_provider IN ('LOCAL', 'GOOGLE'));
