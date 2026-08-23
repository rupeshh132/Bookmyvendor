import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, X, FileText } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Link } from 'react-router-dom'

export default function AdminKycQueuePage() {
  const queryClient = useQueryClient()

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
    <div>
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">KYC Approval Queue</h1>
      <p className="font-sans text-muted mb-8">Review and verify new vendor profiles before they go live.</p>

      {kycLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-stone rounded-2xl"></div>)}
        </div>
      ) : kycQueue.length === 0 ? (
        <div className="text-center py-20 card-white border border-dashed border-stone">
          <ShieldCheck size={48} className="mx-auto text-stone mb-4" />
          <h3 className="font-display font-semibold text-xl text-ink mb-2">All Caught Up!</h3>
          <p className="text-muted font-sans">There are no pending KYC requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {kycQueue.map(vendor => (
            <div key={vendor.id} className="card-white p-6 border border-stone flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-stone rounded-xl flex items-center justify-center font-display text-xl text-navy shrink-0">
                  {vendor.businessName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-ink">
                    <Link to={`/vendors/${vendor.id}`} target="_blank" className="hover:text-terracotta transition-colors">
                      {vendor.businessName}
                    </Link>
                  </h3>
                  <div className="flex gap-4 mt-1 font-sans text-sm text-muted">
                    <span>{vendor.category}</span>
                    <span>•</span>
                    <span>{vendor.city}, {vendor.state}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="badge-category text-[10px] py-0.5 px-2 bg-amber/10 text-amber">KYC PENDING</span>
                    {vendor.idProofUrl && (
                      <a href={vendor.idProofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-navy font-medium hover:underline">
                        <FileText size={14}/> View ID Proof
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => kycMutation.mutate({ id: vendor.id, status: 'REJECTED' })}
                  className="btn-secondary py-2 px-4 flex-1 md:flex-none justify-center text-rose border-rose/20 hover:bg-rose/5"
                  disabled={kycMutation.isPending}
                >
                  <X size={16} className="mr-1"/> Reject
                </button>
                <button 
                  onClick={() => kycMutation.mutate({ id: vendor.id, status: 'APPROVED' })}
                  className="btn-primary py-2 px-6 flex-1 md:flex-none justify-center bg-sage hover:bg-sage/90 shadow-none"
                  disabled={kycMutation.isPending}
                >
                  <ShieldCheck size={16} className="mr-1"/> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
