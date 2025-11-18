import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function LandingIntro() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const leftX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const rightX = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bg = useTransform(scrollYProgress, [0, 1], ['#000000', '#210000'])

  return (
    <section ref={ref} className="relative min-h-[120vh] overflow-hidden" style={{ background: bg }}>
      {/* Split skull halves */}
      <motion.div className="absolute left-0 top-0 bottom-0 w-1/2 grid place-items-center" style={{ x: leftX }}>
        <HalfSkull side="left" />
      </motion.div>
      <motion.div className="absolute right-0 top-0 bottom-0 w-1/2 grid place-items-center" style={{ x: rightX }}>
        <HalfSkull side="right" />
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

function HalfSkull({ side }) {
  const flip = side === 'right' ? 'scaleX(-1)' : undefined
  return (
    <svg width="420" height="420" viewBox="0 0 560 560" style={{ transform: flip }} className="opacity-70">
      <g fill="none" stroke="#bcbcbc" strokeWidth="2">
        <path d="M280 60c-98 0-180 79-180 176 0 66 33 109 74 135 8 5 16 15 18 24l8 35c2 9 10 16 20 16h120c10 0 18-7 20-16l8-35c2-9 10-19 18-24 41-26 74-69 74-135 0-97-82-176-180-176z" />
      </g>
    </svg>
  )
}
