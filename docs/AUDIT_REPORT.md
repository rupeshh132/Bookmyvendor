# BookMyVendor Audit Report

This report provides a comprehensive, read-only assessment of the current implementation status of the BookMyVendor project. It highlights what is fully wired, what is stubbed, and what remains completely unbuilt.

## 1. Backend API Inventory

The backend is built as a modular Spring Boot monolith. Below is the breakdown of all `@RestController` endpoints:

### **Auth Module** (`AuthController`)
- `POST /api/v1/auth/register` - Registers Vendor/Customer. **Status:** Real logic (saves to DB, hashes password). **Public.**
- `POST /api/v1/auth/login` - JWT generation. **Status:** Real logic. **Public.**
- `POST /api/v1/auth/otp/send` - Sends OTP. **Status:** Stubbed/In-memory (No real SMS/Email OTP delivery yet). **Public.**
- `POST /api/v1/auth/otp/verify` - Verifies OTP. **Status:** Stubbed/In-memory map logic. **Public.**
- `POST /api/v1/auth/google` - OAuth login. **Status:** Basic JWT issuing, no real Google SDK token verification on backend. **Public.**
- `POST /api/v1/auth/forgot-password` - Generates token, sends email. **Status:** Real logic (calls EmailService). **Public.**
- `POST /api/v1/auth/reset-password` - Updates password. **Status:** Real logic. **Public.**

### **Vendor Profile Module** (`VendorController`, `PortfolioController`)
- `GET /api/v1/vendors/search` - Searches vendors by category/city/location. **Status:** Real PostGIS radius logic exists. **Public.**
- `GET /api/v1/vendors/{id}` - Gets single vendor profile. **Status:** Real logic. **Public.**
- `GET /api/v1/vendors/me` - Gets own profile. **Status:** Real logic. **Protected (VENDOR).**
- `PUT /api/v1/vendors/me` - Updates own profile (bio, price, location). **Status:** Real logic. **Protected (VENDOR).**
- `GET /api/v1/vendors/{vendorProfileId}/portfolio` - Gets public portfolio. **Status:** Real logic. **Public.**
- `GET /api/v1/vendors/me/portfolio` - Gets own portfolio. **Status:** Real logic. **Protected (VENDOR).**
- `POST /api/v1/vendors/me/portfolio` - Uploads image. **Status:** Real Cloudinary integration. **Protected (VENDOR).**
- `DELETE /api/v1/vendors/me/portfolio/{imageId}` - Deletes image. **Status:** Real Cloudinary/DB deletion. **Protected (VENDOR).**

### **Booking Module** (`BookingController`)
- `POST /api/v1/bookings/request` - Customer requests booking. **Status:** Real logic. **Protected (CUSTOMER).**
- `GET /api/v1/bookings/customer` - Customer gets own requests. **Status:** Real logic. **Protected (CUSTOMER).**
- `GET /api/v1/bookings/vendor` - Vendor gets incoming requests. **Status:** Real logic. **Protected (VENDOR).**
- `PUT /api/v1/bookings/{id}/quote` - Vendor sends price quote. **Status:** Real logic. **Protected (VENDOR).**
- `PUT /api/v1/bookings/{id}/accept` - Customer accepts quote. **Status:** Real logic. **Protected (CUSTOMER).**

### **Chat Module** (`ChatController`)
- `MESSAGE /chat.send` - Sends WebSocket chat message. **Status:** Real Stomp WS logic. **Protected (Principal injection).**
- `GET /api/v1/chat/{bookingId}` - Retrieves chat history. **Status:** Real DB fetch logic. **Protected.**

### **Payment Module** (`PaymentController`)
- `POST /api/v1/payments/create-order/{bookingId}` - Creates Razorpay order for 20% advance. **Status:** Real logic (fallback mock included if keys missing). **Protected (CUSTOMER).**
- `POST /api/v1/payments/verify` - Verifies Razorpay signature. **Status:** Real logic. **Protected (CUSTOMER).**

### **Admin Module** (`AdminController`)
- `GET /api/v1/admin/dashboard` - Dashboard stats. **Status:** Real logic. **Protected (ADMIN).**
- `GET /api/v1/admin/kyc-queue` - List pending KYC vendors. **Status:** Real logic. **Protected (ADMIN).**
- `PUT /api/v1/admin/kyc/{vendorProfileId}` - Approve/Reject KYC. **Status:** Real logic. **Protected (ADMIN).**

---

## 2. Frontend Route Inventory

