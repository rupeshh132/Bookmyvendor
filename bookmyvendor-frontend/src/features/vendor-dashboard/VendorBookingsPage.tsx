import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Users, MessageSquare, Check, X, Clock, MessageCircle } from 'lucide-react'
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

  if (isLoading) return <div className="min-h-screen bg-ivory pt-32 px-6"><div className="max-w-4xl mx-auto card-white animate-pulse h-96" /></div>

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
                  <div className="p-4 border-b border-stone bg-stone/20">
                    {requests.find(r => r.id === activeBookingId)?.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Amount (₹)" 
                          className="bmv-input flex-1 py-2 text-sm"
                          value={quoteAmount}
                          onChange={(e) => setQuoteAmount(e.target.value)}
                        />
                        <button 
                          onClick={() => {
                             if(quoteAmount) {
                               quoteMutation.mutate({ bookingId: activeBookingId, amount: Number(quoteAmount) })
                             }
                          }}
                          disabled={quoteMutation.isPending}
                          className="btn-primary py-2 text-sm whitespace-nowrap"
                        >
                          Send Quote
                        </button>
                        <button 
                          onClick={() => rejectMutation.mutate(activeBookingId)}
                          disabled={rejectMutation.isPending}
                          className="btn-secondary py-2 text-sm whitespace-nowrap text-rose hover:bg-rose/10"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {requests.find(r => r.id === activeBookingId)?.status === 'QUOTED' && (
                       <div className="text-center font-sans text-sm text-navy bg-navy/10 py-2 rounded">
                          Waiting for customer to accept ₹{requests.find(r => r.id === activeBookingId)?.quotedAmount}
                       </div>
                    )}
                    {requests.find(r => r.id === activeBookingId)?.status === 'ACCEPTED' && (
                       <div className="text-center font-sans font-bold text-sm text-sage bg-sage/10 py-2 rounded flex items-center justify-center gap-2">
                          <Check size={16} /> Booking Confirmed
                       </div>
                    )}
                    {requests.find(r => r.id === activeBookingId)?.status === 'REJECTED' && (
                       <div className="text-center font-sans font-bold text-sm text-rose bg-rose/10 py-2 rounded flex items-center justify-center gap-2">
                          <X size={16} /> You rejected this request
                       </div>
                    )}
                    {requests.find(r => r.id === activeBookingId)?.status === 'CANCELLED' && (
                       <div className="text-center font-sans font-bold text-sm text-muted bg-stone py-2 rounded flex items-center justify-center gap-2">
                          <X size={16} /> Customer cancelled this request
                       </div>
                    )}
                  </div>

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
