import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Shared overlays
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)' }}
    />
  )
}

function Embers({ count = 4, intensity = 0.9 }) {
  const particles = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: 8 + (i * (84 / count)) + (i % 2 ? 6 : 0),
    size: 3 + (i % 3) * 2,
    delay: i * 0.55,
  })), [count])
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, bottom: '6%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -160 * intensity, opacity: [0, 0.9, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
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

function Smoke({ opacity = 0.25 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-x-1/2 top-1/4 h-1/2"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.2), transparent 70%)', filter: 'blur(30px)' }}
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -inset-x-1/2 bottom-1/4 h-1/2"
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
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 text-zinc-400">
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

export default function LandingHero({ onDone }) {
  const heroRef = useRef(null)
  const s1Ref = useRef(null)
  const s2Ref = useRef(null)
  const s3Ref = useRef(null)
  const s4Ref = useRef(null)
  const s5Ref = useRef(null)

  const [showPrompt, setShowPrompt] = useState(false)
  const [allowBleed, setAllowBleed] = useState(false)

  // Ensure we start at the very top and avoid browser restoring deep scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const t = setTimeout(() => setShowPrompt(true), 3000)
    const arm = setTimeout(() => setAllowBleed(true), 2500)
    return () => { clearTimeout(t); clearTimeout(arm) }
  }, [])

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Section-step wheel handler to avoid big native jumps
  const [isNavigating, setIsNavigating] = useState(false)
  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const refs = [s1Ref, s2Ref, s3Ref, s4Ref, s5Ref]
    const getCurrentIndex = () => {
      const mid = window.innerHeight / 2
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
      const heroOnScreen = heroRect.bottom > 0 && heroRect.top < window.innerHeight
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

  // Direct jump to constellation (top-right action)
  const handleBrowseSins = () => {
    const target = document.getElementById('constellation')
    onDone && onDone()
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const s5InView = useInView(s5Ref, { amount: 0.6 })

  // Screen 2: timeline for red line animation
  const [phase, setPhase] = useState('mono') // mono -> vline -> hline -> copy
  useEffect(() => {
    if (!s2Ref.current) return
    let t1, t2
    // monogram appears immediately, after 1.5s show vertical line
    t1 = setTimeout(() => setPhase('vline'), 1500)
    // after vertical cut finishes + pause, switch to horizontal divider then copy
    t2 = setTimeout(() => setPhase('hline'), 1500 + 1000 + 500)
    const t3 = setTimeout(() => setPhase('copy'), 1500 + 1000 + 500 + 400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Parallax for subtle drift on scroll (fade + drift up when leaving)
  const { scrollYProgress: s2Progress } = useScroll({ target: s2Ref, offset: ['start end', 'end start'] })
  const driftY = useTransform(s2Progress, [0, 1], [0, -30])
  const fadeOut = useTransform(s2Progress, [0, 0.8, 1], [1, 0.5, 0])

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

      {/* Screen 1: The Void Entry */}
      <section ref={s1Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <Grain />
        <Embers count={4} intensity={0.8} />
        <motion.h1
          className="text-center font-[Cinzel] leading-tight px-6 font-semibold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(40px, 7vw, 72px)', textShadow: '0 0 24px rgba(196,30,58,0.25), 0 0 6px rgba(196,30,58,0.15)' }}
        >
          <Typewriter text="Ready to indulge in sin?" />
        </motion.h1>
        {showPrompt && <ScrollPrompt label="Descend" onClick={() => scrollTo(s2Ref)} />}
      </section>

      {/* Screen 2: The Brand Reveal (Revised with red line animation) */}
      <section ref={s2Ref} className="relative min-h-screen grid place-items-center overflow-hidden bg-black">
        <Grain />
        <Embers count={3} intensity={0.6} />

        <motion.div style={{ y: driftY, opacity: fadeOut }} className="relative w-full max-w-[1200px] mx-auto px-6 text-center select-none">
          {/* ELANOR monogram */}
          <div className="relative inline-block">
            <StaggerMonogram visible={true} />

            {/* Vertical red line cutting down */}
            <AnimatePresence>
              {phase === 'vline' && (
                <motion.div
                  key="vline"
                  className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px]"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: '100%', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: 'linear-gradient(to bottom, rgba(196,30,58,0), rgba(196,30,58,0.95), rgba(196,30,58,0))', boxShadow: '0 0 18px rgba(196,30,58,0.6)' }}
                />
              )}
            </AnimatePresence>

            {/* Horizontal divider expansion */}
            <AnimatePresence>
              {(phase === 'hline' || phase === 'copy') && (
                <motion.div
                  key="hline"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-6 h-[2px]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '72%', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(to right, rgba(196,30,58,0), rgba(196,30,58,0.9), rgba(196,30,58,0))', boxShadow: '0 0 16px rgba(196,30,58,0.45)' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Copy below divider */}
          <AnimatePresence>
            {phase === 'copy' && (
              <motion.div key="copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-10">
                <p className="text-zinc-200 italic font-semibold" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)' }}>
                  Seven scents. Seven temptations. Unapologetically yours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <ScrollPrompt label="Descend into temptation" onClick={() => scrollTo(s3Ref)} />
      </section>

      {/* Screen 3: Brand Introduction (Revised) */}
      <section ref={s3Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle gradient from black to deep burgundy */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 50% 100%, rgba(139,0,0,0.15), rgba(0,0,0,1) 60%)' }} />
        {/* Ink wash texture behind text */}
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Embers count={2} intensity={0.4} />

        <div className="px-8 max-w-4xl text-center relative">
          <motion.h2
            className="font-[Cinzel] font-semibold"
            style={{ fontSize: 'clamp(36px,5vw,48px)' }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            What is Elanor?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 space-y-5"
          >
            <p className="font-[Cormorant_Garamond] text-zinc-200 font-semibold" style={{ fontSize: 'clamp(20px,3.4vw,28px)' }}>
              A niche perfume house crafting fragrances based on the seven deadly sins. Each scent captures the raw emotion of its sin—WRATH channels fury and fire, ENVY embodies toxic desire, LUST is unfiltered seduction.
            </p>
            <p className="font-[Cormorant_Garamond] text-zinc-200 font-semibold" style={{ fontSize: 'clamp(20px,3.4vw,28px)' }}>
              Limited batches. Hand-blended compositions. No apologies.
            </p>
          </motion.div>
        </div>
        <ScrollPrompt onClick={() => scrollTo(s4Ref)} />
      </section>

      {/* Screen 4: The Concept (Simplified) */}
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

          {/* Optional alternate concept list for clarity */}
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

      {/* Screen 5: Craftsmanship (Keep, slightly revised) */}
      <section ref={s5Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Grain />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 px-8 max-w-6xl">
          <CraftCol
            icon={<IconChalice />}
            lines={[
              'Hand-blended micro-batches',
              '20% perfume oil concentration',
            ]}
          />
          <CraftCol
            icon={<IconNumberedBottle />}
            lines={[
              'Limited production',
              'Each batch numbered',
            ]}
          />
          <CraftCol
            icon={<IconOrnateBottle />}
            lines={[
              "Collector's packaging",
              'Luxury without compromise',
            ]}
          />
        </div>
        <ScrollPrompt label="Descend" onClick={() => scrollTo(s5Ref)} />
      </section>

      {/* Screen 6: The Transition (Simplified) */}
      <section className="relative min-h-screen grid place-items-center overflow-hidden bg-black">
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

        {/* Ink bleed wipe revealing constellation */}
        <InkBleedTrigger active={allowBleed} onComplete={handleFinalSplit} />
      </section>
    </div>
  )
}

function Typewriter({ text }) {
  const [shown, setShown] = useState('')
  const [cursor, setCursor] = useState(true)
  useEffect(() => {
    let i = 0
    const tick = () => {
      setShown(text.slice(0, i + 1))
      i++
      if (i < text.length) setTimeout(tick, 55)
    }
    const start = setTimeout(tick, 650)
    const blink = setInterval(() => setCursor((v) => !v), 600)
    return () => { clearTimeout(start); clearInterval(blink) }
  }, [text])
  return (
    <span className="font-semibold">
      {shown}
      <span className="inline-block w-[0.6ch]">{cursor ? '_' : ' '}</span>
    </span>
  )
}

function StaggerMonogram({ visible = true }) {
  const letters = 'ELANOR'.split('')
  return (
    <div className="font-[Cinzel] tracking-[0.18em] leading-none" style={{ fontSize: 'clamp(140px, 14vw, 180px)' }}>
      {visible && letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-block',
            color: '#fff',
            textShadow: '0 1px 0 rgba(255,255,255,0.02), 0 0 40px rgba(139,0,0,0.25), 0 0 8px rgba(139,0,0,0.2)',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.35)',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
          }}
        >
          {ch}
        </motion.span>
      ))}
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
          {/* Top bleed */}
          <motion.div
            className="absolute left-0 right-0 top-0"
            style={{ height: '0%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), #000)' }}
            animate={{ height: '52%' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Bottom bleed */}
          <motion.div
            className="absolute left-0 right-0 bottom-0"
            style={{ height: '0%', background: 'linear-gradient(to top, rgba(0,0,0,0.2), #000)' }}
            animate={{ height: '52%' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Center seam glow */}
          <motion.div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,30,58,0.5), transparent)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
