import { useQuery } from '@tanstack/react-query'
import { Calendar, Users, MessageSquare, Check, X, Clock } from 'lucide-react'
import { bookingService } from '../../services/bookingService'

export default function VendorBookingsPage() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['vendorBookings'],
    queryFn: bookingService.getVendorRequests,
  })

  if (isLoading) return <div className="min-h-screen bg-ivory pt-32 px-6"><div className="max-w-4xl mx-auto card-white animate-pulse h-96" /></div>

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">Lead Pipeline</h1>
          <p className="font-sans text-muted">Manage your incoming quotation requests and bookings.</p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-stone rounded-card">
            <Clock size={48} className="text-muted mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-semibold text-xl text-ink mb-2">No requests yet</h3>
            <p className="font-sans text-muted">Keep your profile updated to attract more customers.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="card-white p-6 border border-stone hover:border-navy transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  
                  {/* Left Side: Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                          req.status === 'PENDING' ? 'bg-amber/20 text-amber' : 
                          req.status === 'QUOTED' ? 'bg-navy/10 text-navy' : 
                          req.status === 'ACCEPTED' ? 'bg-sage/20 text-sage' : 
                          'bg-rose/10 text-rose'
                        }`}>
                          {req.status}
                        </span>
                        <h3 className="font-display font-semibold text-xl text-ink mt-2">{req.customerName}</h3>
                        <p className="font-sans text-sm text-muted">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-6 font-sans text-sm text-ink">
                      <span className="flex items-center gap-1.5"><Calendar size={16} className="text-terracotta"/> {new Date(req.eventDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5 capitalize text-navy font-semibold">{req.eventType.toLowerCase()} Event</span>
                      {req.guestCount && <span className="flex items-center gap-1.5"><Users size={16} className="text-sage"/> {req.guestCount} Guests</span>}
                    </div>

                    <div className="bg-stone/50 p-4 rounded-card border border-stone">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={14} className="text-muted" />
                        <span className="font-sans text-xs uppercase tracking-widest text-muted font-bold">Message from Customer</span>
                      </div>
                      <p className="font-sans text-sm text-ink italic">"{req.message}"</p>
                    </div>
                  </div>

                  {/* Right Side: Actions (Only for pending/quoted) */}
                  <div className="flex md:flex-col gap-2 justify-end w-full md:w-48 border-t md:border-t-0 md:border-l border-stone pt-4 md:pt-0 md:pl-6">
                     {req.status === 'PENDING' && (
                       <>
                         <button className="btn-primary w-full shadow-sm">Send Quote</button>
                         <button className="btn-ghost text-rose hover:bg-rose/10 w-full"><X size={16} className="inline mr-1"/> Decline</button>
                       </>
                     )}
                     {req.status === 'QUOTED' && (
                       <div className="text-center p-4 bg-navy/5 rounded-card w-full h-full flex flex-col justify-center">
                         <span className="text-xs uppercase text-muted font-bold mb-1">You Quoted</span>
                         <span className="font-display font-semibold text-2xl text-navy">₹{req.quotedAmount}</span>
                         <span className="text-xs text-muted mt-2">Waiting for customer...</span>
                       </div>
                     )}
                     {req.status === 'ACCEPTED' && (
                       <div className="text-center p-4 bg-sage/10 rounded-card w-full h-full flex flex-col justify-center text-sage">
                         <Check size={24} className="mx-auto mb-2" />
                         <span className="font-bold text-sm">Booked</span>
                       </div>
                     )}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
