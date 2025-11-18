import { useState } from 'react'
import OpeningRitual from './components/OpeningRitual'
import Hero from './components/Hero'
import Philosophy from './components/Philosophy'
import SinsPreview from './components/SinsPreview'

function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div className="bg-black text-white min-h-screen font-[Lora]">
      {!entered && <OpeningRitual onEnter={() => setEntered(true)} />}

      {/* Main Experience */}
      <Hero />
      <Philosophy />
      <SinsPreview />

      {/* Final CTA (lightweight intro) */}
      <section className="relative bg-black py-24 px-6 text-center">
        <h3 className="text-3xl md:text-5xl tracking-[0.15em] text-[#D4AF37]">EMBRACE YOUR SIN</h3>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">Join the enlightened. Indulge in luxury.</p>
        <button className="mt-8 inline-flex items-center gap-2 text-sm tracking-[0.25em] text-black bg-[#D4AF37] rounded-full px-8 py-4 hover:brightness-110">
          SHOP THE COLLECTION
        </button>
      </section>
    </div>
  )
}

export default App
