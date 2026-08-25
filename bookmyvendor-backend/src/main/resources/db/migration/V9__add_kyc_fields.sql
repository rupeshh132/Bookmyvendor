ALTER TABLE vendor_profiles 
ADD COLUMN aadhar_number VARCHAR(20),
ADD COLUMN pan_number VARCHAR(20),
ADD COLUMN kyc_submitted_at TIMESTAMP;
