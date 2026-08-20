import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Phone, Mail, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../lib/authStore'
import OtpInput from './components/OtpInput'

type LoginTab = 'email' | 'phone'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [tab, setTab] = useState<LoginTab>('email')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Email/password form
  const [emailForm, setEmailForm] = useState({ email: '', password: '' })

  // Phone OTP form
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)

  // ── Email/password login ─────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const auth = await authService.login({ email: emailForm.email, password: emailForm.password })
      setAuth(auth)
      navigate(auth.user.profileComplete ? getDashboardPath(auth.user.role) : '/complete-profile')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Send OTP ─────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.length !== 10) return setError('Enter a valid 10-digit phone number')
    setError('')
    setLoading(true)
    try {
      await authService.sendOtp(phone)
      setOtpSent(true)
      startTimer()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // ── Verify OTP ───────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return setError('Enter 6-digit OTP')
    setError('')
    setLoading(true)
    try {
      const auth = await authService.verifyOtp(phone, otp)
      setAuth(auth)
      navigate(auth.user.profileComplete ? getDashboardPath(auth.user.role) : '/complete-profile')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // ── Google login ─────────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true)
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).then(r => r.json())

        const auth = await authService.googleLogin({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        })
        setAuth(auth)
        navigate(getDashboardPath(auth.user.role))
      } catch (err: any) {
        setError('Google login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => setError('Google login cancelled'),
  })

  // ── Timer for OTP resend ─────────────────────────────────────
  const startTimer = () => {
    setOtpTimer(30)
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const getDashboardPath = (role: string) => {
    if (role === 'VENDOR') return '/vendor/dashboard'
    if (role === 'ADMIN') return '/admin'
    return '/dashboard'
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* ── Left: Decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12">
        <Link to="/" className="font-display font-semibold text-white text-xl">
          Book<span className="text-terracotta">●</span>MyVendor
        </Link>
        <div>
          <p className="text-stone/60 font-sans text-label tracking-label uppercase mb-4">TRUSTED BY 500+ VENDORS</p>
          <h2 className="font-display font-semibold text-white text-4xl leading-tight mb-6">
            Every Celebration,<br />Perfectly Planned.
          </h2>
          <p className="font-sans text-stone/70 text-lg leading-relaxed">
            Compare real quotes, book securely,<br />and manage everything in one place.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-white">
            <div className="font-display font-semibold text-3xl">500+</div>
            <div className="font-sans text-stone/60 text-sm">Verified Vendors</div>
          </div>
          <div className="text-white">
            <div className="font-display font-semibold text-3xl">1,200+</div>
            <div className="font-sans text-stone/60 text-sm">Events Planned</div>
          </div>
          <div className="text-white">
            <div className="font-display font-semibold text-3xl">4.9★</div>
            <div className="font-sans text-stone/60 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block font-display font-semibold text-navy text-xl mb-8">
            Book<span className="text-terracotta">●</span>MyVendor
          </Link>

          <h1 className="font-display font-semibold text-3xl text-ink mb-2">Welcome back</h1>
          <p className="font-sans text-muted mb-8">Sign in to your account</p>

          {/* ── Tab switcher ── */}
          <div className="flex bg-stone rounded-full p-1 mb-8">
            {(['email', 'phone'] as LoginTab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setOtpSent(false); setOtp('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-200 ${
                  tab === t ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-ink'
                }`}
              >
                {t === 'email' ? <Mail size={15} /> : <Phone size={15} />}
                {t === 'email' ? 'Email' : 'Phone OTP'}
              </button>
            ))}
          </div>

          {/* ── Error message ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose/10 border border-rose/20 text-rose rounded-input px-4 py-3 font-sans text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Email/Password Form ── */}
            {tab === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleEmailLogin}
                className="space-y-4"
              >
                <div>
                  <label className="bmv-label">Email address</label>
                  <input
                    type="email"
                    className="bmv-input"
                    placeholder="you@example.com"
                    value={emailForm.email}
                    onChange={e => setEmailForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="bmv-label mb-0">Password</label>
                    <Link to="/forgot-password" className="font-sans text-sm text-terracotta hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="bmv-input pr-12"
                      placeholder="Min. 8 characters"
                      value={emailForm.password}
                      onChange={e => setEmailForm(p => ({ ...p, password: e.target.value }))}
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
                  {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
                </button>
              </motion.form>
            )}

            {/* ── Phone OTP Form ── */}
            {tab === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className="bmv-label">Phone number</label>
                  <div className="flex gap-3">
                    <div className="bmv-input w-16 flex-shrink-0 flex items-center justify-center font-sans font-medium text-ink">
                      +91
                    </div>
                    <input
                      type="tel"
                      className="bmv-input flex-1"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || phone.length !== 10}
                    className="btn-primary w-full justify-center"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                      <label className="bmv-label">Enter 6-digit OTP</label>
                      <p className="font-sans text-muted text-sm mb-3">
                        Sent to +91 {phone.substring(0, 2)}****{phone.substring(6)}
                      </p>
                      <OtpInput value={otp} onChange={setOtp} />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="btn-primary w-full justify-center"
                    >
                      {loading ? 'Verifying...' : <><span>Verify & Login</span><ArrowRight size={16} /></>}
                    </button>
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="font-sans text-muted text-sm">Resend OTP in {otpTimer}s</p>
                      ) : (
                        <button
                          onClick={() => { setOtp(''); handleSendOtp() }}
                          className="font-sans text-sm text-terracotta hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone" />
            <span className="font-sans text-muted text-sm">or continue with</span>
            <div className="flex-1 h-px bg-stone" />
          </div>

          {/* ── Google login ── */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-stone rounded-full py-3.5 px-6 font-sans font-semibold text-sm text-ink hover:border-navy hover:shadow-card transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.165 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* ── Sign up link ── */}
          <p className="font-sans text-center text-muted text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-navy font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
