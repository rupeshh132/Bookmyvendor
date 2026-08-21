import { useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { vendorService } from '../../../services/vendorService'
import { motion, AnimatePresence } from 'framer-motion'

export default function PortfolioManager() {
  const queryClient = useQueryClient()
  const [uploadError, setUploadError] = useState('')

  // ── Fetch Portfolio ──
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['myPortfolio'],
    queryFn: vendorService.getMyPortfolio,
  })

  // ── Upload Mutation ──
  const uploadMutation = useMutation({
    mutationFn: vendorService.uploadPortfolioImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPortfolio'] })
      setUploadError('')
    },
    onError: (err: any) => {
      setUploadError(err.response?.data?.error || 'Failed to upload image')
    }
  })

  // ── Delete Mutation ──
  const deleteMutation = useMutation({
    mutationFn: vendorService.deletePortfolioImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPortfolio'] })
    }
  })

  // ── Drag & Drop Handlers ──
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} is too large (max 5MB)`)
        return
      }
      uploadMutation.mutate(file)
    })
  }, [uploadMutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5242880, // 5MB
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-display font-semibold text-2xl text-ink">Portfolio</h3>
          <p className="font-sans text-sm text-muted mt-1">Upload your best work to attract customers. Max 5MB per image.</p>
        </div>
      </div>

      {uploadError && (
        <div className="bg-rose/10 border border-rose/20 text-rose rounded-input px-4 py-3 font-sans text-sm">
          {uploadError}
        </div>
      )}

      {/* ── Dropzone ── */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-card p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-navy bg-stone/50' : 'border-stone hover:border-navy hover:bg-stone/20'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted mb-4" />
        {isDragActive ? (
          <p className="font-sans font-medium text-navy">Drop the images here ...</p>
        ) : (
          <div>
            <p className="font-sans font-medium text-ink mb-1">Drag & drop images here, or click to select files</p>
            <p className="font-sans text-sm text-muted">Supports JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {/* ── Image Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-stone aspect-square rounded-card" />)}
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {/* Uploading Placeholder */}
            {uploadMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-square bg-stone rounded-card flex flex-col items-center justify-center border-2 border-stone"
              >
                <Loader2 className="animate-spin text-navy mb-2" size={24} />
                <span className="font-sans text-xs text-muted font-medium uppercase tracking-widest">Uploading</span>
              </motion.div>
            )}

            {/* Display Images */}
            {images.map(image => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square rounded-card overflow-hidden bg-stone"
              >
                <img
                  src={image.imageUrl}
                  alt="Portfolio item"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay & Delete Button */}
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-end p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMutation.mutate(image.id)
                    }}
                    disabled={deleteMutation.isPending}
                    className="bg-white/90 hover:bg-white text-rose p-2 rounded-full shadow-floating backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 bg-stone/50 rounded-card border border-stone">
          <ImageIcon className="mx-auto h-12 w-12 text-muted mb-3 opacity-50" />
          <h4 className="font-sans font-medium text-ink">No images yet</h4>
          <p className="font-sans text-sm text-muted mt-1">Start building your portfolio to showcase your work.</p>
        </div>
      )}
    </div>
  )
}
