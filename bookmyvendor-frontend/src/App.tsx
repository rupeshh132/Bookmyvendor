import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Auth Pages
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/ResetPasswordPage'
import VendorSearchPage from './features/vendor-search/VendorSearchPage'
import VendorDetailPage from './features/vendor-search/VendorDetailPage'

import AdminDashboardPage from './features/admin/AdminDashboardPage'
import AdminLayout from './components/layout/AdminLayout'
import AdminUsersPage from './features/admin/AdminUsersPage'
import AdminBookingsPage from './features/admin/AdminBookingsPage'
import AdminKycQueuePage from './features/admin/AdminKycQueuePage'

import CustomerBookingsPage from './features/vendor-search/CustomerBookingsPage'

import VendorBookingsPage from './features/vendor-dashboard/VendorBookingsPage'

import VendorDashboardPage from './features/vendor-dashboard/VendorDashboardPage'
import HomePage from './features/home/HomePage'
import HowItWorksPage from './features/info/HowItWorksPage'
import JoinAsVendorPage from './features/info/JoinAsVendorPage'
import AboutUsPage from './features/info/AboutUsPage'
import PrivacyPage from './features/info/PrivacyPage'
import TermsPage from './features/info/TermsPage'
import CategoryPage from './features/info/CategoryPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

// Layout wrapper that includes Navbar
const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1"><Outlet /></div>
    <Footer />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Auth Routes (No Navbar) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── Main App Routes (With Navbar) ── */}
                    <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />`n            <Route path="/how-it-works" element={<HowItWorksPage />} />`n            <Route path="/join-as-vendor" element={<JoinAsVendorPage />} />`n            <Route path="/about" element={<AboutUsPage />} />`n            <Route path="/privacy" element={<PrivacyPage />} />`n            <Route path="/terms" element={<TermsPage />} />`n            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/vendors" element={<VendorSearchPage />} />
            <Route path="/vendors/:id" element={<VendorDetailPage />} />
            <Route path="/dashboard" element={<CustomerBookingsPage />} />
            
            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
            <Route path="/vendor/bookings" element={<VendorBookingsPage />} />
          </Route>

          {/* Admin Routes (With Admin Sidebar) */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/kyc" element={<AdminKycQueuePage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

















