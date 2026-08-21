import api from './api'

export interface BookingRequestDto {
  id: string
  customerId: string
  customerName: string
  vendorId: string
  vendorBusinessName: string
  eventType: string
  eventDate: string
  guestCount: number | null
  message: string
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
  quotedAmount: number | null
  createdAt: string
}

export const bookingService = {
  createRequest: async (data: { vendorId: string, eventType: string, eventDate: string, guestCount?: number, message: string }): Promise<BookingRequestDto> => {
    const res = await api.post('/api/v1/bookings/request', data)
    return res.data.data
  },
  
  getCustomerRequests: async (): Promise<BookingRequestDto[]> => {
    const res = await api.get('/api/v1/bookings/customer')
    return res.data.data
  },
  
  getVendorRequests: async (): Promise<BookingRequestDto[]> => {
    const res = await api.get('/api/v1/bookings/vendor')
    return res.data.data
  }
}
