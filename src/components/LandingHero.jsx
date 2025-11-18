import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation, useInView, useScroll, useTransform } from 'framer-motion'
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

// Simple upward embers used on Screen 6 and ambient effects
function Embers({ count = 10, intensity = 1.0 }) {
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

// Page 1 Typewriter (auto, no mouse required)
function TypewriterIntro({ text, onPromptReady }) {
  const [started, setStarted] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [shownCount, setShownCount] = useState(0)

  useEffect(() => {
    // Simulate DOMContentLoaded -> component mount is sufficient
    setStarted(true)
    const c1 = setTimeout(() => setShowCursor(true), 500) // cursor appears at 0.5s
    let typingTimer
    const c2 = setTimeout(() => { // start typing at 1.0s
      const step = () => {
        setShownCount((n) => {
          if (n < text.length) {
            return n + 1
          } else {
            return n
          }
        })
        const next = 80 + Math.floor(Math.random() * 20) // 80-100ms
        typingTimer = setTimeout(step, next)
      }
      step()
    }, 1000)

    // After 3s total, show prompt (even while typing continues on long strings)
    const p = setTimeout(() => onPromptReady && onPromptReady(), 3000)

    return () => { clearTimeout(c1); clearTimeout(c2); clearTimeout(p); typingTimer && clearTimeout(typingTimer) }
  }, [text, onPromptReady])

  const letters = text.split('')
  return (
    <div className="relative text-center">
      <div className="font-[Cinzel] font-semibold leading-tight" style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < shownCount ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'inline-block',
              letterSpacing: '0.02em',
              color: '#FFF',
              textShadow: i < shownCount ? `0 0 ${8 + i * 0.2}px rgba(196,30,58,${0.35 + Math.min(0.4, i / letters.length)})` : 'none',
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

// Stage rays (auto animated, no cursor)
function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%]"
        style={{ background: 'conic-gradient(from 200deg, rgba(220,20,60,0.12), transparent 40%)', filter: 'blur(10px)' }}
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%]"
        style={{ background: 'conic-gradient(from 340deg, rgba(220,20,60,0.12), transparent 40%)', filter: 'blur(10px)' }}
        animate={{ rotate: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// Falling gold sparks (shown during split)
function GoldFall({ active = false }) {
  const parts = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 0.5,
    dur: 1.2 + Math.random() * 0.8,
  })), [])
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0">
      {parts.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, top: '-2%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '110%', opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, ease: 'easeIn', delay: p.delay }}
        >
          <div style={{ width: p.size, height: p.size, borderRadius: '50%', background: 'rgba(232,197,71,0.9)', filter: 'blur(0.5px) drop-shadow(0 0 8px rgba(232,197,71,0.4))' }} />
        </motion.div>
      ))}
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
  const s6Ref = useRef(null)

  const [showPrompt, setShowPrompt] = useState(false)
  const [allowBleed, setAllowBleed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    // Allow final screen wipe after a bit
    const arm = setTimeout(() => setAllowBleed(true), 2500)
    return () => { clearTimeout(arm) }
  }, [])

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Wheel step navigation within hero cluster
  const [isNavigating, setIsNavigating] = useState(false)
  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const refs = [s1Ref, s2Ref, s3Ref, s4Ref, s5Ref, s6Ref]
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

  // Screen 2 timeline flags (explicit, deterministic, no mouse influence)
  const s2InView = useInView(s2Ref, { amount: 0.2 })
  const [seqStarted, setSeqStarted] = useState(false)
  const [showWordmark, setShowWordmark] = useState(false)
  const [showTopLine, setShowTopLine] = useState(false)
  const [cutting, setCutting] = useState(false)
  const [splitting, setSplitting] = useState(false)
  const [showDivider, setShowDivider] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [impactShake, setImpactShake] = useState(false)

  const controlsLeft = useAnimation()
  const controlsRight = useAnimation()

  // Fallback start even if inView doesn't fire
  useEffect(() => {
    if (seqStarted) return
    const earlyKick = setTimeout(() => {
      if (!seqStarted) startS2Sequence()
    }, 800)
    return () => clearTimeout(earlyKick)
  }, [seqStarted])

  useEffect(() => {
    if (!s2InView || seqStarted) return
    startS2Sequence()
  }, [s2InView, seqStarted])

  const startS2Sequence = () => {
    setSeqStarted(true)
    setShowWordmark(false)
    setShowTopLine(false)
    setCutting(false)
    setSplitting(false)
    setShowDivider(false)
    setShowQuote(false)
    setImpactShake(false)
    controlsLeft.set({ x: 0, rotateY: 0 })
    controlsRight.set({ x: 0, rotateY: 0 })

    // 0-2.0s: Wordmark fade in
    setShowWordmark(true)

    // 2.0-2.5s: Horizontal red line
    const t1 = setTimeout(() => setShowTopLine(true), 2000)
    // 2.5-3.5s: Drop line + impact shake at end
    const t2 = setTimeout(() => { setShowTopLine(false); setCutting(true) }, 2500)
    const t2b = setTimeout(() => { setImpactShake(true); setTimeout(() => setImpactShake(false), 180) }, 3500)
    // 3.5-4.5s: Split halves with slight outward tilt
    const t3 = setTimeout(() => {
      setCutting(false)
      setSplitting(true)
      controlsLeft.start({ x: -200, rotateY: -5, transition: { duration: 1.0, ease: 'easeOut' } })
      controlsRight.start({ x: 200, rotateY: 5, transition: { duration: 1.0, ease: 'easeOut' } })
    }, 3500)
    // 4.5-5.0s: Divider horizontal
    const t4 = setTimeout(() => { setSplitting(false); setShowDivider(true) }, 4500)
    // 5.0-6.0s: Quote fade in
    const t5 = setTimeout(() => setShowQuote(true), 5000)

    const cleaners = [t1, t2, t2b, t3, t4, t5]
    return () => cleaners.forEach(clearTimeout)
  }

  // Scroll-driven fade on Screen 2 content (subtle)
  const { scrollYProgress: s2Progress } = useScroll({ target: s2Ref, offset: ['start end', 'end start'] })
  const driftY = useTransform(s2Progress, [0, 1], [0, -30])
  const fadeOut = useTransform(s2Progress, [0, 0.8, 1], [1, 0.5, 0])

  // Screen 3 dynamics
  const { scrollYProgress: s3Progress } = useScroll({ target: s3Ref, offset: ['start end', 'end start'] })
  const s3Drift = useTransform(s3Progress, [0, 1], [0, -30])
  const s3Blur = useTransform(s3Progress, [0, 0.8, 1], ['blur(0px)', 'blur(2px)', 'blur(6px)'])
  const s3Opacity = useTransform(s3Progress, [0, 0.9, 1], [1, 0.7, 0])
  const colsOpacity = useTransform(s3Progress, [0, 0.8, 1], [0.05, 0.15, 0.2])

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

      {/* Screen 1: Black screen + typewriter */}
      <section ref={s1Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0" />
        <div className="relative z-10 px-6">
          <TypewriterIntro
            text="Ready to indulge in sin?"
            onPromptReady={() => setShowPrompt(true)}
          />
        </div>
        {showPrompt && <ScrollPrompt label="Descend" onClick={() => scrollTo(s2Ref)} />}
      </section>

      {/* Screen 2: Brand Reveal (no cursor effects) */}
      <section ref={s2Ref} className="relative min-h-screen grid place-items-center overflow-hidden" style={{ background: 'radial-gradient(60% 60% at 50% 50%, #2b0a12 0%, #090709 70%, #000 100%)' }}>
        <LightRays />
        {/* Gothic fog rolling across bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-60">
          <Smoke opacity={0.25} bottom />
        </div>
        {/* Faint cathedral arches */}
        <motion.div className="pointer-events-none absolute inset-0" initial={{ scale: 1, opacity: 0.04 }} animate={{ scale: splitting ? 1.1 : 1, opacity: 0.06 }} transition={{ duration: 0.8 }}>
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 Q600,100 1200,800" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" fill="none" />
            <path d="M0,800 Q600,160 1200,800" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
        {/* Ambient embers */}
        <Embers count={6} intensity={0.8} />

        <Grain />
        <GoldFall active={splitting} />

        <motion.div style={{ y: driftY, opacity: fadeOut }} className="relative w-full max-w-[1200px] mx-auto px-6 text-center select-none">
          <motion.div animate={impactShake ? { y: [0, -2, 1, -1, 0] } : {}} transition={{ duration: 0.18 }} className="relative inline-block">
            {/* Full wordmark (fades in 0-2s) */}
            <AnimatePresence>
              {showWordmark && (
                <motion.div
                  key="wm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="relative z-[1]"
                >
                  <WordmarkClean />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Split halves (visible during split/divider/quote) */}
            <div className="pointer-events-none absolute inset-0 z-[2]">
              <motion.div className="absolute inset-0" animate={{ opacity: splitting || showDivider || showQuote ? 1 : 0 }} transition={{ duration: 0.12 }}>
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                  <motion.div animate={controlsLeft} className="absolute inset-0">
                    <div className="absolute inset-0 flex justify-center"><WordmarkClean /></div>
                  </motion.div>
                </motion.div>
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 0 0 50%)' }}>
                  <motion.div animate={controlsRight} className="absolute inset-0">
                    <div className="absolute inset-0 flex justify-center"><WordmarkClean /></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Top horizontal crimson line (2.0-2.5s) */}
            <AnimatePresence>
              {showTopLine && (
                <motion.div
                  key="topline"
                  className="absolute left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '40%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ top: -50, height: 3, background: '#DC143C', boxShadow: '0 0 18px rgba(220,20,60,0.8)' }}
                />
              )}
            </AnimatePresence>

            {/* Vertical cutting line (2.5-3.5s) with glowing trail */}
            <AnimatePresence>
              {cutting && (
                <motion.div key="cutwrap" className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] z-[3]">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(to bottom, rgba(220,20,60,0), rgba(220,20,60,1), rgba(220,20,60,0))', boxShadow: '0 0 30px rgba(220,20,60,0.9)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider horizontal (4.5-5.0s) with pulse */}
            <AnimatePresence>
              {showDivider && (
                <motion.div
                  key="divider"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-6 h-[5px] z-[2]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1, filter: ['brightness(0.8)', 'brightness(1.2)', 'brightness(1.0)'] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ background: '#DC143C', boxShadow: '0 0 22px rgba(220,20,60,0.8)' }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quote below divider (5.0-6.0s) */}
          <AnimatePresence>
            {showQuote && (
              <motion.div key="copy" initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.0 }} className="mt-10">
                <p className="text-zinc-100 italic font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 38px)', textShadow: '0 0 10px rgba(212,175,55,0.25)' }}>
                  Seven scents. Seven temptations. Unapologetically yours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Resting state: gentle divider pulse */}
        <AnimatePresence>
          {showDivider && !showQuote && (
            <motion.div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 w-1/2 h-[5px]" animate={{ filter: ['brightness(0.9)', 'brightness(1.05)', 'brightness(0.9)'] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ background: 'transparent' }} />
          )}
        </AnimatePresence>
      </section>

      {/* Screen 3 */}
      <section ref={s3Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0B0F 100%)' }}>
        {/* Marble texture */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* Column silhouettes left/right */}
        <motion.div className="absolute top-0 bottom-0 left-0 w-1/3" style={{ opacity: colsOpacity }}>
          <div className="absolute inset-y-0 left-[-10%] w-[60%]" style={{ background: 'radial-gradient(40% 60% at 70% 50%, rgba(58,58,58,0.2), transparent 70%)' }} />
        </motion.div>
        <motion.div className="absolute top-0 bottom-0 right-0 w-1/3" style={{ opacity: colsOpacity }}>
          <div className="absolute inset-y-0 right-[-10%] w-[60%]" style={{ background: 'radial-gradient(40% 60% at 30% 50%, rgba(58,58,58,0.2), transparent 70%)' }} />
        </motion.div>
        {/* Gold stardust */}
        <GoldParticles count={28} />

        <motion.div style={{ y: s3Drift, filter: s3Blur, opacity: s3Opacity }} className="relative z-10 px-6 w-full max-w-5xl">
          {/* Greek key border frame */}
          <GreekFrame>
            <div className="text-center py-10 md:py-14">
              {/* Arete heading */}
              <motion.h3
                className="font-[Cinzel] font-bold tracking-[0.18em]"
                style={{ color: '#D4AF37', fontSize: 'clamp(40px,6vw,64px)' }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                Ἀρετή
              </motion.h3>
              <motion.p
                className="font-[Cormorant_Garamond] italic"
                style={{ color: '#E8E6E3', opacity: 0.8, fontSize: 'clamp(14px,3.5vw,18px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                (Virtue through vice. Excellence through sin.)
              </motion.p>

              {/* Ornamental separator */}
              <OrnamentalSeparator />

              {/* Main statement lines with stagger */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3 } } }}
                className="mt-8 space-y-6"
              >
                {[
                  'The ancient Greeks understood: every virtue casts a shadow. WRATH is Ares unleashed. ENVY, the serpent coiled in Aphrodite\'s garden. LUST, Dionysus untamed.',
                  'Seven fragrances. Seven philosophical truths. Each scent a confession written in amber, leather, and smoke.',
                ].map((line, idx) => (
                  <motion.p
                    key={idx}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    className="font-[Cinzel]"
                    style={{ color: '#F5F3F0', letterSpacing: '0.04em', lineHeight: 1.7, fontSize: 'clamp(24px,4.5vw,52px)' }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>

              {/* Bottom italic quote */}
              <motion.p
                className="mt-10 font-[Cormorant_Garamond] italic"
                style={{ color: '#C9A961', fontSize: 'clamp(20px,4vw,32px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6, duration: 0.6 }}
              >
                Luxury for those who choose honesty over decorum.
              </motion.p>
            </div>
          </GreekFrame>
        </motion.div>
        <ScrollPrompt onClick={() => scrollTo(s4Ref)} />
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

function GoldParticles({ count = 24 }) {
  const parts = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    dur: 10 + Math.random() * 12,
    delay: Math.random() * 4,
  })), [count])
  return (
    <div className="pointer-events-none absolute inset-0">
      {parts.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-10, 10, -10], opacity: [0, 0.8, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          <div style={{ width: p.size, height: p.size, background: 'rgba(232,197,71,0.8)', filter: 'blur(1px) drop-shadow(0 0 6px rgba(232,197,71,0.3))' }} />
        </motion.div>
      ))}
    </div>
  )
}

// Clean ELANOR wordmark (no overlap, proper kerning, gold edge glow)
function WordmarkClean() {
  return (
    <div className="font-[Cinzel] leading-none select-none" style={{ fontSize: 'clamp(120px, 12vw, 160px)', color: '#FFFFFF', letterSpacing: '0.05em', textShadow: '0 1px 0 rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.45), 0 0 14px rgba(212,175,55,0.35)' }}>
      ELANOR
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

function OrnamentalSeparator() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <motion.div
        className="h-px"
        style={{ background: '#B8A078', width: 80, opacity: 0.9 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.span
        style={{ color: '#D4AF37' }}
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Ω
      </motion.span>
      <motion.div
        className="h-px"
        style={{ background: '#B8A078', width: 80, opacity: 0.9 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
      />
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
