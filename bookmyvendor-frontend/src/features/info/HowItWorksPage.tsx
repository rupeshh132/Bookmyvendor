import { Search, MessageSquare, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import heroImage from '../../assets/images/a_cinematic_wide_angle_landscape_photograph_of_a_luxury_indian_wedding_venue_at.png'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-navy pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-label text-terracotta tracking-widest uppercase mb-4"
          >
            How BookMyVendor Works
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl text-white mb-6"
          >
            Plan your perfect event in 4 simple steps.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg text-stone/80 max-w-2xl mx-auto leading-relaxed"
          >
            We've removed the stress from event planning. Connect with India's most trusted vendors directly, negotiate terms, and book with 100% security.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone">
                <Search className="w-8 h-8 text-terracotta" />
              </div>
              <h2 className="font-display text-4xl text-navy mb-4">1. Discover & Compare</h2>
              <p className="font-sans text-muted text-lg leading-relaxed mb-6">
                Browse through thousands of verified vendor profiles across categories like Venues, Photographers, Decorators, and Caterers. Filter by your city, budget, and specific requirements. Read authentic reviews from past customers to make an informed choice.
              </p>
              <ul className="space-y-3 font-sans text-navy font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> 500+ Verified Vendors</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Transparent pricing & portfolios</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> 100% Genuine Reviews</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-floating">
                <img src={heroImage} alt="Discover Vendors" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone">
                <MessageSquare className="w-8 h-8 text-terracotta" />
              </div>
              <h2 className="font-display text-4xl text-navy mb-4">2. Chat & Customize</h2>
              <p className="font-sans text-muted text-lg leading-relaxed mb-6">
                Found someone you like? Send them a message directly through our secure platform. Discuss your event date, share your vision, ask for customizations, and negotiate the final price without any middlemen.
              </p>
              <ul className="space-y-3 font-sans text-navy font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Direct Chat with Vendors</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Share reference images</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Receive custom quotes instantly</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-floating bg-white border border-stone p-8 flex flex-col justify-center">
                <div className="bg-ivory p-4 rounded-2xl rounded-tl-none w-3/4 mb-4 border border-stone/50 shadow-sm">
                  <p className="font-sans text-sm text-navy">Hi Sharma Photography! Are you available for a 2-day wedding event in Lucknow next month?</p>
                </div>
                <div className="bg-navy p-4 rounded-2xl rounded-tr-none w-3/4 self-end shadow-sm">
                  <p className="font-sans text-sm text-white">Hello! Yes, we have those dates open. Let me share our premium wedding package with you.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone">
                <ShieldCheck className="w-8 h-8 text-terracotta" />
              </div>
              <h2 className="font-display text-4xl text-navy mb-4">3. Book Securely</h2>
              <p className="font-sans text-muted text-lg leading-relaxed mb-6">
                Once everything is finalized, confirm your booking by paying a secure advance through BookMyVendor. Your money is safe with us until the vendor fulfills their commitment. Say goodbye to booking anxiety.
              </p>
              <ul className="space-y-3 font-sans text-navy font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Escrow Payment Protection</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Instant Booking Confirmation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span> Easy Cancellation & Refunds</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-floating bg-white border border-stone flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-display text-2xl text-navy mb-2">Payment Secured</h3>
                  <p className="font-sans text-muted">Your booking is confirmed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone">
                <HeartHandshake className="w-8 h-8 text-terracotta" />
              </div>
              <h2 className="font-display text-4xl text-navy mb-4">4. Enjoy Your Event</h2>
              <p className="font-sans text-muted text-lg leading-relaxed mb-6">
                With the best professionals handling the work, you can sit back, relax, and actually enjoy your special day. After the event, leave a review to help the community!
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-floating">
                <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop" alt="Enjoy Event" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy text-center px-6">
        <h2 className="font-display text-4xl text-white mb-8">Ready to plan your dream event?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/vendors" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
            Start Finding Vendors <ArrowRight size={20} className="ml-2 inline" />
          </Link>
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white font-sans font-semibold hover:bg-white/10 transition-colors text-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
