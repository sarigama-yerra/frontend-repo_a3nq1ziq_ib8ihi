import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function LandingIntro() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const leftX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const rightX = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const bg = useTransform(scrollYProgress, [0, 1], ['#000000', '#210000'])

  return (
    <section ref={ref} className="relative min-h-[120vh] overflow-hidden" style={{ background: bg }}>
      {/* Abstract veils instead of skulls to avoid repetition with hero */}
      <motion.div className="absolute left-0 top-0 bottom-0 w-1/2" style={{ x: leftX }}>
        <GradientVeil side="left" />
      </motion.div>
      <motion.div className="absolute right-0 top-0 bottom-0 w-1/2" style={{ x: rightX }}>
        <GradientVeil side="right" />
      </motion.div>

      {/* Center content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        <motion.h2 className="text-[64px] md:text-[120px] leading-none font-[Cinzel] tracking-[0.2em] text-white drop-shadow-[0_0_25px_rgba(212,175,55,0.15)]">
          ELANOR
        </motion.h2>
        <p className="mt-4 text-2xl md:text-3xl italic text-zinc-200">Seven Sins. Seven Scents. One Obsession.</p>
        <p className="mt-6 max-w-3xl mx-auto text-zinc-300/90 leading-relaxed">
          We craft niche fragrances for those who embrace the darkness within. Each scent embodies a deadly sin—complex, unapologetic, unforgettable. This is perfume as ritual, not commodity.
        </p>
      </div>

      {/* Subtle particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-10 top-1/3 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, rgba(139,0,0,0.5), transparent 60%)' }} />
        <div className="absolute right-10 bottom-10 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 60%)' }} />
      </div>
    </section>
  )
}

function GradientVeil({ side }) {
  const isRight = side === 'right'
  return (
    <div className={`relative h-full ${isRight ? 'ml-auto' : ''} w-full grid place-items-center`}>
      <div
        className="w-[90%] max-w-[520px] aspect-[3/4] rounded-[40%] blur-2xl opacity-70"
        style={{
          background: isRight
            ? 'conic-gradient(from 180deg at 50% 50%, rgba(212,175,55,0.18), rgba(0,0,0,0) 40%)'
            : 'conic-gradient(from 0deg at 50% 50%, rgba(139,0,0,0.25), rgba(0,0,0,0) 40%)',
          filter: 'drop-shadow(0 0 60px rgba(139,0,0,0.35))',
        }}
      />
      <div
        className="absolute w-[55%] max-w-[360px] aspect-square rounded-full mix-blend-screen opacity-30"
        style={{
          background: isRight
            ? 'radial-gradient(circle, rgba(212,175,55,0.25), rgba(0,0,0,0))'
            : 'radial-gradient(circle, rgba(75,0,130,0.25), rgba(0,0,0,0))',
          top: '20%',
        }}
      />
      <div
        className="absolute bottom-[15%] w-[40%] max-w-[280px] aspect-square rounded-full mix-blend-screen opacity-20"
        style={{
          background: isRight
            ? 'radial-gradient(circle, rgba(28,77,44,0.25), rgba(0,0,0,0))'
            : 'radial-gradient(circle, rgba(196,30,58,0.22), rgba(0,0,0,0))',
        }}
      />
    </div>
  )
}
