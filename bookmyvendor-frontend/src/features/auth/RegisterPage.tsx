import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, User as UserIcon, Store } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../lib/authStore'

type Role = 'CUSTOMER' | 'VENDOR'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [role, setRole] = useState<Role>('CUSTOMER')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    category: '',
    city: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const auth = await authService.register({
        role,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        category: role === 'VENDOR' ? formData.category : undefined,
        city: role === 'VENDOR' ? formData.city : undefined,
      })
      setAuth(auth)
      navigate(role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* ── Left: Decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12">
        <Link to="/" className="font-display font-semibold text-white text-xl">
          Book<span className="text-terracotta">●</span>MyVendor
        </Link>
        <div>
          <h2 className="font-display font-semibold text-white text-4xl leading-tight mb-6">
            Join India's Most Trusted<br />Event Platform.
          </h2>
          <p className="font-sans text-stone/70 text-lg leading-relaxed">
            {role === 'CUSTOMER'
              ? 'Find verified vendors, compare quotes, and book securely with escrow protection.'
              : 'Get qualified leads, manage bookings, and grow your business with zero upfront fees.'}
          </p>
        </div>
        {/* Abstract design element */}
        <div className="h-64 w-full rounded-[32px] bg-gradient-to-tr from-white/5 to-white/10 backdrop-blur-md border border-white/10" />
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden block font-display font-semibold text-navy text-xl mb-8">
            Book<span className="text-terracotta">●</span>MyVendor
          </Link>

          <h1 className="font-display font-semibold text-3xl text-ink mb-2">Create an account</h1>
          <p className="font-sans text-muted mb-8">Join thousands of users on BookMyVendor</p>

          {/* ── Role Switcher ── */}
          <div className="flex bg-stone rounded-full p-1 mb-8">
            <button
              type="button"
              onClick={() => { setRole('CUSTOMER'); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-200 ${
                role === 'CUSTOMER' ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-ink'
              }`}
            >
              <UserIcon size={16} /> Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('VENDOR'); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-200 ${
                role === 'VENDOR' ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-ink'
              }`}
            >
              <Store size={16} /> Vendor
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-rose/10 border border-rose/20 text-rose rounded-input px-4 py-3 font-sans text-sm mb-6">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="bmv-label">{role === 'CUSTOMER' ? 'Full Name' : 'Business Name'}</label>
              <input
                type="text"
                name="fullName"
                className="bmv-input"
                placeholder={role === 'CUSTOMER' ? 'John Doe' : 'Aryan Photography'}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="bmv-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="bmv-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Vendor specific fields with animation */}
            <AnimatePresence>
              {role === 'VENDOR' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="bmv-label">Category</label>
                      <select name="category" className="bmv-select" value={formData.category} onChange={handleChange} required>
                        <option value="" disabled>Select category</option>
                        <option value="PHOTOGRAPHER">Photographer</option>
                        <option value="CATERER">Caterer</option>
                        <option value="DECORATOR">Decorator</option>
                        <option value="VENUE">Venue</option>
                        <option value="MAKEUP">Makeup Artist</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="bmv-label">City</label>
                      <input
                        type="text"
                        name="city"
                        className="bmv-input"
                        placeholder="e.g. Lucknow"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="bmv-label">Phone Number (Required for Vendors)</label>
                    <input
                      type="tel"
                      name="phone"
                      className="bmv-input"
                      placeholder="10-digit number"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="bmv-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="bmv-input pr-12"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-6">
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="font-sans text-center text-muted text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-navy font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
