import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/layout/Navbar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<div className="bmv-container bmv-section"><h1 className="font-display text-hero text-navy">BookMyVendor</h1><p className="font-sans text-muted mt-4">Sprint 0 — Scaffold complete ✅</p></div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
