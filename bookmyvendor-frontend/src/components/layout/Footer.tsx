import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy border-t border-white/10 pt-20 pb-10">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src="/logo.jpg" alt="BookMyVendor" className="h-10 object-contain rounded-md" />
            </Link>
            <p className="font-sans text-stone/70 text-sm leading-relaxed mb-6 pr-4">
              India's most trusted platform to discover and book verified event vendors. We turn your dream events into reality.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-terracotta hover:text-navy transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-terracotta hover:text-navy transition-colors">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-terracotta hover:text-navy transition-colors">
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white text-lg font-medium mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-stone/70">
              <li><Link to="/vendors" className="hover:text-terracotta transition-colors">Find Vendors</Link></li>
              <li><Link to="/how-it-works" className="hover:text-terracotta transition-colors">How it Works</Link></li>
              <li><Link to="/join-as-vendor" className="hover:text-terracotta transition-colors">For Vendors</Link></li>
              <li><Link to="/about" className="hover:text-terracotta transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-white text-lg font-medium mb-6">Top Categories</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-stone/70">
              <li><Link to="/categories/wedding-photographers" className="hover:text-terracotta transition-colors">Wedding Photographers</Link></li>
              <li><Link to="/categories/luxury-venues" className="hover:text-terracotta transition-colors">Luxury Venues</Link></li>
              <li><Link to="/categories/event-decorators" className="hover:text-terracotta transition-colors">Event Decorators</Link></li>
              <li><Link to="/categories/catering-services" className="hover:text-terracotta transition-colors">Catering Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white text-lg font-medium mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 font-sans text-sm text-stone/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-terracotta shrink-0 mt-0.5" />
                <span>123 Event Plaza, Gomti Nagar,<br />Lucknow, UP 226010</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-terracotta shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-terracotta shrink-0" />
                <span>hello@bookmyvendor.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-stone/50">
            &copy; {currentYear} BookMyVendor. All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-sans text-xs text-stone/50">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


