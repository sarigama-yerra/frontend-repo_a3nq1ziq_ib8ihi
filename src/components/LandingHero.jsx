import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Shared overlays
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)' }}
    />
  )
}

function TexturePaper() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  )
}

function Embers({ count = 5, intensity = 1 }) {
  const particles = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: 10 + (i * (80 / count)) + (i % 2 ? 5 : 0),
    size: 4 + (i % 3) * 2,
    delay: i * 0.6,
  })), [count])
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, bottom: '6%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -160 * intensity, opacity: [0, 1, 0] }}
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

function Smoke({ opacity = 0.3 }) {
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
        <span className="text-sm tracking-widest uppercase">{label}</span>
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
    // Arm the final ink-bleed only after user has time to read the quote
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
      // Only intercept while hero is on screen
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

  // Only arm the bleed when the final screen is actually in view
  const s5InView = useInView(s5Ref, { amount: 0.6 })

  return (
    <div ref={heroRef} className="relative w-full text-white bg-black">
      {/* Screen 1: The Void Entry */}
      <section ref={s1Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Grain />
        <Embers count={5} />
        <motion.h1
          className="text-center font-[Cinzel] leading-tight px-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(40px, 7vw, 72px)', textShadow: '0 0 24px rgba(196,30,58,0.25), 0 0 6px rgba(196,30,58,0.15)' }}
        >
          <Typewriter text="Ready to indulge in sin?" />
        </motion.h1>
        {showPrompt && <ScrollPrompt label="Descend" onClick={() => scrollTo(s2Ref)} />}
      </section>

      {/* Screen 2: The Revelation */}
      <section ref={s2Ref} className="relative min-h-screen grid place-items-center overflow-hidden">
        <Grain />
        <Embers count={4} intensity={0.8} />
        <div className="relative w-full max-w-[1200px] mx-auto px-6 text-center select-none">
          <StaggerMonogram />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-6"
          >
            <p className="text-zinc-300/90 italic" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)' }}>
              Seven Sins. Seven Scents. One Obsession.
            </p>
            <InkUnderline />
          </motion.div>
        </div>
        <ScrollPrompt label="Descend into temptation" onClick={() => scrollTo(s3Ref)} />
      </section>

      {/* Screen 3: The Manifesto */}
      <section ref={s3Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Grain />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(139,0,0,0.08), transparent 60%)' }} />
        <Smoke opacity={0.3} />
        <div className="px-8 max-w-4xl text-center">
          <Manifesto />
        </div>
        <ScrollPrompt onClick={() => scrollTo(s4Ref)} />
      </section>

      {/* Screen 4: The Philosophy */}
      <section ref={s4Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Grain />
        <TexturePaper />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 px-8 max-w-6xl">
          <PhilosophyCard
            title="Craftsmanship"
            items={[
              'Hand-blended in micro-batches',
              'Aged 30 days before bottling',
              '20% perfume oil concentration',
            ]}
            Icon={IconChalice}
          />
          <PhilosophyCard
            title="Philosophy"
            items={[
              'Niche fragrances for collectors',
              'Dark, complex, unapologetic',
              'Storytelling through scent',
            ]}
            Icon={IconCrownedSkull}
          />
          <PhilosophyCard
            title="Exclusivity"
            items={[
              'Limited production runs',
              'Each batch numbered',
              "Collector's piece packaging",
            ]}
            Icon={IconCagedFlame}
          />
        </div>
        <ScrollPrompt onClick={() => scrollTo(s5Ref)} />
      </section>

      {/* Screen 5: The Transition */}
      <section ref={s5Ref} className="relative min-h-screen grid place-items-center overflow-hidden">
        <Grain />
        <Embers count={7} intensity={1.2} />
        <Smoke opacity={0.4} />
        <div className="text-center px-6">
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(28px,5vw,48px)] font-[Cormorant_Garamond] italic"
          >
            <span className="text-[#C41E3A]">“</span>Sin is honest. These fragrances are truth.<span className="text-[#C41E3A]">”</span>
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-6 text-[clamp(18px,3vw,32px)]"
          >
            Choose your sin...
          </motion.p>
        </div>

        {/* Ink bleed screen split */}
        <InkBleedTrigger active={allowBleed && s5InView} onComplete={handleFinalSplit} />
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
    <span>
      {shown}
      <span className="inline-block w-[0.6ch]">{cursor ? '_' : ' '}</span>
    </span>
  )
}

function StaggerMonogram() {
  const letters = 'ELANOR'.split('')
  return (
    <div className="font-[Cinzel] tracking-[0.18em] leading-none" style={{ fontSize: 'clamp(120px, 14vw, 180px)' }}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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

function InkUnderline() {
  const pathLen = 320
  return (
    <motion.svg width="420" height="30" viewBox="0 0 420 30" className="mx-auto mt-4">
      <motion.path
        d="M10 15 C 110 25, 210 5, 410 15"
        fill="none"
        stroke="rgba(196,30,58,0.85)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        strokeLinecap="round"
      />
    </motion.svg>
  )
}

function Manifesto() {
  const lines = [
    'We craft niche fragrances for those who embrace the darkness within.',
    'Each scent embodies a deadly sin—complex, unapologetic, unforgettable.',
    'This is perfume as ritual, not commodity.'
  ]
  return (
    <div className="space-y-6">
      {lines.map((l, i) => (
        <motion.p
          key={i}
          className="font-[Cormorant_Garamond] text-zinc-200"
          style={{ fontSize: 'clamp(24px, 3.2vw, 32px)', letterSpacing: '0.02em' }}
          initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: i * 0.9, duration: 0.8 }}
        >
          {l}
        </motion.p>
      ))}
    </div>
  )
}

function PhilosophyCard({ title, items, Icon }) {
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
      <div className="flex justify-center mb-4">
        <Icon />
      </div>
      <h3 className="font-[Josefin_Sans] text-[18px] tracking-[0.2em] uppercase mb-3">{title}</h3>
      <ul className="font-[Josefin_Sans] text-[14px] text-zinc-300/90 space-y-2">
        {items.map((it, idx) => (<li key={idx}>{it}</li>))}
      </ul>
    </motion.div>
  )
}

// Minimal hatched icons
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
function IconCrownedSkull() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#C41E3A]">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 26a16 16 0 1 1 32 0c0 6-3 10-7 12-1 .6-2 1.7-2 2.8L38 46H26l-1-5.2c0-1.1-1-2.2-2-2.8-4-2-7-6-7-12z" />
        <path d="M24 22c0 3 2 4 4 4s4-1 4-4M40 22c0 3-2 4-4 4s-4-1-4-4" />
        <path d="M22 12l4 4 6-6 6 6 4-4" />
      </g>
    </svg>
  )
}
function IconCagedFlame() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#C41E3A]">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="16" y="12" width="32" height="40" rx="4" />
        <path d="M32 44c6-4 6-10 2-14-2 4-6 4-6 10 0 2 2 4 4 4z" />
        <path d="M22 12v40M42 12v40" strokeOpacity="0.6" />
      </g>
    </svg>
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
