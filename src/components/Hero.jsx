import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-[100vh] overflow-hidden bg-black">
      {/* Background gradient + subtle particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,0,0,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(75,0,130,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(28,77,44,0.18),transparent_50%)]" />

      {/* Logo */}
      <div className="absolute top-8 left-0 right-0 mx-auto w-full text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-semibold tracking-[0.2em] text-[#D4AF37]"
          style={{ textShadow: '0 0 30px rgba(212,175,55,0.35)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          ELANOR
        </motion.h1>
      </div>

      {/* Tagline */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="mt-6 text-zinc-200/90 text-lg md:text-2xl tracking-[0.08em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Seven Sins. Seven Scents. One Obsession.
        </motion.p>
        <motion.p
          className="mt-4 text-zinc-400 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          Luxury niche fragrances born from mythology.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 flex flex-col items-center text-[#D4AF37]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          <div className="w-[1px] h-8 bg-[#D4AF37]/60 mb-2 overflow-hidden relative">
            <motion.span
              className="absolute left-0 right-0 mx-auto w-[1px] bg-[#D4AF37]"
              initial={{ top: -16, opacity: 0 }}
              animate={{ top: 32, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{ height: '16px' }}
            />
          </div>
          <span className="text-xs tracking-[0.3em]">DESCEND</span>
        </motion.div>
      </div>

      {/* Placeholder for 3D bottles: elegant orbs for now */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-[12%] w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(139,0,0,0.35), rgba(0,0,0,0))' }} />
        <div className="absolute top-1/4 right-[15%] w-36 h-36 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(28,77,44,0.35), rgba(0,0,0,0))' }} />
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(75,0,130,0.35), rgba(0,0,0,0))' }} />
        <div className="absolute top-[55%] left-[30%] w-24 h-24 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), rgba(0,0,0,0))' }} />
      </div>
    </section>
  )
}
