import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MapPin, DollarSign, Info, ShieldCheck, AlertCircle } from 'lucide-react'
import { vendorService, type VendorProfile } from '../../services/vendorService'
import PortfolioManager from './components/PortfolioManager'


export default function VendorDashboardPage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<VendorProfile>>({})

  // Fetch own profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['vendorProfile', 'me'],
    queryFn: vendorService.getMyProfile,
  })

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: vendorService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProfile', 'me'] })
      setIsEditing(false)
    },
  })

  if (isLoading) return <PageLoader />

  if (!profile) return <div className="pt-32 text-center text-rose">Failed to load profile.</div>

  const handleEditClick = () => {
    setFormData({
      businessName: profile.businessName,
      bio: profile.bio || '',
      basePrice: profile.basePrice || 0,
      priceUnit: profile.priceUnit,
      city: profile.city,
      state: profile.state || '',
      serviceRadiusKm: profile.serviceRadiusKm,
    })
    setIsEditing(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* KYC Banner */}
        {profile.kycStatus === 'PENDING' && (
          <div className="bg-amber/10 border border-amber/20 rounded-card p-4 flex gap-3 items-start">
            <AlertCircle className="text-amber shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans font-semibold text-amber">Verification Pending</h4>
              <p className="font-sans text-sm text-ink/80 mt-1">Your profile is currently hidden from customers. Please complete KYC verification to get listed.</p>
            </div>
          </div>
        )}
        
        {profile.kycStatus === 'APPROVED' && (
          <div className="bg-sage/10 border border-sage/20 rounded-card p-4 flex gap-3 items-start">
            <ShieldCheck className="text-sage shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans font-semibold text-sage">Verified Vendor</h4>
              <p className="font-sans text-sm text-ink/80 mt-1">Your profile is live and visible to customers.</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="card-white overflow-hidden p-0 relative">
          <div className="h-32 bg-navy" />
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-card flex items-center justify-center p-1 border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-stone rounded-xl flex items-center justify-center font-display text-2xl text-navy">
                  {profile.businessName.charAt(0)}
                </div>
              </div>
              {!isEditing && (
                <div className="flex items-center gap-3">
                  <Link to="/vendor/bookings" className="btn-primary py-2 px-4 text-xs bg-navy hover:bg-navy/90 text-white shadow-none">
                    View Bookings
                  </Link>
                  <button onClick={handleEditClick} className="btn-secondary py-2 text-xs">
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              // ── View Mode ──
              <div className="space-y-8">
                <div>
                  <h1 className="font-display font-semibold text-3xl text-ink">{profile.businessName}</h1>
                  <span className="badge-category mt-2">{profile.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone">
                  <div>
                    <div className="flex items-center gap-2 text-muted mb-1"><MapPin size={16} /> <span className="font-sans text-xs tracking-widest uppercase">Location</span></div>
                    <p className="font-sans font-medium text-ink">{profile.city}{profile.state ? `, ${profile.state}` : ''}</p>
                    {profile.serviceRadiusKm && (
                      <p className="font-sans text-sm text-muted mt-0.5">{profile.serviceRadiusKm} km radius</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted mb-1"><DollarSign size={16} /> <span className="font-sans text-xs tracking-widest uppercase">Pricing</span></div>
                    <p className="font-sans font-medium text-ink">₹{profile.basePrice || 'Not set'}</p>
                    <p className="font-sans text-sm text-muted mt-0.5">{profile.priceUnit?.replace('_', ' ') || 'per event'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted mb-1"><Info size={16} /> <span className="font-sans text-xs tracking-widest uppercase">Bio</span></div>
                    <p className="font-sans text-sm text-ink line-clamp-3">{profile.bio || 'Add a bio to attract more customers.'}</p>
                  </div>
                </div>
              </div>
            ) : (
              // ── Edit Mode ──
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="bmv-label">Business Name</label>
                    <input
                      type="text"
                      className="bmv-input"
                      value={formData.businessName || ''}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="bmv-label">Base Price (₹)</label>
                    <input
                      type="number"
                      className="bmv-input"
                      value={formData.basePrice || ''}
                      onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="bmv-label">City</label>
                    <input
                      type="text"
                      className="bmv-input"
                      value={formData.city || ''}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="bmv-label">State</label>
                    <input
                      type="text"
                      className="bmv-input"
                      value={formData.state || ''}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="bmv-label">About your business</label>
                    <textarea
                      className="bmv-input min-h-[100px] resize-y"
                      value={formData.bio || ''}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell customers what makes your service special..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-stone">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* Portfolio Section */}
        <div className="card-white mt-6">
          <PortfolioManager />
        </div>

      </div>
    </div>
  )
}



