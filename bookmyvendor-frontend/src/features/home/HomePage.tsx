import { Search, MapPin, Star, ShieldCheck, HeartHandshake, ArrowRight, Camera, Utensils, Palette, Building2, MessageSquare } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ParallaxFloating } from '../../components/ui/parallax-floating'
import Balancer from 'react-wrap-balancer'
import heroImage from '../../assets/images/a_cinematic_wide_angle_landscape_photograph_of_a_luxury_indian_wedding_venue_at.png'

const TOP_VENDORS = [
  { id: 1, name: 'Sharma Photography', category: 'Photographer', rating: 4.9, reviews: 124, city: 'Delhi NCR', price: '₹45,000', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'The Royal Palace', category: 'Venue', rating: 4.8, reviews: 89, city: 'Lucknow', price: '₹2.5L/day', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Elegant Events Decor', category: 'Decorator', rating: 5.0, reviews: 56, city: 'Mumbai', price: '₹80,000', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Royal Caterers', category: 'Caterer', rating: 4.7, reviews: 210, city: 'Bangalore', price: '₹1,200/plate', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Glamour Makeovers', category: 'Makeup Artist', rating: 4.9, reviews: 78, city: 'Jaipur', price: '₹25,000', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' }
]

const TESTIMONIALS = [
  { id: 1, name: 'Ananya & Rahul', role: 'Married in Jaipur', content: '"We found the perfect palace venue and decor team within days. BookMyVendor saved us months of stress!"', rating: 5, image: 'https://images.unsplash.com/photo-1606216439075-812e9b0b4685?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Priya Sharma', role: 'Corporate Event Manager', content: '"The verified vendors and transparent pricing make this my go-to platform for organizing large corporate galas."', rating: 5, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Karan Singh', role: 'Brother of the Bride', content: '"Booked a premium caterer and photographer. Everything was seamless from chat to secure payment."', rating: 4, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
  { id: 4, name: 'Neha & Vikram', role: 'Married in Goa', content: '"I was worried about finding vendors in a different city, but the reviews and portfolios here are 100% authentic."', rating: 5, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { id: 5, name: 'Rohan Gupta', role: 'Event Planner', content: '"I recommend BookMyVendor to all my clients. It is simply the most reliable marketplace in India right now."', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
]

const CATEGORIES = [
  { id: 'PHOTOGRAPHER', label: 'Photographers', Icon: Camera, count: '120+ verified' },
  { id: 'VENUE', label: 'Venues & Banquets', Icon: Building2, count: '85+ verified' },
  { id: 'DECORATOR', label: 'Decorators', Icon: Palette, count: '90+ verified' },
  { id: 'CATERER', label: 'Caterers', Icon: Utensils, count: '110+ verified' },
]

const CITIES = ['Lucknow', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Jaipur', 'Hyderabad']

export default function HomePage() {
  const navigate = useNavigate()
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: true, dragFree: true })
  const [city, setCity] = useState('Lucknow')
  const [category, setCategory] = useState('PHOTOGRAPHER')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/vendors?category=${category}&city=${city}`)
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
            {/* Hero */}
      <section className="bg-ivory relative isolate w-full overflow-hidden pt-32 pb-16">
        <motion.div
          className="relative z-10 mx-auto grid max-w-container grid-cols-1 px-6 md:px-12 lg:px-20 lg:grid-cols-12 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
          }}
        >
          {/* Left Side: Tagline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.28 } }
            }}
            className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch pb-2 lg:pb-10"
          >
            <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-stone text-sm font-medium text-navy">
              <span className="w-2 h-2 rounded-full bg-sage inline-block" />
              India's Most Trusted Event Vendor Platform
            </span>
          </motion.div>

          {/* Right Side: Title, Desc, Search form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.28 } }
            }}
            className="flex flex-col items-start lg:col-span-7 lg:col-start-6 gap-6 sm:gap-8"
          >
            <h1 className="font-display text-5xl md:text-[62px] text-navy leading-[1.05] text-balance">
              <Balancer>
                Book the perfect vendors for your{' '}
                <span className="text-terracotta italic">dream event.</span>
              </Balancer>
            </h1>

            <p className="font-sans text-lg text-muted max-w-xl leading-relaxed">
              <Balancer>
                Discover and instantly book photographers, venues, caterers and more -
                all verified, all in one place.
              </Balancer>
            </p>

            <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-full shadow-floating border border-stone/60 p-3 md:p-2 mt-2">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-2">
                <div className="flex flex-1 items-center bg-ivory rounded-xl md:rounded-full px-5 py-3.5 gap-3">
                  <Search className="w-4 h-4 text-muted shrink-0" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-sans text-sm text-ink cursor-pointer">
                    <option value="PHOTOGRAPHER">Photographers</option>
                    <option value="VENUE">Venues & Banquets</option>
                    <option value="DECORATOR">Decorators</option>
                    <option value="CATERER">Caterers</option>
                    <option value="MAKEUP">Makeup Artists</option>
                  </select>
                </div>
                <div className="flex flex-1 items-center bg-ivory rounded-xl md:rounded-full px-5 py-3.5 gap-3 border-l md:border-stone">
                  <MapPin className="w-4 h-4 text-muted shrink-0" />
                  <select value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-sans text-sm text-ink cursor-pointer">
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-primary md:py-3 shrink-0 w-full md:w-auto">
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Media Element */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="w-full mt-16 max-w-container mx-auto px-6 md:px-12 lg:px-20"
        >
          <div className="relative w-full overflow-hidden rounded-cardLg shadow-elevated">
            <img
              src={heroImage}
              alt="Luxury wedding setup"
              decoding="async"
              className="aspect-[4/3] sm:aspect-[21/9] w-full object-cover object-center filter saturate-[0.85] contrast-[1.02]"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="max-w-container mx-auto px-6 md:px-12 lg:px-20 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-start gap-12 lg:gap-20 border-t border-stone pt-10">
            {[{ value: '500+', label: 'Verified Vendors' }, { value: '10k+', label: 'Happy Customers' }, { value: '4.8', label: 'Avg. Rating' }]
              .map(({ value, label }) => (
                <div key={label} className="text-left">
                  <p className="font-display text-4xl text-navy mb-1">{value}</p>
                  <p className="font-sans text-sm text-muted">{label}</p>
                </div>
              ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-2">Browse by Type</p>
              <h2 className="font-display text-h2 text-navy">Popular Categories</h2>
            </div>
            <Link to="/vendors" className="hidden md:inline-flex items-center gap-2 font-sans font-medium text-sm text-navy hover:text-terracotta transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(({ id, label, Icon, count }) => (
              <Link key={id} to={`/vendors?category=${id}`}
                className="group bg-white p-7 rounded-card border border-stone shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-ivory rounded-2xl flex items-center justify-center mb-6 group-hover:bg-stone transition-colors">
                  <Icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="font-display text-xl text-navy mb-1">{label}</h3>
                <p className="font-sans text-sm text-muted">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-t border-stone relative overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="text-center mb-16">
            <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="font-display text-4xl md:text-5xl text-navy">How it works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-12 relative">
            
            {/* Dashed Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] border-t-2 border-dashed border-stone -z-10"></div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone/60 transition-transform hover:scale-110 duration-300">
                <Search className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">1. Discover Vendors</h3>
              <p className="font-sans text-muted leading-relaxed max-w-sm mx-auto">Browse through thousands of verified vendors, read authentic reviews, and compare their portfolios.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone/60 transition-transform hover:scale-110 duration-300">
                <MessageSquare className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">2. Chat & Customize</h3>
              <p className="font-sans text-muted leading-relaxed max-w-sm mx-auto">Contact vendors directly through our platform, discuss your requirements, and get custom quotes.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone/60 transition-transform hover:scale-110 duration-300">
                <ShieldCheck className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3">3. Book Securely</h3>
              <p className="font-sans text-muted leading-relaxed max-w-sm mx-auto">Finalize your booking with secure payments and our comprehensive event guarantee.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Inspiration Parallax Section */}
      <section className="border-t border-stone pt-8">
        <ParallaxFloating />
      </section>

      {/* Top Vendors Spotlight */}
      <section className="py-24 bg-ivory border-t border-stone overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-3">Spotlight</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy">Top Rated Vendors</h2>
            </div>
            <Link to="/vendors" className="hidden md:inline-flex items-center gap-2 font-sans font-medium text-navy hover:text-terracotta transition-colors">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex gap-6">
              {TOP_VENDORS.map(vendor => (
                <div key={vendor.id} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 relative">
                  <Link to={`/vendors/${vendor.id}`} className="group block bg-white rounded-[24px] overflow-hidden border border-stone shadow-sm hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-60 overflow-hidden">
                      <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 font-sans text-xs font-bold text-navy shadow-sm">
                        <Star className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                        {vendor.rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-sans text-xs text-terracotta font-medium tracking-wider uppercase mb-2">{vendor.category}</p>
                      <h3 className="font-display text-xl text-navy mb-2 line-clamp-1">{vendor.name}</h3>
                      <div className="flex items-center gap-4 text-stone/80 text-sm font-sans mb-4">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-muted" /> <span className="text-muted">{vendor.city}</span></div>
                        <div className="w-1 h-1 rounded-full bg-stone/50"></div>
                        <span className="text-muted">{vendor.reviews} Reviews</span>
                      </div>
                      <div className="pt-4 border-t border-stone flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted font-sans mb-0.5">Starting at</p>
                          <p className="font-sans font-medium text-navy">{vendor.price}</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-stone overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 text-center mb-16">
          <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-3">Real Stories</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy">Loved by thousands</h2>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <motion.div
            className="flex shrink-0 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            <div className="flex gap-6 pr-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="w-[320px] md:w-[420px] bg-ivory rounded-[24px] p-8 border border-stone/50 shadow-sm transition-colors hover:border-terracotta/30">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-terracotta fill-terracotta" />)}
                  </div>
                  <p className="font-display text-lg text-navy mb-8 leading-relaxed">{t.content}</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="font-sans font-bold text-navy text-sm">{t.name}</h4>
                      <p className="font-sans text-xs text-muted mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-6 pr-6" aria-hidden="true">
              {TESTIMONIALS.map((t) => (
                <div key={t.id + '-dup'} className="w-[320px] md:w-[420px] bg-ivory rounded-[24px] p-8 border border-stone/50 shadow-sm transition-colors hover:border-terracotta/30">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-terracotta fill-terracotta" />)}
                  </div>
                  <p className="font-display text-lg text-navy mb-8 leading-relaxed">{t.content}</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="font-sans font-bold text-navy text-sm">{t.name}</h4>
                      <p className="font-sans text-xs text-muted mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-28 bg-navy rounded-t-[56px] mt-8">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-20">
            <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-3">Our Promise</p>
            <h2 className="font-display text-h2 text-white mb-4">Why BookMyVendor?</h2>
            <p className="font-sans text-stone/70 max-w-xl mx-auto">
              We take the stress out of event planning by connecting you with India's most reliable professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { Icon: ShieldCheck, title: 'Verified Vendors', body: 'Every vendor goes through a strict background and portfolio check before they appear on our platform.' },
              { Icon: Star, title: 'Authentic Reviews', body: 'Read honest, unedited experiences from real customers who have worked with these professionals.' },
              { Icon: HeartHandshake, title: 'Secure Bookings', body: 'Your payments are protected. Chat directly, agree on terms, and finalize bookings all in one place.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-terracotta" />
                </div>
                <h3 className="font-display text-2xl text-white mb-3">{title}</h3>
                <p className="font-sans text-stone/70 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="font-display text-h2 text-white mb-4">Ready to plan your event?</h2>
          <p className="font-sans text-stone/70 mb-10 max-w-lg mx-auto">
            Join thousands of happy customers who found their perfect vendor on BookMyVendor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-10 py-4">Get Started Free</Link>
            <Link to="/vendors" className="inline-flex items-center justify-center px-10 py-4 rounded-full border border-white/30 font-sans font-semibold text-sm text-white tracking-widest uppercase hover:bg-white/10 transition-colors">
              Browse Vendors
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}








