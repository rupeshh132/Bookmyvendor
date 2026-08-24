import { motion } from 'framer-motion'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl text-navy mb-8 text-center"
        >
          About BookMyVendor
        </motion.h1>
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-stone shadow-sm">
          <p className="font-sans text-lg text-muted mb-6 leading-relaxed">
            Welcome to BookMyVendor, India's most trusted and reliable marketplace for event planning. We believe that organizing an event—whether it's a grand wedding, a corporate gala, or a cozy birthday party—should be a joyful experience, not a stressful one.
          </p>
          <p className="font-sans text-lg text-muted mb-6 leading-relaxed">
            Our mission is simple: to connect you with the best, verified event professionals in your city. From stunning luxury venues to talented photographers, top-tier decorators, and expert caterers, we bring them all under one roof.
          </p>
          <h2 className="font-display text-3xl text-navy mt-12 mb-6">Why We Started</h2>
          <p className="font-sans text-lg text-muted mb-6 leading-relaxed">
            The event industry in India has traditionally been unorganized. Finding the right vendor meant relying on word-of-mouth or browsing through endless directories with fake reviews. We built BookMyVendor to bring transparency, trust, and technology to this process.
          </p>
          <h2 className="font-display text-3xl text-navy mt-12 mb-6">Our Core Values</h2>
          <ul className="list-disc pl-6 space-y-4 font-sans text-lg text-muted">
            <li><strong>Trust & Transparency:</strong> Every vendor on our platform goes through a strict KYC verification. The reviews you see are 100% genuine.</li>
            <li><strong>Security:</strong> With our escrow payment system, your money is safe until your booking is confirmed and services are delivered.</li>
            <li><strong>Empowering Local Businesses:</strong> We help incredibly talented local professionals reach a wider audience and grow their business.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
