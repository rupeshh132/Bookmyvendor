import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Store, DollarSign, Calendar, ShieldCheck, X, FileText } from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc'>('overview')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
  })

  const { data: kycQueue = [], isLoading: kycLoading } = useQuery({
    queryKey: ['adminKycQueue'],
    queryFn: adminService.getKycQueue,
  })

  const kycMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => 
      adminService.processKyc(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminKycQueue'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    }
  })

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-display font-semibold text-3xl text-ink">Admin Dashboard</h1>
            <p className="font-sans text-muted">Manage users, approve vendors, and track revenue.</p>
          </div>
          <div className="flex bg-stone rounded-full p-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-sans text-sm rounded-full transition-colors ${activeTab === 'overview' ? 'bg-white text-navy shadow-sm' : 'text-muted'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('kyc')}
              className={`px-4 py-2 font-sans text-sm rounded-full transition-colors ${activeTab === 'kyc' ? 'bg-white text-navy shadow-sm' : 'text-muted flex items-center gap-2'}`}
            >
              KYC Queue 
              {stats?.pendingKycCount ? <span className="bg-terracotta text-white text-[10px] px-2 py-0.5 rounded-full">{stats.pendingKycCount}</span> : null}
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="card-white p-6 border border-stone">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-navy/10 rounded-xl text-navy"><Users size={24}/></div>
               </div>
               <h3 className="font-sans text-muted text-sm uppercase tracking-wider mb-1">Total Customers</h3>
               <p className="font-display font-semibold text-3xl text-ink">{statsLoading ? '-' : stats?.totalCustomers}</p>
             </div>
             
             <div className="card-white p-6 border border-stone">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-terracotta/10 rounded-xl text-terracotta"><Store size={24}/></div>
               </div>
               <h3 className="font-sans text-muted text-sm uppercase tracking-wider mb-1">Total Vendors</h3>
               <p className="font-display font-semibold text-3xl text-ink">{statsLoading ? '-' : stats?.totalVendors}</p>
             </div>
             
             <div className="card-white p-6 border border-stone">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-sage/10 rounded-xl text-sage"><Calendar size={24}/></div>
               </div>
               <h3 className="font-sans text-muted text-sm uppercase tracking-wider mb-1">Total Bookings</h3>
               <p className="font-display font-semibold text-3xl text-ink">{statsLoading ? '-' : stats?.totalBookings}</p>
             </div>
             
             <div className="card-white p-6 border border-stone">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-navy rounded-xl text-white"><DollarSign size={24}/></div>
               </div>
               <h3 className="font-sans text-muted text-sm uppercase tracking-wider mb-1">Total Payment Vol.</h3>
               <p className="font-display font-semibold text-3xl text-ink">₹{statsLoading ? '-' : stats?.totalRevenue}</p>
             </div>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="card-white overflow-hidden p-0 border border-stone">
            {kycLoading ? (
              <div className="p-8 text-center text-muted">Loading queue...</div>
            ) : kycQueue.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                 <ShieldCheck size={48} className="text-sage opacity-50 mb-4" />
                 <h4 className="font-display text-xl text-ink">All caught up!</h4>
                 <p className="font-sans text-muted mt-2">There are no pending KYC requests at the moment.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone/50 border-b border-stone text-xs uppercase tracking-widest text-muted font-sans">
                    <th className="p-4">Vendor Details</th>
                    <th className="p-4">Category / City</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone">
                  {kycQueue.map(vendor => (
                    <tr key={vendor.id} className="hover:bg-stone/20 transition-colors">
                      <td className="p-4">
                        <div className="font-display font-semibold text-ink text-lg">{vendor.businessName}</div>
                        <div className="font-sans text-sm text-muted line-clamp-1">{vendor.bio}</div>
                      </td>
                      <td className="p-4">
                        <span className="badge-category block w-max mb-1">{vendor.category}</span>
                        <span className="font-sans text-sm text-muted">{vendor.city}</span>
                      </td>
                      <td className="p-4 font-sans text-ink font-medium">
                        ₹{vendor.basePrice}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => kycMutation.mutate({ id: vendor.id, status: 'REJECTED' })}
                             disabled={kycMutation.isPending}
                             className="p-2 text-rose hover:bg-rose/10 rounded-full transition-colors"
                             title="Reject"
                           >
                             <X size={20} />
                           </button>
                           <button 
                             onClick={() => kycMutation.mutate({ id: vendor.id, status: 'APPROVED' })}
                             disabled={kycMutation.isPending}
                             className="p-2 text-sage hover:bg-sage/10 rounded-full transition-colors"
                             title="Approve"
                           >
                             <ShieldCheck size={20} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
