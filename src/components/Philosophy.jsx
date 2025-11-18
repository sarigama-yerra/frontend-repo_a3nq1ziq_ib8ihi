import { motion } from 'framer-motion'

export default function Philosophy() {
  return (
    <section className="relative bg-black text-zinc-200 py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-leather.png)' }} />
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.blockquote
          className="text-2xl md:text-4xl italic"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.33,1,0.68,1] }}
        >
          “Perfume is the art of memory and desire, where sin meets salvation.”
        </motion.blockquote>
        <motion.p
          className="mt-8 text-zinc-400 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Each Elanor fragrance is a descent into temptation, crafted from forbidden botanicals and ancient mythology. We don't create scents—we capture souls.
        </motion.p>
      </div>
      <div className="pointer-events-none absolute -left-20 top-10 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18), rgba(0,0,0,0))' }} />
    </section>
  )
}
