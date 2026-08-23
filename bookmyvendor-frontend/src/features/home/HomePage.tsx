import { Search, MapPin, Star, ShieldCheck, HeartHandshake, ArrowRight, Camera, Utensils, Palette, Building2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CATEGORIES = [
  { id: 'PHOTOGRAPHER', label: 'Photographers', Icon: Camera, count: '120+ verified' },
  { id: 'VENUE', label: 'Venues & Banquets', Icon: Building2, count: '85+ verified' },
  { id: 'DECORATOR', label: 'Decorators', Icon: Palette, count: '90+ verified' },
  { id: 'CATERER', label: 'Caterers', Icon: Utensils, count: '110+ verified' },
]

const CITIES = ['Lucknow', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Jaipur', 'Hyderabad']

export default function HomePage() {
  const navigate = useNavigate()
  const [city, setCity] = useState('Lucknow')
  const [category, setCategory] = useState('PHOTOGRAPHER')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/vendors?category=${category}&city=${city}`)
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="relative pt-28 pb-36 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone to-ivory" />
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 text-center">

          <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-stone text-sm font-medium text-navy mb-8">
            <span className="w-2 h-2 rounded-full bg-sage inline-block" />
            India's Most Trusted Event Vendor Platform
          </span>

          <h1 className="font-display text-5xl md:text-hero text-navy leading-[1.08] max-w-4xl mx-auto mb-6">
            Book the perfect vendors for your{' '}
            <span className="text-terracotta italic">dream event.</span>
          </h1>

          <p className="font-sans text-lg text-muted max-w-2xl mx-auto mb-14">
            Discover and instantly book photographers, venues, caterers and more —
            all verified, all in one place.
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-floating border border-stone/60 p-3 md:p-2">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-2">
              <div className="flex flex-1 items-center bg-ivory rounded-xl md:rounded-full px-5 py-3.5 gap-3">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-sans text-sm text-ink cursor-pointer">
                  <option value="PHOTOGRAPHER">Photographers</option>
                  <option value="VENUE">Venues and Banquets</option>
                  <option value="DECORATOR">Decorators</option>
                  <option value="CATERER">Caterers</option>
                  <option value="MAKEUP">Makeup Artists</option>
                </select>
              </div>
              <div className="flex flex-1 items-center bg-ivory rounded-xl md:rounded-full px-5 py-3.5 gap-3">
                <MapPin className="w-4 h-4 text-muted shrink-0" />
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-sans text-sm text-ink cursor-pointer">
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary md:py-3 shrink-0 w-full md:w-auto">
                Search Vendors
              </button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[{ value: '500+', label: 'Verified Vendors' }, { value: '10k+', label: 'Happy Customers' }, { value: '4.8', label: 'Avg. Rating' }]
              .map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-4xl text-navy mb-1">{value}</p>
                  <p className="font-sans text-sm text-muted">{label}</p>
                </div>
              ))}
          </div>
        </div>
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