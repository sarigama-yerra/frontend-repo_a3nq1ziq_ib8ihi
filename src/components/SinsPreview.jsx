import { motion } from 'framer-motion'

const sins = [
  { name: 'WRATH', color: '#8B0000', notes: 'Dark leather • Incense • Blood orange' },
  { name: 'ENVY', color: '#1C4D2C', notes: 'Vetiver • Green fig • Serpent\'s musk' },
  { name: 'LUST', color: '#C41E3A', notes: 'Bulgarian rose • Amber skin • Velvet musk' },
  { name: 'GLUTTONY', color: '#D4AF37', notes: 'Vanilla • Dark chocolate • Fig syrup' },
  { name: 'GREED', color: '#D4AF37', notes: 'Oud gold • Saffron • Liquid amber' },
  { name: 'PRIDE', color: '#4B0082', notes: 'Iris • Cashmere wood • White musk' },
  { name: 'SLOTH', color: '#9CA3AF', notes: 'Lavender • Cotton musk • Sandalwood' },
]

export default function SinsPreview() {
  return (
    <section className="relative bg-black text-zinc-100 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl md:text-5xl tracking-[0.15em] text-[#D4AF37] mb-12">THE SEVEN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sins.map((s, i) => (
            <motion.div
              key={s.name}
              className="relative p-6 border border-zinc-800/80 rounded-xl bg-zinc-900/40 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${s.color}55, transparent)` }} />
              <h3 className="text-2xl font-semibold tracking-[0.15em]" style={{ color: s.color }}>{s.name}</h3>
              <p className="mt-3 text-sm text-zinc-400">{s.notes}</p>
              <button className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D4AF37] border border-[#D4AF37]/60 rounded-full px-4 py-2 hover:border-[#D4AF37]">
                DISCOVER {s.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
