import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ShieldCheck, Calendar, LogOut } from 'lucide-react'
import { useAuthStore } from '../../lib/authStore'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'KYC Queue', path: '/admin/kyc', icon: ShieldCheck },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="font-display font-bold text-2xl text-ink">
            <img src="/logo.jpg" alt="BookMyVendor" className="h-8 object-contain" />
          </Link>
          <div className="mt-1 text-xs text-muted uppercase tracking-widest font-bold">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-sans font-medium text-sm ${
                  isActive ? 'bg-navy text-white shadow-card' : 'text-ink hover:bg-stone/50'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-stone">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-sans font-medium text-sm text-rose hover:bg-rose/10 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
