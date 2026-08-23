import api from './api'

export interface ReviewResponse {
  id: string
  vendorId: string
  customerId: string
  customerName: string
  bookingId: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewRequest {
  bookingId: string
  rating: number
  comment?: string
}

export const reviewService = {
  addReview: async (bookingId: string, rating: number, comment?: string) => {
    const response = await api.post<ReviewResponse>('/api/v1/reviews', {
      bookingId,
      rating,
      comment
    })
    return response.data
  },

  getVendorReviews: async (vendorId: string) => {
    const response = await api.get<ReviewResponse[]>(`/api/v1/reviews/vendor/${vendorId}`)
    return response.data
  }
}
