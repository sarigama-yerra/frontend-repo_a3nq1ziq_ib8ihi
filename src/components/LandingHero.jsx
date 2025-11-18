import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Simple grain overlay using CSS background image
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
      style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)' }}
    />
  )
}

function normalizeImageUrl(url) {
  if (!url) return url
  try {
    const u = new URL(url)
    // Google Drive viewer/share links → force direct download stream (works for images)
    if (u.hostname.includes('drive.google.com')) {
      // Patterns: /file/d/<id>/view?..., or ...uc?export=view&id=<id>
      let id = u.searchParams.get('id')
      if (!id) {
        const parts = u.pathname.split('/')
        const idx = parts.indexOf('d')
        if (idx !== -1 && parts[idx + 1]) id = parts[idx + 1]
      }
      if (id) {
        return `https://drive.google.com/uc?export=download&id=${id}`
      }
    }
    // Dropbox share → force raw
    if (u.hostname.includes('dropbox.com')) {
      u.searchParams.set('raw', '1')
      u.searchParams.set('dl', '1')
      return u.toString()
    }
  } catch (_) {}
  return url
}

export default function LandingHero({ onDone, heroImageUrl }) {
  const fullText = 'Ready to indulge in sin?'
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing') // typing | pause | reveal | done
  const [showCursor, setShowCursor] = useState(true)
  const controls = useAnimation()

  // Optional override via env var
  const envHero = import.meta.env.VITE_HERO_IMAGE_URL
  const heroSrcRaw = heroImageUrl || envHero || null
  const heroSrc = normalizeImageUrl(heroSrcRaw)

  // Blink cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 600)
    return () => clearInterval(t)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return
    let i = 0
    const step = () => {
      setText(fullText.slice(0, i + 1))
      i += 1
      if (i < fullText.length) {
        timer = setTimeout(step, 55)
      } else {
        setPhase('pause')
      }
    }
    let timer = setTimeout(step, 650)
    return () => clearTimeout(timer)
  }, [phase])

  // Pause then reveal
  useEffect(() => {
    if (phase !== 'pause') return
    const t = setTimeout(() => setPhase('reveal'), 2000)
    return () => clearTimeout(t)
  }, [phase])

  // Trigger ink reveal animation
  useEffect(() => {
    if (phase !== 'reveal') return
    controls.start('open').then(() => {
      setPhase('done')
      onDone && onDone()
    })
  }, [phase, controls, onDone])

  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <Grain />

      {/* Center typing line */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <AnimatePresence>
          {phase !== 'reveal' && phase !== 'done' && (
            <motion.div
              key="type"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="text-center"
            >
              <h1
                className="text-[40px] md:text-[72px] font-[Cinzel] leading-tight"
                style={{ textShadow: '0 0 30px rgba(196,30,58,0.25), 0 0 8px rgba(196,30,58,0.2)' }}
              >
                {text}
                <span className="inline-block w-[0.6ch]">{showCursor ? '_' : ' '}</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ink reveal visual - masked by animated radial */}
      <motion.div
        initial="closed"
        animate={controls}
        variants={{
          closed: { clipPath: 'circle(0% at 50% 50%)' },
          open: {
            clipPath: 'circle(150% at 50% 50%)',
            transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)' }}
      >
        <div className="absolute inset-0 grid place-items-center">
          {heroSrc ? <HeroImageWithFallback src={heroSrc} /> : <SkullIllustration />}
        </div>
      </motion.div>

      {/* Parallax scroll prompt */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 text-zinc-400">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-2"
        >
          <ChevronDown className="w-6 h-6" />
          <span className="text-sm tracking-widest uppercase">Descend into temptation</span>
        </motion.div>
      </div>
    </section>
  )
}

function HeroImageWithFallback({ src }) {
  const [errored, setErrored] = useState(false)

  if (errored) return <SkullIllustration />

  // Supports SVG/PNG/WebP. SVG remains crisp; raster scales responsively.
  return (
    <img
      src={src}
      alt="ELANOR mark"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      className="max-w-[70vw] w-[560px] md:w-[640px] h-auto select-none drop-shadow-[0_0_50px_rgba(139,0,0,0.35)]"
      style={{ filter: 'saturate(0.9) contrast(1.02)' }}
      onError={() => setErrored(true)}
    />
  )
}

function SkullIllustration() {
  return (
    <svg width="560" height="560" viewBox="0 0 560 560" className="w-[70vw] max-w-[640px] drop-shadow-[0_0_50px_rgba(139,0,0,0.35)]">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bbbbbb" />
        </linearGradient>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#444" strokeWidth="1" />
        </pattern>
      </defs>
      <g fill="none" stroke="url(#g)" strokeWidth="2">
        <path d="M280 60c-98 0-180 79-180 176 0 66 33 109 74 135 8 5 16 15 18 24l8 35c2 9 10 16 20 16h120c10 0 18-7 20-16l8-35c2-9 10-19 18-24 41-26 74-69 74-135 0-97-82-176-180-176z" />
        <path d="M190 260c0 28 20 44 46 44s46-16 46-44c0-13-46-24-46-24s-46 11-46 24z" />
        <path d="M278 236s-46 11-46 24c0 28 20 44 46 44" />
        <path d="M370 260c0 28-20 44-46 44s-46-16-46-44c0-13 46-24 46-24s46 11 46 24z" />
        <circle cx="220" cy="240" r="32" />
        <circle cx="340" cy="240" r="32" />
        <path d="M220 240c0 10-6 14-16 14M340 240c0 10 6 14 16 14" />
        <path d="M206 340c22 18 52 28 74 28s52-10 74-28" />
      </g>
      <g fill="url(#hatch)" opacity="0.22">
        <ellipse cx="280" cy="130" rx="110" ry="70" />
        <rect x="160" y="200" width="240" height="140" rx="40" />
      </g>
    </svg>
  )
}
