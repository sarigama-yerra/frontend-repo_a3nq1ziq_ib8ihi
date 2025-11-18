import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Simple canvas smoke particles (cheap, tasteful)
function SmokeBackground() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 40 + Math.random() * 80,
      a: 0.04 + Math.random() * 0.06,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.1 + Math.random() * 0.2,
      o: 0.05 + Math.random() * 0.12,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -p.r) p.x = w + p.r
        if (p.x > w + p.r) p.x = -p.r
        if (p.y < -p.r) p.y = h + p.r
        if (p.y > h + p.r) p.y = -p.r

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        grad.addColorStop(0, `rgba(180,180,200,${p.o})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      animRef.current = requestAnimationFrame(draw)
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', onResize)
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default function OpeningRitual({ onEnter }) {
  const [show, setShow] = useState(true)

  const handleEnter = () => {
    setShow(false)
    setTimeout(() => onEnter && onEnter(), 700)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <SmokeBackground />

          {/* Film grain overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)' }} />

          <div className="relative h-full flex items-center justify-center text-center p-6">
            <div>
              <motion.h1
                className="text-[44px] md:text-[72px] font-semibold text-[#D4AF37] tracking-wide"
                style={{ textShadow: '0 0 20px rgba(212,175,55,0.35)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.33,1,0.68,1] }}
              >
                Ready to indulge in sin?
              </motion.h1>

              <motion.p
                className="mt-4 text-zinc-300/80 text-base md:text-lg max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                An immersive fragrance ritual awaits.
              </motion.p>

              <motion.button
                onClick={handleEnter}
                className="mt-10 inline-flex items-center gap-3 px-8 py-4 text-sm md:text-base tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/60 rounded-full hover:border-[#D4AF37] hover:text-white relative group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 50px rgba(212,175,55,0.3) inset' }} />
                <span className="relative z-10">ENTER</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
