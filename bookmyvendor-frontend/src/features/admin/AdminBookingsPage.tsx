import { Calendar } from 'lucide-react'

export default function AdminBookingsPage() {
  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">Platform Bookings & Disputes</h1>
      <p className="font-sans text-muted mb-8">Oversee all booking requests and manage disputes.</p>
      
      <div className="text-center py-20 card-white border border-dashed border-stone mt-10">
        <Calendar size={48} className="mx-auto text-stone mb-4" />
        <h3 className="font-display font-semibold text-xl text-ink mb-2">Coming Soon</h3>
        <p className="text-muted font-sans max-w-md mx-auto">
          The global booking viewer and dispute resolution center will be available once the Razorpay payment integration is complete.
        </p>
      </div>
    </div>
  )
}
