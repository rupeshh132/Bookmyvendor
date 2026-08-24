import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ImageProps {
  src: string
  alt: string
  className: string
  depth: number
}

const images: ImageProps[] = [
  {
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop', // Event Lighting
    alt: 'Event Lighting',
    className: 'w-40 h-56 md:w-56 md:h-72 top-[5%] md:top-[10%] left-[2%] md:left-[8%] object-cover rounded-[24px] shadow-floating',
    depth: 0.05,
  },
  {
    src: 'https://images.unsplash.com/photo-1595954625574-88981e7d2358?q=80&w=800&auto=format&fit=crop', // Real Portrait / Makeup
    alt: 'Bridal Makeup',
    className: 'w-48 h-64 md:w-64 md:h-[340px] top-[15%] md:top-[20%] right-[5%] md:right-[10%] object-cover rounded-[32px] shadow-floating',
    depth: 0.08,
  },
  {
    src: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop', // Catering
    alt: 'Catering',
    className: 'hidden md:block w-40 h-40 bottom-[15%] left-[20%] object-cover rounded-full shadow-floating',
    depth: 0.04,
  },
  {
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop', // Decor / Venue
    alt: 'Wedding Decor',
    className: 'w-56 h-40 md:w-72 md:h-56 bottom-[5%] md:bottom-[10%] right-[15%] md:right-[25%] object-cover rounded-[24px] shadow-floating',
    depth: 0.06,
  },
  {
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop', // Celebration
    alt: 'Celebration Lights',
    className: 'hidden lg:block w-48 h-48 top-[8%] right-[35%] object-cover rounded-full shadow-floating',
    depth: 0.03,
  }
]

export function ParallaxFloating() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 60, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    
    // Normalize coordinates between -1 and 1
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden bg-ivory"
    >
      {/* Center Text */}
      <div className="relative z-20 text-center px-6 pointer-events-none bg-ivory/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 rounded-3xl">
        <p className="font-sans text-label text-terracotta tracking-widest uppercase mb-3 drop-shadow-sm">
          Get Inspired
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-navy max-w-3xl mx-auto leading-[1.1] drop-shadow-sm">
          Turn your vision into <span className="italic text-terracotta">reality.</span>
        </h2>
        <p className="font-sans text-muted mt-6 max-w-xl mx-auto text-sm md:text-base">
          Browse through breathtaking moments crafted by our top-rated photographers, decorators, and venues.
        </p>
      </div>

      {/* Floating Images */}
      {images.map((img, i) => (
        <ParallaxImage key={i} img={img} smoothX={smoothX} smoothY={smoothY} />
      ))}
    </div>
  )
}

function ParallaxImage({ img, smoothX, smoothY }: { img: ImageProps, smoothX: any, smoothY: any }) {
  // Move in opposite direction of mouse
  const x = useTransform(smoothX, [-1, 1], [img.depth * -1500, img.depth * 1500])
  const y = useTransform(smoothY, [-1, 1], [img.depth * -1500, img.depth * 1500])

  return (
    <motion.img
      src={img.src}
      alt={img.alt}
      style={{ x, y }}
      className={cn("absolute z-10", img.className)}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    />
  )
}
