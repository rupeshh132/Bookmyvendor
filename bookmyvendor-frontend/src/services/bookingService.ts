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
  
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
}

export const bookingService = {
  createRequest: async (data: { vendorId: string, eventType: string, eventDate: string, guestCount?: number, message: string   
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
}): Promise<BookingRequestDto> => {
    const res = await api.post('/api/v1/bookings/request', data)
    return res.data.data
    
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
},
  
  getCustomerRequests: async (): Promise<BookingRequestDto[]> => {
    const res = await api.get('/api/v1/bookings/customer')
    return res.data.data
    
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
},
  
  getVendorRequests: async (): Promise<BookingRequestDto[]> => {
    const res = await api.get('/api/v1/bookings/vendor')
    return res.data.data
    
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
}
  
  // Vendor: Send Quote
  sendQuote: async (bookingId: string, amount: number): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /quote?amount= + amount)
    return res.data.data
  },

  // Customer: Accept Quote
  acceptQuote: async (bookingId: string): Promise<BookingRequestDto> => {
    const res = await api.put(/api/v1/bookings/ + bookingId + /accept)
    return res.data.data
  },

  // Get Chat History
  getChatHistory: async (bookingId: string): Promise<any[]> => {
    const res = await api.get(/api/v1/chat/ + bookingId)
    return res.data.data
  }
}

