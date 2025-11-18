import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Subtle grain overlay
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
      style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)' }}
    />
  )
}

// Simple drifting ember particles
function Embers() {
  const particles = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    left: 10 + i * 18 + (i % 2 ? 5 : 0),
    size: 6 + (i % 3) * 2,
    delay: i * 0.8,
  }))
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, bottom: '8%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -140, opacity: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          <div
            className="w-2 h-2"
            style={{
              width: p.size,
              height: p.size,
              background: 'radial-gradient(circle, rgba(196,30,58,0.9), rgba(196,30,58,0) 70%)',
              filter: 'blur(0.5px) drop-shadow(0 0 10px rgba(196,30,58,0.5))',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function SkullMini({ x, y, scale = 0.18, opacity = 0.5 }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${scale})`, opacity }}>
      <SkullIllustration />
    </div>
  )
}

export default function LandingHero({ onDone }) {
  // Phases: typing -> rest -> awaitScroll -> splitting -> done
  const fullText = 'Ready to indulge in sin?'
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing')
  const [showCursor, setShowCursor] = useState(true)
  const [startedSplit, setStartedSplit] = useState(false)
  const controls = useAnimation()
  const heroRef = useRef(null)

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 600)
    return () => clearInterval(t)
  }, [])

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing') return
    let i = 0
    let timer
    const step = () => {
      setText(fullText.slice(0, i + 1))
      i += 1
      if (i < fullText.length) {
        timer = setTimeout(step, 55)
      } else {
        setPhase('rest')
      }
    }
    timer = setTimeout(step, 650)
    return () => clearTimeout(timer)
  }, [phase])

  // After short rest, show monogram and wait for scroll
  useEffect(() => {
    if (phase !== 'rest') return
    const t = setTimeout(() => setPhase('awaitScroll'), 1200)
    return () => clearTimeout(t)
  }, [phase])

  // Listen for first scroll/gesture to trigger split
  useEffect(() => {
    if (phase !== 'awaitScroll') return
    const onWheel = () => beginSplit()
    const onKey = (e) => { if (['ArrowDown', 'PageDown', ' '].includes(e.key)) beginSplit() }
    const el = heroRef.current || window
    el.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase])

  const beginSplit = () => {
    if (startedSplit) return
    setStartedSplit(true)
    setPhase('splitting')
    // Run split animation then finish
    setTimeout(() => {
      setPhase('done')
      onDone && onDone()
    }, 1400)
  }

  return (
    <section ref={heroRef} className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <Grain />
      <Embers />

      {/* Opening typewriter */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <AnimatePresence>
          {(phase === 'typing' || phase === 'rest') && (
            <motion.div
              key="type"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="text-center"
            >
              <h1
                className="text-[40px] md:text-[72px] font-[Lora] leading-tight"
                style={{ textShadow: '0 0 24px rgba(196,30,58,0.25), 0 0 6px rgba(196,30,58,0.15)' }}
              >
                {text}
                <span className="inline-block w-[0.6ch]">{showCursor ? '_' : ' '}</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resting state: Monogram + tagline */}
      <AnimatePresence>
        {(phase === 'awaitScroll' || phase === 'splitting') && (
          <motion.div
            key="mono"
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Split layers */}
            <div className="relative w-full max-w-[1200px] mx-auto px-6">
              <SplitMonogram splitting={phase === 'splitting'} />
              <motion.p
                className="mt-6 text-center text-zinc-300/90 italic"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Niche fragrance house for those who prefer the dark.
              </motion.p>
            </div>

            {/* Behind reveal: seven skulls constellation appears as split begins */}
            <div className="pointer-events-none absolute inset-0">
              {phase === 'splitting' && (
                <SkullField />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll prompt */}
      {phase !== 'splitting' && phase !== 'done' && (
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 text-zinc-400">
          <motion.div
            onClick={beginSplit}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <ChevronDown className="w-6 h-6" />
            <span className="text-sm tracking-widest uppercase">Descend</span>
          </motion.div>
        </div>
      )}
    </section>
  )
}

function SplitMonogram({ splitting }) {
  const common = {
    initial: { x: 0 },
    animate: splitting ? undefined : { x: 0 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    className: 'absolute inset-0 flex items-center justify-center select-none',
  }

  return (
    <div className="relative h-[40vh] min-h-[260px]">
      {/* Left half */}
      <motion.div
        {...common}
        animate={splitting ? { x: '-16%', filter: 'drop-shadow(0 0 30px rgba(196,30,58,0.35))' } : { x: 0 }}
        style={{ clipPath: 'inset(0 50% 0 0)' }}
      >
        <Monogram />
      </motion.div>
      {/* Right half */}
      <motion.div
        {...common}
        animate={splitting ? { x: '16%', filter: 'drop-shadow(0 0 30px rgba(196,30,58,0.35))' } : { x: 0 }}
        style={{ clipPath: 'inset(0 0 0 50%)' }}
      >
        <Monogram />
      </motion.div>
      {/* Center bleed line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={splitting ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 top-0 bottom-0 w-[2px]"
        style={{ background: 'linear-gradient(to bottom, rgba(196,30,58,0.0), rgba(196,30,58,0.45), rgba(196,30,58,0.0))', filter: 'blur(1px)' }}
      />
    </div>
  )
}

function Monogram() {
  return (
    <div className="text-center">
      <div
        className="font-[Cinzel] tracking-[0.18em]"
        style={{
          fontSize: 'clamp(120px, 18vw, 180px)',
          lineHeight: 1,
          color: '#fff',
          textShadow: '0 1px 0 rgba(255,255,255,0.02), 0 0 40px rgba(139,0,0,0.25), 0 0 8px rgba(139,0,0,0.2)',
          WebkitTextStroke: '0.5px rgba(0,0,0,0.35)',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
        }}
      >
        ELANOR
      </div>
    </div>
  )
}

function SkullField() {
  // Place 7 skulls in a loose heptagram constellation
  const nodes = [
    { x: 50, y: 26, s: 0.18, o: 0.55 },
    { x: 22, y: 36, s: 0.16, o: 0.45 },
    { x: 78, y: 38, s: 0.16, o: 0.45 },
    { x: 30, y: 62, s: 0.17, o: 0.5 },
    { x: 70, y: 62, s: 0.17, o: 0.5 },
    { x: 42, y: 78, s: 0.15, o: 0.4 },
    { x: 58, y: 80, s: 0.15, o: 0.4 },
  ]
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {nodes.map((n, i) => (
        <SkullMini key={i} x={n.x} y={n.y} scale={n.s} opacity={n.o} />
      ))}
      {/* Soft halo */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(196,30,58,0.12), transparent 60%)' }} />
    </motion.div>
  )
}

function SkullIllustration() {
  return (
    <svg width="560" height="560" viewBox="0 0 560 560" className="w-[560px] h-[560px]">
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
