import { CheckCircle2, TrendingUp, Wallet, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function JoinAsVendorPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-navy pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-label text-terracotta tracking-widest uppercase mb-4"
          >
            For Vendors & Professionals
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Grow your event business with BookMyVendor.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg text-stone/80 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Join India's fastest-growing marketplace for event professionals. Get high-quality leads, secure payments, and manage your entire portfolio in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/register" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2">
              Join as Vendor <ArrowRight size={20} />
            </Link>
            <p className="font-sans text-sm text-stone/50 mt-4">Takes only 2 minutes. Free to register.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-12 bg-white border-b border-stone">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-stone/50">
            <div>
              <h3 className="font-display text-4xl text-navy mb-2">10k+</h3>
              <p className="font-sans text-sm text-muted uppercase tracking-wider">Monthly Users</p>
            </div>
            <div>
              <h3 className="font-display text-4xl text-navy mb-2">₹5Cr+</h3>
              <p className="font-sans text-sm text-muted uppercase tracking-wider">Vendor Payouts</p>
            </div>
            <div>
              <h3 className="font-display text-4xl text-navy mb-2">500+</h3>
              <p className="font-sans text-sm text-muted uppercase tracking-wider">Active Vendors</p>
            </div>
            <div>
              <h3 className="font-display text-4xl text-navy mb-2">0%</h3>
              <p className="font-sans text-sm text-muted uppercase tracking-wider">Joining Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl text-navy mb-4">Why partner with us?</h2>
            <p className="font-sans text-muted max-w-2xl mx-auto">We provide all the tools you need to succeed, so you can focus on what you do best — creating memorable events.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-card border border-stone shadow-sm hover:shadow-cardHover transition-all">
              <div className="w-14 h-14 bg-ivory rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">High-Quality Leads</h3>
              <p className="font-sans text-muted leading-relaxed">No more spam inquiries. We verify every customer requirement before connecting them with you, ensuring you only talk to serious buyers.</p>
            </div>

            <div className="bg-white p-8 rounded-card border border-stone shadow-sm hover:shadow-cardHover transition-all">
              <div className="w-14 h-14 bg-ivory rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">Secure Escrow Payments</h3>
              <p className="font-sans text-muted leading-relaxed">Stop chasing clients for payments. Customers pay the advance to our secure escrow, and we release it to your bank account immediately upon booking confirmation.</p>
            </div>

            <div className="bg-white p-8 rounded-card border border-stone shadow-sm hover:shadow-cardHover transition-all">
              <div className="w-14 h-14 bg-ivory rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">Beautiful Portfolios</h3>
              <p className="font-sans text-muted leading-relaxed">Showcase your past work, set your pricing packages, and manage your calendar through a dedicated professional dashboard designed for vendors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Steps */}
      <section className="py-24 bg-white border-t border-stone">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-4xl text-navy mb-6">Start getting bookings in 3 simple steps</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-display shrink-0">1</div>
                  <div>
                    <h4 className="font-sans font-bold text-navy text-lg mb-1">Create your profile</h4>
                    <p className="font-sans text-muted">Sign up, verify your details (KYC), and tell us about your services and pricing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-display shrink-0">2</div>
                  <div>
                    <h4 className="font-sans font-bold text-navy text-lg mb-1">Upload your portfolio</h4>
                    <p className="font-sans text-muted">Add high-quality images of your past events to attract the right customers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-display shrink-0">3</div>
                  <div>
                    <h4 className="font-sans font-bold text-navy text-lg mb-1">Go Live</h4>
                    <p className="font-sans text-muted">Once our admin approves your KYC, your profile goes live to thousands of couples planning their events.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-ivory rounded-[32px] p-8 border border-stone text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-terracotta text-white font-sans text-xs font-bold px-4 py-1 rounded-bl-xl">SPECIAL OFFER</div>
                <h3 className="font-display text-2xl text-navy mb-2">Free Early Access</h3>
                <div className="flex items-end justify-center gap-1 mb-6">
                  <span className="font-display text-5xl text-navy">₹0</span>
                  <span className="font-sans text-muted mb-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-3 font-sans text-sm text-navy"><CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" /> Unlimited Profile Views</li>
                  <li className="flex items-center gap-3 font-sans text-sm text-navy"><CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" /> Direct Customer Chat</li>
                  <li className="flex items-center gap-3 font-sans text-sm text-navy"><CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" /> Zero Commission on first 5 bookings</li>
                  <li className="flex items-center gap-3 font-sans text-sm text-navy"><CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" /> Dedicated Account Manager</li>
                </ul>
                <Link to="/register" className="btn-primary w-full justify-center">Create Vendor Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

