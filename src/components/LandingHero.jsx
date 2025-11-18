import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Shared overlays
function Grain({ opacity = 0.08 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{ opacity, backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)' }}
    />
  )
}

// Slow rotating light rays from above
function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120%] h-[120%]"
        style={{ background: 'conic-gradient(from 200deg, rgba(220,20,60,0.12), transparent 40%)', filter: 'blur(12px)' }}
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1/4 right-[-10%] w-[80%] h-[80%]"
        style={{ background: 'conic-gradient(from 340deg, rgba(124,0,31,0.10), transparent 45%)', filter: 'blur(14px)' }}
        animate={{ rotate: [0, -12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// Gold embers drifting upward
function Embers({ count = 14, intensity = 1.0 }) {
  const particles = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: 4 + Math.random() * 92,
    size: 1.2 + Math.random() * 2.8,
    delay: Math.random() * 2.2,
    dur: 6.5 + Math.random() * 3.5,
  })), [count])
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, bottom: '-2%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -180 * intensity, opacity: [0, 0.95, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          <div
            style={{
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'rgba(232,197,71,0.95)',
              filter: 'blur(0.6px) drop-shadow(0 0 10px rgba(232,197,71,0.45))',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Red sparks flicker mid-field
function RedSparks({ count = 12 }) {
  const sparks = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 20 + Math.random() * 60,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 1.8,
    dur: 1 + Math.random() * 1.2,
  })), [count])
  return (
    <div className="pointer-events-none absolute inset-0">
      {sparks.map(s => (
        <motion.div key={s.id} className="absolute" style={{ left: `${s.left}%`, top: `${s.top}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
        >
          <div style={{ width: s.size, height: s.size, borderRadius: '50%', background: 'rgba(220,20,60,0.95)', filter: 'drop-shadow(0 0 8px rgba(220,20,60,0.6))' }} />
        </motion.div>
      ))}
    </div>
  )
}

function Smoke({ opacity = 0.25, bottom = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute ${bottom ? 'bottom-0' : 'top-1/4'} -inset-x-1/2 h-1/2`}
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.2), transparent 70%)', filter: 'blur(30px)' }}
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute ${bottom ? 'bottom-1/4' : 'bottom-1/4'} -inset-x-1/2 h-1/2`}
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.15), transparent 70%)', filter: 'blur(35px)' }}
        animate={{ x: ['10%', '-10%', '10%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0" style={{ opacity }} />
    </div>
  )
}

function ScrollPrompt({ label = 'Descend', onClick }) {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 text-zinc-300">
      <motion.div
        onClick={onClick}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <ChevronDown className="w-6 h-6" />
        <span className="text-sm tracking-widest uppercase font-semibold">{label}</span>
      </motion.div>
    </div>
  )
}

// Typewriter Intro Page
function TypewriterIntro({ text, onRevealPrompt }) {
  const [showCursor, setShowCursor] = useState(false)
  const [shownCount, setShownCount] = useState(0)
  const [promptReady, setPromptReady] = useState(false)

  useEffect(() => {
    const c1 = setTimeout(() => setShowCursor(true), 500)

    let timer
    const c2 = setTimeout(() => {
      const step = () => {
        setShownCount(n => {
          if (n < text.length) return n + 1
          return n
        })
        const next = 80 + Math.floor(Math.random() * 20)
        timer = setTimeout(step, next)
      }
      step()
    }, 1000)

    return () => { clearTimeout(c1); clearTimeout(c2); if (timer) clearTimeout(timer) }
  }, [text])

  useEffect(() => {
    if (shownCount === text.length && !promptReady) {
      const t = setTimeout(() => {
        setPromptReady(true)
        onRevealPrompt && onRevealPrompt()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [shownCount, text.length, onRevealPrompt, promptReady])

  const letters = text.split('')
  return (
    <div className="relative text-center">
      <div className="font-[Cinzel] font-semibold leading-tight" style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < shownCount ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'inline-block',
              letterSpacing: '0.02em',
              color: '#FFF',
              textShadow: i < shownCount ? `0 0 ${8 + i * 0.25}px rgba(196,30,58,${0.35 + Math.min(0.45, i / letters.length)})` : 'none',
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
        {/* Cursor */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: showCursor ? [1, 0, 1] : 0 }}
          transition={{ duration: 0.9, repeat: Infinity }}
          className="inline-block"
          style={{ width: '0.6ch', marginLeft: 2 }}
        >
          |
        </motion.span>
      </div>
    </div>
  )
}

export default function LandingHero({ onDone }) {
  const heroRef = useRef(null)
  const s1Ref = useRef(null) // new intro page
  const s4Ref = useRef(null)
  const s5Ref = useRef(null)
  const s6Ref = useRef(null)

  const [allowBleed, setAllowBleed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    const arm = setTimeout(() => setAllowBleed(true), 2500)
    return () => { clearTimeout(arm) }
  }, [])

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Wheel step navigation (Intro + Screens 4-6)
  const [isNavigating, setIsNavigating] = useState(false)
  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const refs = [s1Ref, s4Ref, s5Ref, s6Ref]
    const getCurrentIndex = () => {
      const mid = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2
      let best = 0
      let bestDist = Infinity
      refs.forEach((r, i) => {
        const rect = r.current?.getBoundingClientRect()
        if (!rect) return
        const dist = Math.abs((rect.top + rect.height / 2) - mid)
        if (dist < bestDist) { bestDist = dist; best = i }
      })
      return best
    }

    const onWheel = (e) => {
      const heroRect = node.getBoundingClientRect()
      const heroOnScreen = heroRect.bottom > 0 && heroRect.top < (typeof window !== 'undefined' ? window.innerHeight : 800)
      if (!heroOnScreen) return

      if (isNavigating) { e.preventDefault(); return }
      const delta = e.deltaY
      if (Math.abs(delta) < 8) return
      e.preventDefault()

      const idx = getCurrentIndex()
      const nextIdx = delta > 0 ? Math.min(idx + 1, refs.length - 1) : Math.max(idx - 1, 0)
      if (nextIdx !== idx) {
        setIsNavigating(true)
        refs[nextIdx].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => setIsNavigating(false), 900)
      }
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [isNavigating])

  // Final wipe to constellation
  const [wiping, setWiping] = useState(false)
  const handleFinalSplit = () => {
    if (wiping) return
    setWiping(true)
    setTimeout(() => {
      const target = document.getElementById('constellation')
      onDone && onDone()
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1200)
  }

  const handleBrowseSins = () => {
    const target = document.getElementById('constellation')
    onDone && onDone()
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const s6InView = useInView(s6Ref, { amount: 0.6 })

  return (
    <div ref={heroRef} className="relative w-full text-white bg-black">
      {/* Top-right action */}
      <div className="pointer-events-auto absolute top-5 right-6 z-[60]">
        <button
          onClick={handleBrowseSins}
          className="uppercase tracking-widest text-sm px-4 py-2 border border-zinc-700/80 rounded-md bg-black/40 backdrop-blur-sm hover:bg-[#C41E3A]/10 hover:border-[#C41E3A] transition-colors font-semibold"
        >
          Choose Your Guilty Pleasure
        </button>
      </div>

      {/* New Intro Page: Living void + auto typewriter */}
      <section ref={s1Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Living void background */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 60% at 50% 40%, #18070C 0%, #0C0406 55%, #000 100%)' }}
          animate={{ filter: ['brightness(0.95)', 'brightness(1.0)', 'brightness(0.95)'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 80% at 50% 60%, rgba(80,0,30,0.15) 0%, rgba(0,0,0,0) 60%)' }}
          animate={{ opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <LightRays />
        <Embers count={18} intensity={1.2} />
        <RedSparks count={16} />
        <Grain opacity={0.12} />

        {/* Center Typewriter */}
        <div className="relative z-10 px-6 text-center">
          <TypewriterIntro text="Ready to indulge in sin?" onRevealPrompt={() => setShowPrompt(true)} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="mt-3 text-zinc-300/80 font-[Cormorant_Garamond] italic"
          >
            A confession written in crimson on the void.
          </motion.p>
        </div>

        {showPrompt && <ScrollPrompt label="Descend" onClick={() => scrollTo(s4Ref)} />}
      </section>

      {/* Screen 4 */}
      <section ref={s4Ref} className="relative min-h-screen grid place-items-center overflow-hidden">
        <Grain />
        <div className="text-center px-8 max-w-5xl">
          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7 }}
            className="font-[Cormorant_Garamond] italic font-semibold"
            style={{ fontSize: 'clamp(32px,6vw,56px)' }}
          >
            Fragrance as confession.
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-4 text-zinc-200"
            style={{ fontSize: 'clamp(18px,3.5vw,24px)' }}
          >
            Every scent tells the truth others hide. Wear your darkness proudly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left"
          >
            {[
              ['WRATH', 'Leather, incense, controlled violence'],
              ['ENVY', 'Green vetiver, bitter obsession, toxic desire'],
              ['LUST', 'Primal musk, bleeding roses, raw hunger'],
              ['GREED', 'Hoarded amber, molten gold, insatiable'],
              ['GLUTTONY', 'Rum-soaked excess, caramelized indulgence'],
              ['SLOTH', 'Opiate florals, surrendered stillness'],
              ['PRIDE', 'Regal leather, burning wood, crowned in jasmine'],
            ].map(([name, desc]) => (
              <div key={name} className="rounded-md/20 p-4 border border-zinc-800/60 bg-black/20">
                <div className="text-sm tracking-wider uppercase text-zinc-400 font-semibold">{name}</div>
                <div className="mt-1 text-zinc-200 font-semibold" style={{ fontSize: 'clamp(14px,2.8vw,18px)' }}>{desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <ScrollPrompt onClick={() => scrollTo(s5Ref)} />
      </section>

      {/* Screen 5 */}
      <section ref={s5Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Grain />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 px-8 max-w-6xl">
          <CraftCol icon={<IconChalice />} lines={[ 'Hand-blended micro-batches', '20% perfume oil concentration' ]} />
          <CraftCol icon={<IconNumberedBottle />} lines={[ 'Limited production', 'Each batch numbered' ]} />
          <CraftCol icon={<IconOrnateBottle />} lines={[ "Collector's packaging", 'Luxury without compromise' ]} />
        </div>
        <ScrollPrompt label="Descend" onClick={() => scrollTo(s6Ref)} />
      </section>

      {/* Screen 6 */}
      <section ref={s6Ref} className="relative min-h-screen grid place-items-center overflow-hidden bg-black">
        <Embers count={10} intensity={1.4} />
        <Smoke opacity={0.5} />
        <div className="text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-[Cinzel] font-semibold"
            style={{ fontSize: 'clamp(28px,5vw,48px)' }}
          >
            Which sin will you claim?
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-3 text-zinc-300"
            style={{ fontSize: 'clamp(18px,4vw,32px)' }}
          >
            Scroll to choose...
          </motion.p>
        </div>

        <InkBleedTrigger active={allowBleed && s6InView} onComplete={handleFinalSplit} />
      </section>
    </div>
  )
}

function IconChalice() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#C41E3A]">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8h40c0 10-8 18-18 20v10h6v6H24v-6h6V28C20 26 12 18 12 8z" />
        <path d="M18 54h28" strokeOpacity="0.6" />
      </g>
    </svg>
  )
}
function IconNumberedBottle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#C41E3A]">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="20" y="18" width="24" height="34" rx="4" />
        <path d="M26 18v-4h12v4" />
        <path d="M24 30h16" strokeOpacity="0.6" />
        <path d="M24 36h16" strokeOpacity="0.6" />
        <text x="32" y="50" textAnchor="middle" fontSize="10" fill="currentColor">№</text>
      </g>
    </svg>
  )
}
function IconOrnateBottle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#C41E3A]">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 22h16l4 12-12 18L20 34z" />
        <path d="M30 18h4v4h-4z" />
        <path d="M20 34h24" strokeOpacity="0.6" />
      </g>
    </svg>
  )
}

function CraftCol({ icon, lines }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <ul className="font-[Josefin_Sans] text-[14px] text-zinc-200 space-y-2 font-semibold">
        {lines.map((it, idx) => (<li key={idx}>{it}</li>))}
      </ul>
    </motion.div>
  )
}

function GreekFrame({ children }) {
  return (
    <div className="relative">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.8 }}
      >
        <motion.rect
          x="20" y="20" width="960" height="560" rx="2"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeDasharray="3000"
          initial={{ strokeDashoffset: 3000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </motion.svg>
      <div className="relative">{children}</div>
    </div>
  )
}

function InkBleedTrigger({ active, onComplete }) {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!active || started) return
    const onScroll = (e) => {
      if (!started) {
        e.preventDefault && e.preventDefault()
        setStarted(true)
        setTimeout(() => onComplete && onComplete(), 1000)
      }
    }
    window.addEventListener('wheel', onScroll, { passive: false })
    window.addEventListener('keydown', onScroll)
    return () => {
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('keydown', onScroll)
    }
  }, [active, started, onComplete])

  return (
    <AnimatePresence>
      {started && (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="absolute left-0 right-0 top-0"
            style={{ height: '0%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), #000)' }}
            animate={{ height: '52%' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute left-0 right-0 bottom-0"
            style={{ height: '0%', background: 'linear-gradient(to top, rgba(0,0,0,0.2), #000)' }}
            animate={{ height: '52%' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,30,58,0.5), transparent)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
