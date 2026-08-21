-- ============================================================
-- BookMyVendor — Migration V7
-- Create Default Admin User
-- Sprint 7 | Author: BookMyVendor Team
-- ============================================================

-- Create default admin (Password: admin123)
-- bcrypt hash for 'admin123' -> $2a$10$wO0828nU83wMhXvJ3l.iC.43hKzU6rJz9/C5E0QpXz0zR.Y.u.Y0m
INSERT INTO users (id, email, password_hash, role, is_active, is_email_verified)
VALUES 
('99999999-9999-9999-9999-999999999999', 'admin@bookmyvendor.com', '$2a$10$wO0828nU83wMhXvJ3l.iC.43hKzU6rJz9/C5E0QpXz0zR.Y.u.Y0m', 'ADMIN', true, true)
ON CONFLICT (email) DO NOTHING;
