import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Star, Shield } from 'lucide-react'

const CATEGORY_DATA: Record<string, any> = {
  'wedding-photographers': {
    title: 'Wedding Photographers',
    tagline: 'Capture your perfect moments forever.',
    description: 'Discover India’s most talented wedding photographers. Whether you want candid, traditional, cinematic, or pre-wedding shoots, our verified professionals will tell your unique love story through their lens.',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1200&auto=format&fit=crop',
    searchQuery: 'PHOTOGRAPHER',
    features: ['Candid Photography', 'Cinematic Videography', 'Pre-wedding Shoots', 'Drone Coverage'],
    stats: { vendors: '120+', rating: '4.8', bookings: '1500+' }
  },
  'luxury-venues': {
    title: 'Luxury Venues & Banquets',
    tagline: 'The perfect stage for your grand celebration.',
    description: 'From royal palaces to modern 5-star banquets and scenic outdoor lawns, find the venue that matches your vision. We ensure transparent pricing and exclusive deals for your big day.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    searchQuery: 'VENUE',
    features: ['5-Star Banquets', 'Heritage Palaces', 'Outdoor Lawns', 'Resorts'],
    stats: { vendors: '85+', rating: '4.9', bookings: '800+' }
  },
  'event-decorators': {
    title: 'Event Decorators',
    tagline: 'Transforming spaces into magical experiences.',
    description: 'Bring your dream Pinterest board to life. Our expert decorators specialize in floral arrangements, grand mandaps, thematic lighting, and modern aesthetic setups that will leave your guests in awe.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
    searchQuery: 'DECORATOR',
    features: ['Floral Mandaps', 'Thematic Lighting', 'Haldi/Mehendi Setups', 'Stage Decor'],
    stats: { vendors: '90+', rating: '4.7', bookings: '1200+' }
  },
  'catering-services': {
    title: 'Premium Catering Services',
    tagline: 'Delight your guests with an unforgettable feast.',
    description: 'Food is the soul of any Indian event. Connect with premium caterers offering diverse cuisines, live counters, and impeccable hospitality to give your guests a royal dining experience.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    searchQuery: 'CATERER',
    features: ['Multi-cuisine Menus', 'Live Counters', 'Dessert Bars', 'Premium Plating'],
    stats: { vendors: '110+', rating: '4.8', bookings: '2000+' }
  }
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? CATEGORY_DATA[slug] : null

  if (!data) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-4xl text-navy mb-4">Category Not Found</h1>
        <p className="font-sans text-muted mb-8">The category you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-sans text-terracotta font-medium tracking-widest uppercase mb-4"
          >
            Verified {data.title}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            {data.tagline}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link to={`/vendors?category=${data.searchQuery}`} className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2">
              Browse {data.title} <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 px-6 bg-white border-b border-stone">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="font-display text-4xl text-navy mb-6">Why book {data.title.toLowerCase()} with us?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center shrink-0 border border-stone">
                    <Shield className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-navy text-lg mb-1">100% Verified Profiles</h4>
                    <p className="font-sans text-muted">Every vendor goes through a strict quality and background check before listing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center shrink-0 border border-stone">
                    <Star className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-navy text-lg mb-1">Authentic Reviews</h4>
                    <p className="font-sans text-muted">Read reviews only from customers who have actually booked and completed an event.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ivory p-8 rounded-card border border-stone shadow-sm">
              <h3 className="font-display text-2xl text-navy mb-6">Popular Services</h3>
              <ul className="space-y-4">
                {data.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 font-sans text-navy">
                    <CheckCircle2 className="w-5 h-5 text-terracotta" /> {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-stone flex justify-between text-center">
                <div>
                  <p className="font-display text-2xl text-navy">{data.stats.vendors}</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider">Vendors</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-navy">{data.stats.rating}/5</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider">Avg Rating</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-navy">{data.stats.bookings}</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider">Bookings</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}



