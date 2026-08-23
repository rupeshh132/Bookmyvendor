import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { MapPin, Star, ShieldCheck, ArrowLeft, Calendar, Users, MessageSquare } from 'lucide-react'
import { vendorService } from '../../services/vendorService'
import { bookingService } from '../../services/bookingService'
import { reviewService } from '../../services/reviewService'
import { useAuthStore } from '../../lib/authStore'

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    eventType: 'WEDDING',
    eventDate: '',
    guestCount: '',
    message: ''
  })

  // ── Fetch Data ──
  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorService.getVendor(id!),
    enabled: !!id,
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getVendorReviews(id!),
    enabled: !!id,
  })

  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => vendorService.getVendorPortfolio(id!),
    enabled: !!id,
  })

  // ── Booking Request Mutation ──
  const requestMutation = useMutation({
    mutationFn: bookingService.createRequest,
    onSuccess: () => {
      alert("Request sent successfully!")
      setIsModalOpen(false)
      setFormData({ eventType: 'WEDDING', eventDate: '', guestCount: '', message: '' })
    },
    onError: () => {
      alert("Failed to send request. Make sure you're logged in.")
    }
  })

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    requestMutation.mutate({
      vendorId: id!,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
      message: formData.message
    })
  }

  if (vendorLoading) return <div className="min-h-screen bg-ivory pt-32 px-6 animate-pulse"><div className="h-96 bg-stone rounded-card max-w-container mx-auto"></div></div>
  if (!vendor) return <div className="pt-32 text-center text-rose">Vendor not found</div>

  return (
    <div className="min-h-screen bg-ivory pb-20">
      
      {/* ── Hero Banner ── */}
      <div className="bg-navy pt-24 pb-32 px-6">
        <div className="max-w-container mx-auto">
          <button onClick={() => navigate(-1)} className="text-stone hover:text-white flex items-center gap-2 mb-8 font-sans transition-colors">
            <ArrowLeft size={16} /> Back to Search
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
            <div>
              <span className="badge-category mb-4 inline-block">{vendor.category}</span>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-white mb-4">{vendor.businessName}</h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 font-sans text-stone">
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-terracotta" /> {vendor.city}, {vendor.state || 'India'}</span>
                <span className="flex items-center gap-1.5"><Star size={18} className="text-sage fill-sage" /> {vendor.avgRating > 0 ? `${vendor.avgRating} (${vendor.totalReviews} reviews)` : 'New'}</span>
                {vendor.kycStatus === 'APPROVED' && <span className="flex items-center gap-1.5 text-sage"><ShieldCheck size={18} /> Verified</span>}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white text-center min-w-[200px]">
              <p className="font-sans text-stone text-sm mb-1 uppercase tracking-widest">Starting Price</p>
              <p className="font-display text-3xl font-semibold mb-4">₹{vendor.basePrice || 'N/A'}</p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full shadow-lg">Request Quote</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-white p-8">
              <h2 className="font-display font-semibold text-3xl text-ink mb-4">About the service</h2>
              <p className="font-sans text-ink leading-relaxed whitespace-pre-wrap">{vendor.bio || "No bio provided."}</p>
            </div>

            <div className="card-white p-8">
              <h3 className="font-display font-semibold text-2xl text-ink mb-6">Portfolio</h3>
              {portfolioLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="aspect-square bg-stone rounded-xl"></div>)}
                </div>
              ) : portfolio.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolio.map(img => (
                    <div key={img.id} className="aspect-square bg-stone rounded-xl overflow-hidden">
                      <img src={img.imageUrl} alt="Portfolio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-muted">No portfolio images uploaded yet.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="card-white p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-semibold text-2xl text-ink">Reviews</h3>
                <div className="flex items-center gap-1 bg-amber/10 text-amber px-3 py-1 rounded-full text-sm font-bold">
                  <Star size={16} fill="currentColor" />
                  <span>{(vendor.avgRating || 0).toFixed(1)} ({vendor.totalReviews || 0})</span>
                </div>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-stone last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans font-bold text-ink">{review.customerName}</span>
                        <span className="text-xs text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= review.rating ? 'text-amber' : 'text-stone'} 
                            fill={star <= review.rating ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="font-sans text-ink text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-muted">No reviews yet. Be the first to review after booking!</p>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
             <div className="card-white p-6">
                <h4 className="font-sans font-bold text-ink mb-4 uppercase tracking-wider text-sm">Service Details</h4>
                <ul className="space-y-3 font-sans text-ink">
                  <li className="flex justify-between border-b border-stone pb-2">
                    <span className="text-muted">Pricing Unit</span>
                    <span className="font-medium capitalize">{vendor.priceUnit?.replace('_', ' ') || 'Not specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-stone pb-2">
                    <span className="text-muted">Service Radius</span>
                    <span className="font-medium">{vendor.serviceRadiusKm} km</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-muted">Trust Score</span>
                    <span className="font-medium text-sage">{vendor.trustScore}/100</span>
                  </li>
                </ul>
             </div>
          </div>

        </div>
      </div>

      {/* ── Quote Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
          <div className="bg-white rounded-card w-full max-w-lg p-8 relative shadow-floating animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-ink">
               ✕
            </button>
            <h3 className="font-display font-semibold text-2xl text-ink mb-2">Request Quotation</h3>
            <p className="font-sans text-sm text-muted mb-6">Send your event details to <span className="font-medium text-navy">{vendor.businessName}</span>.</p>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="bmv-label"><Calendar size={14} className="inline mr-1"/> Event Date</label>
                <input type="date" required className="bmv-input" min={new Date().toISOString().split('T')[0]} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="bmv-label">Event Type</label>
                  <select className="bmv-input" value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                    <option value="WEDDING">Wedding</option>
                    <option value="BIRTHDAY">Birthday</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="bmv-label"><Users size={14} className="inline mr-1"/> Guest Count</label>
                  <input type="number" className="bmv-input" placeholder="e.g. 500" value={formData.guestCount} onChange={e => setFormData({...formData, guestCount: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="bmv-label"><MessageSquare size={14} className="inline mr-1"/> Message</label>
                <textarea required className="bmv-input h-24 resize-none" placeholder="Describe what you need..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>

              <button type="submit" disabled={requestMutation.isPending} className="btn-primary w-full mt-4">
                {requestMutation.isPending ? 'Sending Request...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

