import { motion } from 'framer-motion'

export default function SinModule({
  name,
  palette = '#000',
  family,
  notes = [],
  myth = '',
  poem = [],
  cta = 'Claim',
  image = 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
}) {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: palette }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.35), transparent 50%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          className="md:col-span-2"
        >
          <div className="relative">
            <img src={image} alt={`${name} bottle`} className="w-full h-[520px] object-cover rounded-[28px] shadow-2xl" />
            <div className="absolute -inset-6 rounded-[34px] blur-2xl opacity-40" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 60%)' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          className="md:col-span-3 text-white"
        >
          <h3 className="text-4xl md:text-6xl font-[Cinzel] tracking-[0.08em]">{name}</h3>
          <div className="mt-2 text-sm uppercase tracking-[0.3em] text-zinc-200/80">{family}</div>

          <ul className="mt-6 space-y-2 text-zinc-100">
            {notes.map((n, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-white/80" />
                <span>{n}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-zinc-200/90 italic">{myth}</p>
          <div className="mt-4 text-zinc-200/90">
            {poem.map((line, i) => (
              <p key={i} className="leading-relaxed">{line}</p>
            ))}
          </div>

          <button className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition">{cta} {name}</button>
        </motion.div>
      </div>
    </section>
  )
}
