import { motion } from 'framer-motion'

const cards = [
  {
    key: 'wrath',
    color: '#8B0000',
    title: 'WRATH',
    feels: 'Heart pounding. Fists clenched. The metallic taste of rage building before eruption.',
    smells: 'Electric Spark Accord (static energy) · Smoldering Incense · Charred Leather · Burnt Wires · Blood Orange fury',
    pleasure: 'Unleashing controlled violence. Wearing your anger like armor.'
  },
  {
    key: 'envy',
    color: '#1C4D2C',
    title: 'ENVY',
    feels: 'The cold stab of wanting what they have. Green-eyed obsession coiling in your chest.',
    smells: 'Shattered Glass Accord (bitter cold) · Poison Hemlock · Serpentine Vetiver · Toxic Absinthe · Root Cellar secrets',
    pleasure: 'Coveting freely. Admitting you want to take what\'s theirs.'
  },
  {
    key: 'lust',
    color: '#C41E3A',
    title: 'LUST',
    feels: 'Raw hunger without apology. Primal desire that devours reason.',
    smells: 'Bleeding Roses · Primal Musk · Dark Chocolate seduction · Animalic leather · Flesh-warm amber',
    pleasure: 'Indulging appetite. Wanting without shame.'
  },
  {
    key: 'greed',
    color: '#B8860B',
    title: 'GREED',
    feels: 'The glint of gold. Clutching treasures tighter. Never satisfied, always wanting more.',
    smells: 'Molten Gold Accord (liquid warmth) · Hoarded Amber · Stolen Sandalwood · Liquid Honey excess · Caramelized opulence',
    pleasure: 'Keeping what\'s yours. Accumulating without end. Twelve-hour longevity because you deserve to possess it all day.'
  },
  {
    key: 'gluttony',
    color: '#4B0082',
    title: 'GLUTTONY',
    feels: 'One more bite. One more sip. Overflowing plates and insatiable appetite.',
    smells: 'Warm Milk Accord (comfort) · Rum-soaked decadence · Caramelized Praline · Spiced Liqueur · Vanilla excess',
    pleasure: 'Indulging until sated, then indulging more. Gourmand hedonism.'
  },
  {
    key: 'sloth',
    color: '#6b7280',
    title: 'SLOTH',
    feels: 'Surrendering to stillness. Letting the world burn while you rest. Opiate calm.',
    smells: 'Lavender haze · Opium dreams · Wilted Poppy · Lazy Vanilla · Weightless musk',
    pleasure: 'Choosing rest over hustle. Productivity can wait.'
  },
  {
    key: 'pride',
    color: '#D4AF37',
    title: 'PRIDE',
    feels: 'The peacock\'s tail spread. Looking down from your throne. Knowing you\'re superior.',
    smells: 'Burning Wood Accord (raw power) · King\'s Chamber incense · Regal Jasmine · Worn Leather Gloves (command) · Golden Amber',
    pleasure: 'Owning your superiority. Wearing your crown unapologetically.'
  }
]

export default function SynestheticExperience() {
  return (
    <section className="relative w-full min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-[Cinzel] tracking-wide font-semibold">Scent as Sensation</h2>
          <p className="mt-3 text-lg md:text-2xl italic text-zinc-200 font-semibold">We don't make perfumes. We bottle emotions.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.article
              key={c.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative border border-white/10 rounded-xl p-5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] hover:border-white/20 transition-colors"
              style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 10px 30px ${c.color}15` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="tracking-[0.2em] text-sm uppercase text-zinc-200 font-semibold">{c.title}</h3>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              </div>

              <div className="space-y-2 text-sm text-zinc-200">
                <p className="uppercase tracking-wide text-xs text-zinc-400 font-semibold">What {c.title} feels like</p>
                <p className="leading-relaxed font-semibold">{c.feels}</p>
              </div>

              <div className="space-y-2 text-sm text-zinc-200 mt-4">
                <p className="uppercase tracking-wide text-xs text-zinc-400 font-semibold">What {c.title} smells like</p>
                <p className="leading-relaxed font-semibold">{c.smells}</p>
              </div>

              <div className="space-y-2 text-sm text-zinc-200 mt-4">
                <p className="uppercase tracking-wide text-xs text-zinc-400 font-semibold">The Guilty Pleasure</p>
                <p className="leading-relaxed font-semibold">{c.pleasure}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
