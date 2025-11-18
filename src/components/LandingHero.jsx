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

  // Screen 2: Strict, in-sequence brand reveal
  const controlsLeft = useAnimation()
  const controlsRight = useAnimation()
  const controlsMono = useAnimation()

  const s2InView = useInView(s2Ref, { amount: 0.6 })
  const [seqStarted, setSeqStarted] = useState(false)
  const [phase, setPhase] = useState('idle') // idle -> intro -> lineTop -> cut -> split -> divider -> quote

  useEffect(() => {
    if (!s2InView || seqStarted) return
    setSeqStarted(true)

    // reset to initial state
    setPhase('intro')
    controlsMono.set({ opacity: 0 })
    controlsLeft.set({ x: 0 })
    controlsRight.set({ x: 0 })

    // Step 1: ELANOR fades in over 1.5s, hold 0.5s
    controlsMono.start({ opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } })

    const t1 = setTimeout(() => setPhase('lineTop'), 2000) // 0-2.0s
    const t2 = setTimeout(() => setPhase('cut'), 2500)     // 2.0-2.5s
    const t3 = setTimeout(() => setPhase('split'), 3500)   // 2.5-3.5s
    const t4 = setTimeout(() => setPhase('divider'), 4500) // 3.5-4.5s
    const t5 = setTimeout(() => setPhase('quote'), 5000)   // 4.5-5.0s

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [s2InView, seqStarted, controlsMono, controlsLeft, controlsRight])

  useEffect(() => {
    if (phase === 'split') {
      // Hide full word so halves are clean
      controlsMono.start({ opacity: 0, transition: { duration: 0.05 } })
      controlsLeft.start({ x: -200, transition: { duration: 1.0, ease: 'easeOut' } })
      controlsRight.start({ x: 200, transition: { duration: 1.0, ease: 'easeOut' } })
    }
  }, [phase, controlsLeft, controlsRight, controlsMono])

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

      {/* Screen 2: Brand Reveal with strict sequence */}
      <section ref={s2Ref} className="relative min-h-screen grid place-items-center overflow-hidden bg-black">
        <Grain />
        <Embers count={3} intensity={0.6} />
        <motion.div style={{ y: driftY, opacity: fadeOut }} className="relative w-full max-w-[1200px] mx-auto px-6 text-center select-none">
          <div className="relative inline-block">
            {/* Full wordmark (fades in during intro; hidden when splitting) */}
            <motion.div animate={controlsMono} className="relative z-[1]">
              <Wordmark />
            </motion.div>

            {/* Split halves shown from split onward */}
            <div className="pointer-events-none absolute inset-0 z-[2]">
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: phase === 'split' || phase === 'divider' || phase === 'quote' ? 1 : 0 }}
                transition={{ duration: 0.12 }}
              >
                {/* Left half */}
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} animate={controlsLeft}>
                  <div className="absolute inset-0 flex justify-center">
                    <Wordmark />
                  </div>
                </motion.div>
                {/* Right half */}
                <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 0 0 50%)' }} animate={controlsRight}>
                  <div className="absolute inset-0 flex justify-center">
                    <Wordmark />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Red blade/line element following sequence */}
            <AnimatePresence>
              {(phase === 'lineTop' || phase === 'cut' || phase === 'split' || phase === 'divider' || phase === 'quote') && (
                <motion.div
                  key="blade"
                  className="absolute z-[3]"
                  initial={{ opacity: 0 }}
                  animate={(() => {
                    if (phase === 'lineTop') {
                      // Horizontal line near top
                      return {
                        opacity: 1,
                        top: -50, // 50px above wordmark container top
                        left: '50%',
                        x: '-50%',
                        y: 0,
                        width: '40%',
                        height: 2,
                        rotate: 0,
                      }
                    }
                    if (phase === 'cut' || phase === 'split') {
                      // Vertical line through center, full height
                      return {
                        opacity: 1,
                        top: 0,
                        left: '50%',
                        x: '-50%',
                        y: 0,
                        width: 2,
                        height: '100%',
                        rotate: 90,
                      }
                    }
                    // Divider: horizontal full-width centered
                    return {
                      opacity: 1,
                      top: '50%',
                      left: '50%',
                      x: '-50%',
                      y: '-50%',
                      width: '100%',
                      height: 2,
                      rotate: 0,
                    }
                  })()}
                  transition={{ duration: phase === 'lineTop' ? 0.5 : (phase === 'cut' ? 1.0 : 0.5), ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(to bottom, rgba(139,0,0,0), rgba(139,0,0,0.95), rgba(139,0,0,0))' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Quote below divider */}
          <AnimatePresence>
            {phase === 'quote' && (
              <motion.div key="copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }} className="mt-10">
                <p className="text-zinc-100 italic font-semibold" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)' }}>
                  Seven scents. Seven temptations. Unapologetically yours.
                </p>
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
    const blink = setInterval(() => setCursor(v => !v), 600)
    return () => { clearTimeout(start); clearInterval(blink) }
  }, [text])
  return (
    <span className="font-semibold">
      {shown}
      <span className="inline-block w-[0.6ch]">{cursor ? '_' : ' '}</span>
    </span>
  )
}

// Refined ELANOR wordmark with letterpress feel
function Wordmark() {
  const letters = 'ELANOR'.split('')
  return (
    <div className="font-[Cinzel] tracking-[0.12em] leading-none" style={{ fontSize: 'clamp(140px, 14vw, 180px)', color: '#F5F3F0' }}>
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            textShadow: '0 1px 0 rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,255,255,0.06)',
            WebkitTextStroke: '0.3px rgba(0,0,0,0.35)'
          }}
        >
          {ch}
        </span>
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
