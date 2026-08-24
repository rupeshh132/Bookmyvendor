import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { vendorService } from '../../services/vendorService'

const CATEGORIES = ['PHOTOGRAPHER', 'CATERER', 'DECORATOR', 'VENUE', 'MAKEUP']

export default function VendorSearchPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('PHOTOGRAPHER')
  const [city, setCity] = useState('Lucknow')

  // Search query
  const { data: vendors, isLoading, isError, refetch } = useQuery({
    queryKey: ['vendors', category, city],
    queryFn: () => vendorService.searchVendors({ category, city }),
  })

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Search Header ── */}
      <div className="bg-navy pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-container mx-auto relative z-10">
          <h1 className="font-display font-semibold text-white text-4xl md:text-5xl mb-6 text-center">
            Find the perfect <span className="text-terracotta capitalize">{category.toLowerCase()}</span>
          </h1>
          
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-elevated flex items-center flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 w-full">
              <Search size={20} className="text-muted mr-2" />
              <select
                className="w-full bg-transparent border-none focus:ring-0 font-sans text-ink appearance-none cursor-pointer py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-stone" />
            
            <div className="flex-1 flex items-center px-4 w-full border-t md:border-none border-stone pt-2 md:pt-0">
              <MapPin size={20} className="text-muted mr-2" />
              <input
                type="text"
                className="w-full bg-transparent border-none focus:ring-0 font-sans text-ink py-2"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refetch()}
              />
            </div>
            
            <button
              onClick={() => refetch()}
              className="btn-primary w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Results Section ── */}
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display font-semibold text-2xl text-ink">
              {vendors?.length || 0} Vendors found
            </h2>
            <p className="font-sans text-muted">in {city}</p>
          </div>
          <button className="flex items-center gap-2 font-sans font-medium text-sm text-navy bg-stone px-4 py-2 rounded-full hover:bg-stone/80 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card-white animate-pulse h-80" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-rose font-sans">Failed to load vendors. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && vendors?.length === 0 && (
          <div className="text-center py-20 bg-stone rounded-card">
            <MapPin size={48} className="text-muted mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-semibold text-xl text-ink mb-2">No vendors found</h3>
            <p className="font-sans text-muted">Try changing your category or city to see more results.</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors?.map(vendor => (
            <div key={vendor.id} onClick={() => navigate(`/vendors/${vendor.id}`)} className="card-white group cursor-pointer p-0 overflow-hidden flex flex-col">
              {/* Image Placeholder */}
              <div className="h-48 bg-stone relative">
                {/* Fallback pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#16232E 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                {vendor.isFeatured && (
                  <div className="absolute top-4 left-4 bg-terracotta text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  ₹{vendor.basePrice || 'N/A'} {vendor.priceUnit?.replace('_', ' ') || ''}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-semibold text-xl text-ink group-hover:text-terracotta transition-colors line-clamp-1">
                    {vendor.businessName}
                  </h3>
                  <div className="flex items-center gap-1 bg-sage/10 text-sage px-2 py-0.5 rounded text-sm font-semibold">
                    <Star size={14} className="fill-sage" />
                    {vendor.avgRating > 0 ? vendor.avgRating : 'New'}
                  </div>
                </div>
                
                <p className="font-sans text-sm text-muted mb-4 flex items-center gap-1.5">
                  <MapPin size={14} /> {vendor.city}, {vendor.state || 'India'}
                </p>

                <p className="font-sans text-sm text-ink line-clamp-2 mb-6 flex-1">
                  {vendor.bio || 'Professional event services for your special day.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone">
                  <span className="font-sans text-xs text-muted">
                    {vendor.totalReviews} reviews
                  </span>
                  <button className="flex items-center gap-1 text-navy font-semibold text-sm group-hover:gap-2 transition-all">
                    View Profile <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}




