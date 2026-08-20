import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block font-display font-semibold text-navy text-xl text-center mb-10">
          Book<span className="text-terracotta">●</span>MyVendor
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-white"
        >
          {!success ? (
            <>
              <h1 className="font-display font-semibold text-2xl text-ink mb-2">Forgot Password?</h1>
              <p className="font-sans text-muted text-sm mb-6">
                No worries, we'll send you reset instructions.
              </p>

              {error && (
                <div className="bg-rose/10 border border-rose/20 text-rose rounded-input px-4 py-3 font-sans text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="bmv-label">Email address</label>
                  <input
                    type="email"
                    className="bmv-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Sending...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <MailCheck size={32} />
              </div>
              <h1 className="font-display font-semibold text-2xl text-ink mb-2">Check your email</h1>
              <p className="font-sans text-muted text-sm mb-8">
                We sent a password reset link to <br />
                <span className="font-medium text-ink">{email}</span>
              </p>
              <button onClick={() => setSuccess(false)} className="font-sans text-sm text-terracotta hover:underline">
                Didn't receive the email? Click to resend
              </button>
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 font-sans text-sm text-muted hover:text-navy transition-colors">
            <ArrowLeft size={16} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
