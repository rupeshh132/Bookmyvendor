import api from './api'

export interface PaymentOrderResponse {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

export const paymentService = {
  createOrder: async (bookingId: string): Promise<PaymentOrderResponse> => {
    const res = await api.post(`/api/v1/payments/create-order/` + bookingId)
    return res.data.data
  },

  verifyPayment: async (data: { razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }): Promise<void> => {
    await api.post(`/api/v1/payments/verify`, data)
  }
}
