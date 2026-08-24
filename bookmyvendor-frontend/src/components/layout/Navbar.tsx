import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../lib/authStore'

const navLinks = [
  { label: 'Find Vendors', to: '/vendors' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'For Vendors', to: '/join-as-vendor' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <>
      {/* -- Floating Pill Navbar -- */}
      <header className="nav-pill w-[92%] max-w-5xl justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-semibold text-navy text-lg tracking-tight flex-shrink-0"
        >
          <img src="/logo.jpg" alt="BookMyVendor" className="h-10 object-contain" />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-6 py-2 rounded-full font-sans font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-stone/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'} className="btn-ghost py-2 px-4 text-xs">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); window.location.href='/login' }} className="btn-primary py-2 px-5 text-xs bg-rose hover:bg-rose/90 shadow-none">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost py-2 px-4 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-xs">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-stone transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} className="text-navy" /> : <Menu size={20} className="text-navy" />}
        </button>
      </header>

      {/* ?? Mobile Menu Overlay ?? */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ivory/95 backdrop-blur-sm flex flex-col pt-24 px-6">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-4 rounded-card font-sans font-medium text-lg transition-all duration-200 ${
                    isActive ? 'bg-stone text-navy' : 'text-ink hover:bg-stone'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-8">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'} onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center py-4">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); window.location.href='/login' }} className="btn-primary w-full text-center py-4 bg-rose hover:bg-rose/90 shadow-none">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center py-4">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center py-4">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  )
}



