export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 border border-stone shadow-sm">
        <h1 className="font-display text-4xl text-navy mb-8">Terms of Service</h1>
        <div className="prose prose-stone max-w-none font-sans text-muted">
          <p>Last updated: August 2026</p>
          <h2 className="text-navy font-display text-2xl mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using BookMyVendor, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-navy font-display text-2xl mt-8 mb-4">2. Vendor Obligations</h2>
          <p>Vendors must provide accurate information regarding their services and pricing. Any misrepresentation may result in immediate account termination.</p>

          <h2 className="text-navy font-display text-2xl mt-8 mb-4">3. Booking and Payments</h2>
          <p>All bookings made through the platform require an advance payment which is held in our secure escrow system until the booking is confirmed by both parties.</p>

          <h2 className="text-navy font-display text-2xl mt-8 mb-4">4. Cancellations</h2>
          <p>Cancellations are subject to the specific vendor's cancellation policy displayed at the time of booking. Platform fees are non-refundable.</p>
        </div>
      </div>
    </div>
  )
}
