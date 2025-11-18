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

function ReactiveEmbers({ count = 24, mouse, velocity }) {
  const items = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: window.innerHeight * (0.6 + Math.random() * 0.3),
    size: 1 + Math.random() * 2.5,
    baseVy: -0.2 - Math.random() * 0.35,
  })), [count])

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map(p => {
        const dx = (mouse.x ?? -9999) - p.x
        const dy = (mouse.y ?? -9999) - p.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        const inRange = dist < 80
        // Repulsion force falls off with distance
        const force = inRange ? (1 - dist / 80) : 0
        const dirX = inRange ? -dx / (dist || 1) : 0
        const dirY = inRange ? -dy / (dist || 1) : 0
        const speedMult = 1 + Math.min(1.8, Math.hypot(velocity.vx, velocity.vy) / 120)
        const tx = p.x + dirX * force * 24 * speedMult
        const ty = p.y + dirY * force * 24 * speedMult + p.baseVy * 60
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            animate={{ x: tx, y: ty, opacity: [0, 0.9, 0.2] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ left: 0, top: 0 }}
          >
            <div style={{ width: p.size, height: p.size, background: 'rgba(232,197,71,0.8)', filter: 'blur(1px) drop-shadow(0 0 6px rgba(232,197,71,0.3))', borderRadius: '50%' }} />
          </motion.div>
        )
      })}
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
  const s6Ref = useRef(null)

  const [showPrompt, setShowPrompt] = useState(false)
  const [allowBleed, setAllowBleed] = useState(false)

  // Mouse tracking (shared)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [mouseS2, setMouseS2] = useState({ x: -9999, y: -9999 })
  const velRef = useRef({ vx: 0, vy: 0, px: -9999, py: -9999, t: 0 })
  useEffect(() => {
    velRef.current.t = performance.now()
  }, [])
  const updateVelocity = (x, y) => {
    const now = performance.now()
    const dt = Math.max(16, now - velRef.current.t)
    const vx = (x - velRef.current.px) / dt * 1000
    const vy = (y - velRef.current.py) / dt * 1000
    velRef.current = { vx: isFinite(vx) ? vx : 0, vy: isFinite(vy) ? vy : 0, px: x, py: y, t: now }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const t = setTimeout(() => setShowPrompt(true), 3000)
    const arm = setTimeout(() => setAllowBleed(true), 2500)
    return () => { clearTimeout(t); clearTimeout(arm) }
  }, [])

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Wheel step navigation within hero cluster
  const [isNavigating, setIsNavigating] = useState(false)
  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const refs = [s1Ref, s2Ref, s3Ref, s4Ref, s5Ref, s6Ref]
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

  const handleBrowseSins = () => {
    const target = document.getElementById('constellation')
    onDone && onDone()
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const s6InView = useInView(s6Ref, { amount: 0.6 })

  // Screen 2 timeline flags (explicit, deterministic)
  const s2InView = useInView(s2Ref, { amount: 0.2 })
  const [seqStarted, setSeqStarted] = useState(false)
  const [showWordmark, setShowWordmark] = useState(false)
  const [showTopLine, setShowTopLine] = useState(false)
  const [cutting, setCutting] = useState(false)
  const [splitting, setSplitting] = useState(false)
  const [showDivider, setShowDivider] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [cutDuration, setCutDuration] = useState(1.0)

  const controlsLeft = useAnimation()
  const controlsRight = useAnimation()

  // Ensure sequence starts even if inView never crosses threshold (safari/ios/very small screens)
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
    // Reset
    setShowWordmark(false)
    setShowTopLine(false)
    setCutting(false)
    setSplitting(false)
    setShowDivider(false)
    setShowQuote(false)
    controlsLeft.set({ x: 0 })
    controlsRight.set({ x: 0 })

    // 0-2.0s: Wordmark fade in (1.5s) + 0.5s hold
    setShowWordmark(true)

    // 2.0-2.5s: Horizontal red line (top)
    const t1 = setTimeout(() => setShowTopLine(true), 2000)
    // 2.5-3.5s: Rotate to vertical + drop
    const t2 = setTimeout(() => {
      setShowTopLine(false)
      // set cut speed based on current vertical velocity (mouse influence)
      const speedFactor = 1 + Math.min(0.7, Math.abs(velRef.current.vy) / 800)
      setCutDuration(1.0 / speedFactor)
      setCutting(true)
    }, 2500)
    // 3.5-4.5s: Split halves
    const t3 = setTimeout(() => {
      setCutting(false)
      setSplitting(true)
      controlsLeft.start({ x: -200, transition: { duration: 1.0, ease: 'easeOut' } })
      controlsRight.start({ x: 200, transition: { duration: 1.0, ease: 'easeOut' } })
    }, 3500)
    // 4.5-5.0s: Divider horizontal
    const t4 = setTimeout(() => { setSplitting(false); setShowDivider(true) }, 4500)
    // 5.0-6.0s: Quote fade in
    const t5 = setTimeout(() => setShowQuote(true), 5000)

    const cleaners = [t1, t2, t3, t4, t5]
    return () => cleaners.forEach(clearTimeout)
  }

  // Scroll-driven fade on Screen 2 content
  const { scrollYProgress: s2Progress } = useScroll({ target: s2Ref, offset: ['start end', 'end start'] })
  const driftY = useTransform(s2Progress, [0, 1], [0, -30])
  const fadeOut = useTransform(s2Progress, [0, 0.8, 1], [1, 0.5, 0])

  // Screen 3 dynamics
  const { scrollYProgress: s3Progress } = useScroll({ target: s3Ref, offset: ['start end', 'end start'] })
  const s3Drift = useTransform(s3Progress, [0, 1], [0, -30])
  const s3Blur = useTransform(s3Progress, [0, 0.8, 1], ['blur(0px)', 'blur(2px)', 'blur(6px)'])
  const s3Opacity = useTransform(s3Progress, [0, 0.9, 1], [1, 0.7, 0])
  const colsOpacity = useTransform(s3Progress, [0, 0.8, 1], [0.05, 0.15, 0.2])

  // Extra offsets during splitting based on cursor
  const extraSplitX = (() => {
    const elem = s2Ref.current
    if (!elem) return 0
    const rect = elem.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const dx = (mouseS2.x - cx) / rect.width // -0.5..0.5
    return Math.max(-50, Math.min(50, dx * 200)) // ±50 max
  })()

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

      {/* Screen 1 */}
      <section
        ref={s1Ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={(e) => {
          const rect = s1Ref.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          setMouse({ x: e.clientX, y: e.clientY })
          updateVelocity(e.clientX, e.clientY)
        }}
      >
        {/* Background spotlight following cursor (with trailing) */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(300px 300px at ${mouse.x}px ${mouse.y}px, rgba(40,40,40,0.75), rgba(0,0,0,0.85) 60%)`
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Damask pattern reveal around cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          animate={{
            WebkitMaskImage: `radial-gradient(80px 80px at ${mouse.x}px ${mouse.y}px, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)`,
            maskImage: `radial-gradient(80px 80px at ${mouse.x}px ${mouse.y}px, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)`,
            opacity: 0.08
          }}
          transition={{ duration: 0.12 }}
        />

        {/* Vignette that subtly shifts opposite to cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ x: (window.innerWidth/2 - (mouse.x||0)) * 0.02, y: (window.innerHeight/2 - (mouse.y||0)) * 0.02 }}
          transition={{ duration: 0.4 }}
          style={{ background: 'radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7))' }}
        />

        <Grain />
        <ReactiveEmbers count={28} mouse={mouse} velocity={velRef.current} />

        {/* Title with per-letter proximity effects */}
        <ProximityTitle mouse={mouse} text="Ready to indulge in sin?" />

        {showPrompt && <ScrollPrompt label="Descend" onClick={() => scrollTo(s2Ref)} />}
      </section>

      {/* Screen 2: Brand Reveal with strict sequence + mouse reactivity */}
      <section
        ref={s2Ref}
        className="relative min-h-screen grid place-items-center overflow-hidden bg-black"
        onMouseMove={(e) => {
          const rect = s2Ref.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          setMouseS2({ x: e.clientX, y: e.clientY })
          updateVelocity(e.clientX, e.clientY)
        }}
      >
        {/* Fog that parts near cursor */}
        <motion.div className="pointer-events-none absolute inset-0" animate={{
          WebkitMaskImage: `radial-gradient(140px 140px at ${mouseS2.x}px ${mouseS2.y}px, rgba(0,0,0,0), rgba(0,0,0,1) 60%)`,
          maskImage: `radial-gradient(140px 140px at ${mouseS2.x}px ${mouseS2.y}px, rgba(0,0,0,0), rgba(0,0,0,1) 60%)`,
        }} transition={{ duration: 0.2 }}>
          <Smoke opacity={0.18} />
        </motion.div>

        {/* Subtle arches moving counter to cursor */}
        <motion.div className="pointer-events-none absolute inset-0 opacity-20" animate={{ x: (window.innerWidth/2 - (mouseS2.x||0)) * 0.03, y: (window.innerHeight/2 - (mouseS2.y||0)) * 0.02 }} transition={{ duration: 0.3 }}>
          <svg className="absolute inset-x-0 top-[15%] mx-auto" width="100%" height="200" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,200 Q600,-40 1200,200" stroke="#1f1f1f" strokeWidth="2" fill="none" />
            <path d="M0,200 Q600,0 1200,200" stroke="#161616" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>

        {/* Red glow that follows mouse during cutting/splitting */}
        <AnimatePresence>
          {(cutting || splitting) && (
            <motion.div key="s2glow" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="absolute" animate={{ left: (mouseS2.x||-9999) - 150, top: (mouseS2.y||-9999) - 150 }} transition={{ duration: 0.15 }} style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,30,58,0.24), rgba(196,30,58,0) 60%)', filter: 'blur(10px)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <Grain />
        <motion.div style={{ y: driftY, opacity: fadeOut }} className="relative w-full max-w-[1200px] mx-auto px-6 text-center select-none">
          <div className="relative inline-block">
            {/* Full wordmark (fades in 0-2s) with pre-split parallax */}
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
                  <Wordmark mouse={mouseS2} active={!cutting && !splitting && !showDivider} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Split halves (visible during split/divider/quote) */}
            <div className="pointer-events-none absolute inset-0 z-[2]">
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: splitting || showDivider || showQuote ? 1 : 0 }}
                transition={{ duration: 0.12 }}
              >
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                  <motion.div animate={controlsLeft} className="absolute inset-0">
                    <motion.div style={{ x: splitting ? extraSplitX * -1 : 0 }} className="absolute inset-0 flex justify-center">
                      <Wordmark />
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 0 0 50%)' }}>
                  <motion.div animate={controlsRight} className="absolute inset-0">
                    <motion.div style={{ x: splitting ? extraSplitX : 0 }} className="absolute inset-0 flex justify-center">
                      <Wordmark />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Top horizontal red line (2.0-2.5s) */}
            <AnimatePresence>
              {showTopLine && (
                <motion.div
                  key="topline"
                  className="absolute left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '40%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ top: -50, height: 2, background: '#8B0000', boxShadow: '0 0 12px rgba(139,0,0,0.6)' }}
                />
              )}
            </AnimatePresence>

            {/* Vertical cutting line (2.5-3.5s) with variable speed + drip towards cursor */}
            <AnimatePresence>
              {cutting && (
                <motion.div key="cutwrap" className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] z-[3]">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: cutDuration, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(to bottom, rgba(139,0,0,0), rgba(139,0,0,0.95), rgba(139,0,0,0))', boxShadow: '0 0 22px rgba(139,0,0,0.65)' }}
                  />
                  {/* Drip */}
                  <motion.div
                    className="absolute -left-1.5 top-0 w-3 h-3 rounded-full"
                    style={{ background: 'radial-gradient(circle, #8B0000, rgba(139,0,0,0.2))', filter: 'drop-shadow(0 0 8px rgba(139,0,0,0.6))' }}
                    initial={{ opacity: 0, y: -10, x: 0 }}
                    animate={{
                      opacity: 1,
                      y: '100%',
                      x: ((() => {
                        const rect = s2Ref.current?.getBoundingClientRect()
                        if (!rect) return 0
                        const centerX = rect.left + rect.width / 2
                        const dx = Math.max(-60, Math.min(60, (mouseS2.x - centerX) * 0.08))
                        return dx
                      })()),
                    }}
                    transition={{ duration: Math.max(0.6, cutDuration), ease: 'easeIn' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider horizontal (4.5-5.0s) */}
            <AnimatePresence>
              {showDivider && (
                <motion.div
                  key="divider"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-6 h-[2px] z-[2]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(to right, rgba(139,0,0,0), rgba(139,0,0,0.9), rgba(139,0,0,0))', boxShadow: '0 0 16px rgba(139,0,0,0.45)' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Quote below divider (5.0-6.0s) with subtle tilt towards cursor */}
          <AnimatePresence>
            {showQuote && (
              <motion.div key="copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }} className="mt-10">
                <motion.p
                  className="text-zinc-100 italic font-semibold"
                  style={{ fontSize: 'clamp(32px, 3.5vw, 36px)' }}
                  animate={{ rotateX: ((mouseS2.y - (window.innerHeight/2)) * -0.01), rotateY: ((mouseS2.x - (window.innerWidth/2)) * 0.01) }}
                  transition={{ duration: 0.2 }}
                >
                  Seven scents. Seven temptations. Unapologetically yours.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <ScrollPrompt label="Descend into temptation" onClick={() => scrollTo(s3Ref)} />
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

function ProximityTitle({ text, mouse }) {
  const letters = text.split('')
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  return (
    <div className="text-center font-[Cinzel] leading-tight px-6 font-semibold select-none">
      {letters.map((ch, i) => {
        if (ch === ' ') return <span key={i} style={{ display: 'inline-block', width: '0.5ch' }} />
        const dx = (mouse.x - center.x)
        const dy = (mouse.y - center.y)
        const d = Math.hypot(dx, dy)
        const near = Math.max(0, 1 - d / 100)
        const glow = near * 0.8
        const tiltX = (dy / 100) * -2 * near
        const tiltY = (dx / 100) * 2 * near
        return (
          <motion.span
            key={i}
            style={{ display: 'inline-block', fontSize: 'clamp(40px, 7vw, 72px)', color: `rgba(255,255,255,${0.9 - near*0.1})`, textShadow: `0 0 ${12 + glow*12}px rgba(196,30,58,${0.4 + glow*0.6})` }}
            animate={{ rotateX: tiltX, rotateY: tiltY }}
            transition={{ duration: 0.2 }}
          >
            {ch}
          </motion.span>
        )
      })}
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

// ELANOR wordmark in Cinzel with soft white and letterpress feel + optional parallax
function Wordmark({ mouse, active = false }) {
  const letters = 'ELANOR'.split('')
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  return (
    <div className="font-[Cinzel] tracking-[0.12em] leading-none" style={{ fontSize: 'clamp(140px, 14vw, 180px)', color: '#F5F3F0' }}>
      {letters.map((ch, i) => {
        const depth = active ? (i - letters.length/2) * 2 : 0
        const px = active ? ((mouse?.x ?? center.x) - center.x) * 0.01 * depth : 0
        const py = active ? ((mouse?.y ?? center.y) - center.y) * 0.006 * depth : 0
        return (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              textShadow: '0 1px 0 rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,255,255,0.06)',
              WebkitTextStroke: '0.3px rgba(0,0,0,0.35)'
            }}
            animate={{ x: px, y: py }}
            transition={{ duration: 0.2 }}
          >
            {ch}
          </motion.span>
        )
      })}
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