- `/` (`HomePage`): Real content. Search bar routes to `/vendors`.
- `/login`, `/register`, `/forgot-password`, `/reset-password`: Real UI, fully wired to `authService`.
- `/vendors` (`VendorSearchPage`): Real UI. Calls `vendorService.searchVendors`. **Limitation:** Only searches by City/Category. Radius UI is missing.
- `/vendors/:id` (`VendorDetailPage`): Real UI. Calls `getVendor`, `getVendorPortfolio`, and wires to `bookingService.createRequest`.
- `/dashboard` (`CustomerBookingsPage`): Real UI. Calls `getCustomerRequests`. Displays chat, handles Razorpay integration.
- `/vendor/dashboard` (`VendorDashboardPage`): Real UI. Calls `getVendorProfile`. Includes Portfolio Manager (Cloudinary upload/delete wired).
- `/vendor/bookings` (`VendorBookingsPage`): Real UI. Calls `getVendorRequests` and `sendQuote`. Chat wired.
- `/admin` (`AdminDashboardPage`): Real UI. Calls `getStats`, `getKycQueue`, and `processKyc`. 

---

## 3. Customer Journey Map

| Step | Status | Notes |
|---|---|---|
| Browse Vendors | ✅ | Category & City search works. (Radius search UI missing). |
| View Vendor Profile | ✅ | Shows bio, price, portfolio, map location. |
| Send Booking Request | ✅ | Fully wired form in `VendorDetailPage`. |
| Chat with Vendor | ✅ | WebSocket connection functional in `ChatRoom.tsx`. |
| Payment (Advance) | ✅ | Razorpay integration wired in `CustomerBookingsPage`. |
| Leave Review | ❌ | **Not implemented.** No backend controller or frontend UI exists. |
| Cancel Request | ❌ | **Not implemented.** Cannot decline quotes or cancel bookings. |

---

## 4. Vendor Journey Map

| Step | Status | Notes |
|---|---|---|
| Register | ✅ | Fully functional, auto-logins via JWT. |
| KYC / Verification | ⚠️ | Admin can approve/reject, but Vendor has no UI to upload identity documents. |
| Manage Profile | ✅ | Bio, base price, and location updates wired. |
| Receive Booking Requests | ✅ | Dashboard populates correctly. |
| Accept/Quote Request | ✅ | Can send customized quote via `VendorBookingsPage`. |
| Reject Request | ❌ | **Not implemented.** Vendor cannot say "No" to a booking request. |
| Chat | ✅ | Functional. |
| Get Paid | ✅ | Dashboard tracks payment status automatically upon customer verification. |
| Manage Portfolio | ✅ | Functional (Cloudinary uploads wired). |

---

## 5. Cross-Cutting Concerns

- **Email Notifications:** ⚠️ **Partially implemented.** Welcome emails and Forgot Password emails work. However, **no emails are sent for core business events** (e.g., getting a booking request, receiving a quote, or payment success).
- **WebSocket/Chat:** ✅ **Fully implemented.** Native WebSockets with STOMP over Spring Boot. Token auth secured.
- **Payment Integration:** ✅ **Fully implemented.** Razorpay checkout, signature verification, and fallback mock behavior are robust.
- **File Upload:** ✅ **Fully implemented.** Cloudinary SDK is integrated on backend, mapped to Vendor portfolios.
- **Search/Filters:** ⚠️ **Partially implemented.** PostGIS radius search is built in the backend, but the frontend only allows City/Category text search.
- **Reviews & Ratings:** ❌ **Not implemented.** The fields exist in the database schema (`avg_rating`), but there is no API or UI to leave a review.

---

## 6. Known Broken / Untested Areas

1. ~~**One-Way Booking State Machine:**~~ (FIXED) Booking cancellation and rejection paths have been implemented.
2. **Missing Notification Hooks:** Vendors have to manually refresh the dashboard to see if they got a booking request. No email hooks are present in `BookingService`.
3. **Google OAuth is a Stub:** The backend endpoint `/api/v1/auth/google` accepts a raw `googleId` and `email` string and trusts it blindly. There is no actual Google JWT verification using Google Auth Library, making this a severe security vulnerability if pushed to prod.
4. **OTP Login is a Stub:** `OtpService` currently uses an in-memory `ConcurrentHashMap` and just prints the OTP to the console. It is not wired to Twilio or AWS SNS for real delivery.
5. **Missing KYC Document Upload:** Vendor's `kycStatus` is `PENDING` by default, but there is no mechanism for them to upload an Aadhar/PAN card for the admin to actually review.

---

## 7. Estimated Completion Summary

| Module | Backend Complete | Frontend Complete | Notes |
|---|---|---|---|
| **Auth** | 70% | 90% | Needs real Google OAuth verification and real SMS OTP delivery. |
| **Vendor Profile** | 90% | 85% | Missing location/radius UI toggle on frontend. |
| **Booking** | 100% | 100% | End-to-end booking flow including cancel/reject complete. |
| **Chat** | 100% | 100% | Robust implementation. |
| **Payment** | 100% | 100% | Razorpay advance logic is solid. |
| **Admin** | 50% | 60% | Basic stats and KYC queue exist, but lacks deep user management. |
| **Reviews** | 0% | 0% | Entirely absent. |

**Overall Verdict:** The platform is highly functional as a "happy path" prototype. The core USP (searching vendors, requesting quotes, chatting, and paying an advance) works end-to-end. Next steps should focus on error paths (rejecting bookings) and completing the review system.

