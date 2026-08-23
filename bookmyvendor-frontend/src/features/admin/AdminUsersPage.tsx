import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { Check, Ban } from 'lucide-react'

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  })

  const toggleBlockMutation = useMutation({
    mutationFn: adminService.toggleUserBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })

  if (isLoading) return <div>Loading users...</div>

  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">Manage Users</h1>
      <p className="font-sans text-muted mb-8">View and manage all registered customers and vendors.</p>
      
      <div className="card-white overflow-hidden p-0">
        <table className="w-full text-left font-sans">
          <thead className="bg-stone text-ink border-b border-stone">
            <tr>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Joined</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-stone/20">
                <td className="p-4">
                  <div className="font-medium text-ink">{user.phone ? `+91 ${user.phone}` : user.email}</div>
                  {user.phone && user.email && <div className="text-xs text-muted">{user.email}</div>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    user.role === 'ADMIN' ? 'bg-rose/10 text-rose' :
                    user.role === 'VENDOR' ? 'bg-navy/10 text-navy' : 'bg-sage/10 text-sage'
                  }`}>{user.role}</span>
                </td>
                <td className="p-4 text-sm text-muted">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {user.isActive ? (
                    <span className="flex items-center gap-1 text-sage text-sm font-medium"><Check size={14}/> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose text-sm font-medium"><Ban size={14}/> Blocked</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'ADMIN' && (
                    <button 
                      onClick={() => toggleBlockMutation.mutate(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        user.isActive ? 'bg-rose/10 text-rose hover:bg-rose hover:text-white' : 'bg-sage/10 text-sage hover:bg-sage hover:text-white'
                      }`}
                    >
                      {user.isActive ? 'Block' : 'Unblock'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

