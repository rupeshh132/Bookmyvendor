import api from './api'
import type { VendorProfile } from './vendorService'

export interface AdminDashboardStats {
  totalCustomers: number
  totalVendors: number
  pendingKycCount: number
  totalBookings: number
  totalRevenue: number
}

export const adminService = {
  getStats: async (): Promise<AdminDashboardStats> => {
    const res = await api.get('/api/v1/admin/dashboard')
    return res.data.data
  },

  getKycQueue: async (): Promise<VendorProfile[]> => {
    const res = await api.get('/api/v1/admin/kyc-queue')
    return res.data.data
  },

  processKyc: async (vendorProfileId: string, status: 'APPROVED' | 'REJECTED', rejectionNote?: string): Promise<VendorProfile> => {
    const res = await api.put(`/api/v1/admin/kyc/` + vendorProfileId, { status, rejectionNote })
    return res.data.data
  }
}
