import api from './api'

export interface VendorProfile {
  id: string
  userId: string
  businessName: string
  category: string
  city: string
  state: string | null
  bio: string | null
  basePrice: number | null
  priceUnit: string
  serviceRadiusKm: number
  avgRating: number
  totalReviews: number
  trustScore: number
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  isFeatured: boolean
  latitude?: number
  longitude?: number
}

export interface PortfolioImage {
  id: string
  imageUrl: string
  publicId: string
  displayOrder: number
}

export const vendorService = {
  // Public: Search vendors
  searchVendors: async (params: { category: string; city?: string; lat?: number; lon?: number; radiusKm?: number }): Promise<VendorProfile[]> => {
    const res = await api.get('/api/v1/vendors/search', { params })
    return res.data.data
  },

  // Public: Get single vendor
  getVendor: async (id: string): Promise<VendorProfile> => {
    const res = await api.get(`/api/v1/vendors/${id}`)
    return res.data.data
  },

  // Protected: Get own profile
  getMyProfile: async (): Promise<VendorProfile> => {
    const res = await api.get('/api/v1/vendors/me')
    return res.data.data
  },

  // Protected: Update own profile
  updateMyProfile: async (data: Partial<VendorProfile>): Promise<VendorProfile> => {
    const res = await api.put('/api/v1/vendors/me', data)
    return res.data.data
  },

  // Public: Get Vendor Portfolio
  getVendorPortfolio: async (vendorId: string): Promise<PortfolioImage[]> => {
    const res = await api.get(/api/v1/vendors/ + vendorId + /portfolio)
    return res.data.data
  },

  // Protected: Get My Portfolio
  getMyPortfolio: async (): Promise<PortfolioImage[]> => {
    const res = await api.get('/api/v1/vendors/me/portfolio')
    return res.data.data
  },

  // Protected: Upload Portfolio Image
  uploadPortfolioImage: async (file: File): Promise<PortfolioImage> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/api/v1/vendors/me/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  // Protected: Delete Portfolio Image
  deletePortfolioImage: async (imageId: string): Promise<void> => {
    await api.delete(/api/v1/vendors/me/portfolio/ + imageId)
  }
}

