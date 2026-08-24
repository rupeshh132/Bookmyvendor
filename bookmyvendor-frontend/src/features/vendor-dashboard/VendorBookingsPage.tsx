import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Users, Check, X, Clock, MessageCircle } from 'lucide-react'
import { bookingService } from '../../services/bookingService'
import ChatRoom from '../../components/chat/ChatRoom'

export default function VendorBookingsPage() {
  const queryClient = useQueryClient()
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)
  const [quoteAmount, setQuoteAmount] = useState<string>('')

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['vendorBookings'],
    queryFn: bookingService.getVendorRequests,
  })

  const quoteMutation = useMutation({
    mutationFn: ({ bookingId, amount }: { bookingId: string, amount: number }) => bookingService.sendQuote(bookingId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorBookings'] })
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to send quote')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.rejectRequest(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorBookings'] })
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to reject request')
    }
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">Lead Pipeline</h1>
          <p className="font-sans text-muted">Manage your incoming quotation requests, send quotes, and chat with customers.</p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-stone rounded-card">
            <Clock size={48} className="text-muted mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-semibold text-xl text-ink mb-2">No requests yet</h3>
            <p className="font-sans text-muted">Keep your profile updated to attract more customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ── Left Column: Leads List ── */}
            <div className="lg:col-span-2 space-y-4">
              {requests.map(req => (
                <div 
                  key={req.id} 
                  onClick={() => setActiveBookingId(req.id)}
                  className={`card-white p-6 border transition-colors cursor-pointer ${
                    activeBookingId === req.id ? 'border-navy shadow-lg' : 'border-stone hover:border-navy'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
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
                    {req.quotedAmount && (
                       <div className="text-right">
                         <span className="block text-xs uppercase text-muted font-bold">Quote</span>
                         <span className="font-display font-semibold text-xl text-navy">₹{req.quotedAmount}</span>
                       </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 font-sans text-sm text-ink mt-4">
                    <span className="flex items-center gap-1.5"><Calendar size={16} className="text-terracotta"/> {new Date(req.eventDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5 capitalize text-navy font-semibold">{req.eventType.toLowerCase()} Event</span>
                    {req.guestCount && <span className="flex items-center gap-1.5"><Users size={16} className="text-sage"/> {req.guestCount} Guests</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right Column: Chat & Action Pane ── */}
            <div className="lg:col-span-1">
              {activeBookingId ? (
                <div className="card-white p-0 border border-stone h-[600px] flex flex-col overflow-hidden">
                  
                  {/* Action Bar */}
                  {requests.find(r => r.id === activeBookingId)?.status === 'PENDING' && (
                    <div className="p-5 border-b border-stone bg-white flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between shadow-sm z-10">
                      <div className="flex-1 w-full relative">
                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Quote Amount</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 font-display font-semibold text-ink text-lg">₹</span>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            className="w-full bg-stone/20 border border-stone rounded-xl py-3 pl-10 pr-4 font-display font-semibold text-lg text-ink focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                            value={quoteAmount}
                            onChange={(e) => setQuoteAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => rejectMutation.mutate(activeBookingId)}
                          className="p-3 text-rose hover:bg-rose/10 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                        <button 
                          onClick={() => quoteMutation.mutate({ bookingId: activeBookingId, amount: Number(quoteAmount) })}
                          className="bg-navy text-white px-6 py-3 rounded-xl font-display font-semibold hover:bg-navy/90 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                  {requests.find(r => r.id === activeBookingId)?.status === 'QUOTED' && (
                     <div className="p-4 border-b border-stone text-center font-sans text-sm text-navy bg-navy/5 font-medium">
                        Waiting for customer to accept ₹{requests.find(r => r.id === activeBookingId)?.quotedAmount}
                     </div>
                  )}
                  {requests.find(r => r.id === activeBookingId)?.status === 'ACCEPTED' && (
                     <div className="p-4 border-b border-stone text-center font-sans font-bold text-sm text-sage bg-sage/5 flex items-center justify-center gap-2">
                        <Check size={16} /> Booking Confirmed
                     </div>
                  )}
                  {requests.find(r => r.id === activeBookingId)?.status === 'REJECTED' && (
                     <div className="p-4 border-b border-stone text-center font-sans font-bold text-sm text-rose bg-rose/5 flex items-center justify-center gap-2">
                        <X size={16} /> You rejected this request
                     </div>
                  )}
                  {requests.find(r => r.id === activeBookingId)?.status === 'CANCELLED' && (
                     <div className="p-4 border-b border-stone text-center font-sans font-bold text-sm text-muted bg-stone/20 flex items-center justify-center gap-2">
                        <X size={16} /> Customer cancelled this request
                     </div>
                  )}

                  {/* Chat Interface */}
                  <div className="flex-1 overflow-hidden">
                    <ChatRoom bookingId={activeBookingId} />
                  </div>
                  
                </div>
              ) : (
                <div className="card-white h-[600px] border border-stone border-dashed flex flex-col items-center justify-center text-center p-6 text-muted">
                   <MessageCircle size={48} className="mb-4 opacity-50" />
                   <h4 className="font-display text-lg text-ink mb-1">Select a Lead</h4>
                   <p className="font-sans text-sm">Click on a booking request to view details, chat with the customer, and send quotes.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}


