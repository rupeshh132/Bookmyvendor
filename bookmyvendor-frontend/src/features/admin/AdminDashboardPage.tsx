import { useQuery } from '@tanstack/react-query'
import { Users, Store, IndianRupee, Calendar } from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
  })

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink mb-2">Overview</h1>
          <p className="font-sans text-muted">Platform statistics and activity summary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-white p-6 border border-stone">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-stone rounded-xl"><Users size={24}/></div>
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
            <div className="p-3 bg-navy rounded-xl text-white"><IndianRupee size={24}/></div>
          </div>
          <h3 className="font-sans text-muted text-sm uppercase tracking-wider mb-1">Total Payment Vol.</h3>
          <p className="font-display font-semibold text-3xl text-ink">₹{statsLoading ? '-' : stats?.totalRevenue}</p>
        </div>
      </div>
    </div>
  )
}
