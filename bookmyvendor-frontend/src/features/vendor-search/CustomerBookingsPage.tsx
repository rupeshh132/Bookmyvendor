import { PageLoader } from '../../components/ui/page-loader'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, MessageCircle, Check, Star, X } from 'lucide-react'
import { bookingService } from '../../services/bookingService'
import { paymentService } from '../../services/paymentService'
import { reviewService } from '../../services/reviewService'
import ChatRoom from '../../components/chat/ChatRoom'

// Helper to load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export default function CustomerBookingsPage() {
  const queryClient = useQueryClient()
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['customerBookings'],
    queryFn: bookingService.getCustomerRequests,
  })

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const reviewMutation = useMutation({
    mutationFn: () => reviewService.addReview(activeBookingId!, reviewRating, reviewComment),
    onSuccess: () => {
      alert("Review submitted successfully!")
      setIsReviewModalOpen(false)
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to submit review')
    }
  })

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return
    setIsCancelling(true)
    try {
      await bookingService.cancelRequest(bookingId)
      queryClient.invalidateQueries({ queryKey: ['customerBookings'] })
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel request')
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePaymentAndAccept = async (bookingId: string) => {
    setIsProcessingPayment(true)
    try {
      const res = await loadRazorpay()
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?')
        setIsProcessingPayment(false)
        return
      }

      // Create Order on Backend
      const orderData = await paymentService.createOrder(bookingId)

      const options = {
        key: orderData.keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        name: 'BookMyVendor',
        description: 'Advance Booking Payment',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
            alert('Payment Successful! Booking Confirmed.')
            queryClient.invalidateQueries({ queryKey: ['customerBookings'] })
          } catch (err) {
            alert('Payment verification failed.')
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#16232E'
        }
      }

      // Type assertion for Razorpay
      const rzp = new (window as any).Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description)
      })

      rzp.open()

    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">My Bookings</h1>
          <p className="font-sans text-muted">Track your event quotes and chat with vendors.</p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-stone rounded-card border border-stone">
            <h3 className="font-display font-semibold text-xl text-ink mb-2">No bookings yet</h3>
            <p className="font-sans text-muted">Find a vendor and request a quote to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ── Left Column: Requests List ── */}
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
                      <h3 className="font-display font-semibold text-xl text-ink mt-2">{req.vendorBusinessName}</h3>
                      <p className="font-sans text-sm text-muted capitalize">{req.eventType.toLowerCase()} Event</p>
                    </div>
                    {req.quotedAmount && (
                       <div className="text-right">
                         <span className="block text-xs uppercase text-muted font-bold">Quote</span>
                         <span className="font-display font-semibold text-xl text-navy">₹{req.quotedAmount}</span>
                       </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 font-sans text-sm text-ink mt-4">
                    <span className="flex items-center gap-1.5 bg-stone px-2 py-1 rounded"><Calendar size={14} className="text-terracotta"/> {new Date(req.eventDate).toLocaleDateString()}</span>
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
                        <div className="flex flex-col gap-2">
                           <div className="text-center font-sans text-sm text-amber bg-amber/10 py-2 rounded">
                              Waiting for vendor to send a quote
                           </div>
                           <button 
                             onClick={() => handleCancel(activeBookingId)}
                             disabled={isCancelling}
                             className="btn-secondary py-2 text-sm w-full text-rose hover:bg-rose/10"
                           >
                             Cancel Request
                           </button>
                        </div>
                      )}
                      {requests.find(r => r.id === activeBookingId)?.status === 'QUOTED' && (
                         <div className="flex flex-col gap-2">
                           <div className="text-center font-sans font-medium text-sm text-ink bg-white border border-stone py-2 rounded">
                              Vendor Quoted ₹{requests.find(r => r.id === activeBookingId)?.quotedAmount}
                           </div>
                           <div className="flex gap-2">
                             <button 
                               onClick={() => handlePaymentAndAccept(activeBookingId)}
                               disabled={isProcessingPayment || isCancelling}
                               className="btn-primary py-2 text-sm flex-1"
                             >
                               {isProcessingPayment ? 'Processing...' : 'Pay 20% Advance & Book'}
                             </button>
                             <button 
                               onClick={() => handleCancel(activeBookingId)}
                               disabled={isProcessingPayment || isCancelling}
                               className="btn-secondary py-2 text-sm whitespace-nowrap text-rose hover:bg-rose/10"
                             >
                               Cancel
                             </button>
                           </div>
                         </div>
                      )}
                      {requests.find(r => r.id === activeBookingId)?.status === 'ACCEPTED' && (
                         <div className="flex flex-col gap-2">
                           <div className="text-center font-sans font-bold text-sm text-sage bg-sage/10 py-2 rounded flex items-center justify-center gap-2">
                              <Check size={16} /> Booking Confirmed
                           </div>
                           <button
                             onClick={() => setIsReviewModalOpen(true)}
                             className="btn-primary py-2 text-sm w-full flex items-center justify-center gap-2"
                           >
                             <Star size={16} /> Write a Review
                           </button>
                         </div>
                      )}
                      {requests.find(r => r.id === activeBookingId)?.status === 'REJECTED' && (
                         <div className="text-center font-sans font-bold text-sm text-rose bg-rose/10 py-2 rounded flex items-center justify-center gap-2">
                            Vendor rejected this request
                         </div>
                      )}
                      {requests.find(r => r.id === activeBookingId)?.status === 'CANCELLED' && (
                         <div className="text-center font-sans font-bold text-sm text-muted bg-stone py-2 rounded flex items-center justify-center gap-2">
                            You cancelled this request
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
                   <h4 className="font-display text-lg text-ink mb-1">Select a Booking</h4>
                   <p className="font-sans text-sm">Click on a booking to view details, chat with the vendor, and accept quotes.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-4">Rate Vendor</h2>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`${star <= reviewRating ? 'text-amber' : 'text-stone'} hover:text-amber/80 transition-colors`}
                >
                  <Star size={32} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Write a review (optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="input-field min-h-[100px] resize-y"
                placeholder="How was your experience?"
              />
            </div>

            <button
              onClick={() => reviewMutation.mutate()}
              disabled={reviewMutation.isPending}
              className="btn-primary w-full"
            >
              {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


