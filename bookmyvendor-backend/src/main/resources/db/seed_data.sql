-- ============================================================
-- BookMyVendor — Seed Data
-- Run this manually or via Flyway to populate test vendors
-- ============================================================

-- Create test vendor user
INSERT INTO users (id, email, password_hash, role, is_active, is_email_verified)
VALUES 
('11111111-1111-1111-1111-111111111111', 'photo@test.com', '$2a$10$xyz', 'VENDOR', true, true),
('22222222-2222-2222-2222-222222222222', 'cater@test.com', '$2a$10$xyz', 'VENDOR', true, true);

-- Create test vendor profiles
INSERT INTO vendor_profiles (user_id, business_name, category, city, base_price, kyc_status, is_featured, avg_rating, total_reviews, bio)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Aryan Photography', 'PHOTOGRAPHER', 'Lucknow', 50000, 'APPROVED', true, 4.8, 120, 'Premium wedding and pre-wedding photography.'),
('22222222-2222-2222-2222-222222222222', 'Royal Catering', 'CATERER', 'Lucknow', 1500, 'APPROVED', false, 4.5, 45, 'Authentic Awadhi and North Indian catering services for large events.');
