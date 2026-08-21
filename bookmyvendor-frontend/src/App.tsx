import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/layout/Navbar'

// Auth Pages
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/ResetPasswordPage'
import VendorSearchPage from './features/vendor-search/VendorSearchPage'
import VendorDetailPage from './features/vendor-search/VendorDetailPage'

import CustomerBookingsPage from './features/vendor-search/CustomerBookingsPage'

import VendorBookingsPage from './features/vendor-dashboard/VendorBookingsPage'

import VendorDashboardPage from './features/vendor-dashboard/VendorDashboardPage'

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
  <>
    <Navbar />
    <Outlet />
  </>
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
            <Route path="/" element={
              <div className="bmv-container bmv-section text-center">
                <h1 className="font-display text-hero text-navy mb-4">BookMyVendor</h1>
                <p className="font-sans text-muted mb-8">Sprint 1 — Authentication Complete ✅</p>
                <div className="flex justify-center gap-4">
                  <a href="/login" className="btn-primary">Login Page</a>
                  <a href="/register" className="btn-secondary">Register Page</a>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App




