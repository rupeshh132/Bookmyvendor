/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Design System Colors ───────────────────────────────────────
      colors: {
        ivory:      '#F6F3EF',   // Page background
        navy:       '#16232E',   // Primary dark, buttons, headings
        stone:      '#EDEAE5',   // Card surfaces, secondary sections
        terracotta: '#D9A98C',   // Accent (use sparingly, max 2 sections/page)
        ink:        '#1A1A1A',   // Text primary
        muted:      '#6B6560',   // Text muted, captions
        sage:       '#4A7C59',   // Success, verified badge
        amber:      '#C4882A',   // Warning, pending
        rose:       '#B05252',   // Error, cancellation
      },

      // ─── Typography ─────────────────────────────────────────────────
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],  // Headings only
        sans:    ['General Sans', 'sans-serif'],   // Body, UI, buttons
      },

      // ─── Font Sizes ─────────────────────────────────────────────────
      fontSize: {
        'hero':    ['68px', { lineHeight: '1.05', fontWeight: '600' }],
        'h2':      ['40px', { lineHeight: '1.1',  fontWeight: '500' }],
        'h3':      ['26px', { lineHeight: '1.15', fontWeight: '500' }],
        'label':   ['11px', { lineHeight: '1.0',  letterSpacing: '0.05em' }],
      },

      // ─── Border Radius ──────────────────────────────────────────────
      borderRadius: {
        'card':    '28px',   // Standard cards
        'cardLg':  '32px',   // Large/hero cards
        'input':   '12px',   // Form inputs
      },

      // ─── Shadows (soft, editorial — never harsh) ────────────────────
      boxShadow: {
        'card':     '0 2px 12px rgba(22, 35, 46, 0.06)',
        'cardHover':'0 8px 32px rgba(22, 35, 46, 0.12)',
        'floating': '0 4px 24px rgba(22, 35, 46, 0.10)',
        'elevated': '0 12px 40px rgba(22, 35, 46, 0.14)',
      },

      // ─── Spacing Additions ──────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ─── Container ──────────────────────────────────────────────────
      maxWidth: {
        'container': '1280px',
      },

      // ─── Animations ─────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },

      // ─── Transition Timing ──────────────────────────────────────────
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
