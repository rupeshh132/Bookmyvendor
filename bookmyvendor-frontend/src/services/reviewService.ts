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

export const reviewService = {
  addReview: async (bookingId: string, rating: number, comment?: string) => {
    const response = await api.post<ReviewResponse>('/reviews', {
      bookingId,
      rating,
      comment
    })
    return response.data
  },

  getVendorReviews: async (vendorId: string) => {
    const response = await api.get<ReviewResponse[]>(`/reviews/vendor/${vendorId}`)
    return response.data
  }
}
