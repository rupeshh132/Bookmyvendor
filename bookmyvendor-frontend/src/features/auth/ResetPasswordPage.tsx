import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { authService } from '../../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="card-white text-center max-w-md w-full">
          <h1 className="font-display font-semibold text-2xl text-rose mb-2">Invalid Link</h1>
          <p className="font-sans text-muted mb-6">The password reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="btn-primary">Request New Link</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block font-display font-semibold text-navy text-xl text-center mb-10">
          <img src="/logo.jpg" alt="BookMyVendor" className="h-10 object-contain" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-white"
        >
          {!success ? (
            <>
              <h1 className="font-display font-semibold text-2xl text-ink mb-2">Set new password</h1>
              <p className="font-sans text-muted text-sm mb-6">
                Your new password must be different to previously used passwords.
              </p>

              {error && (
                <div className="bg-rose/10 border border-rose/20 text-rose rounded-input px-4 py-3 font-sans text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="bmv-label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="bmv-input pr-12"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="font-display font-semibold text-2xl text-ink mb-2">Password reset</h1>
              <p className="font-sans text-muted text-sm mb-8">
                Your password has been successfully reset. Click below to log in magically.
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary w-full justify-center">
                Continue to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}


