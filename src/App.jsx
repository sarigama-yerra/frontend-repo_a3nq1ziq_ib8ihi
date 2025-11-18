import { useState } from 'react'
import LandingHero from './components/LandingHero'
import LandingIntro from './components/LandingIntro'
import SinsConstellation from './components/SinsConstellation'
import SinModule from './components/SinModule'

function App() {
  const [entered, setEntered] = useState(false)

  const handleSelectSin = (key) => {
    const el = document.getElementById(`sin-${key}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-black text-white min-h-screen font-[Lora]">
      {/* Opening experience */}
      {!entered && <LandingHero onDone={() => setEntered(true)} />}

      {/* Section 1: Brand Introduction split reveal */}
      <LandingIntro />

      {/* Section 2: Constellation grid */}
      <SinsConstellation onSelect={handleSelectSin} />

      {/* Section 3: Immersive Sin Showcase */}
      <div id="sin-wrath">
        <SinModule
          name="WRATH"
          palette="#1a0000"
          family="Oriental Leather"
          notes={["Leather", "Blood Orange", "Smoldering Incense"]}
          myth="Wrath channels Ares, god of war—each spray is armor for battle."
          poem={[
            'Steel in the pulse, ember in the throat,',
            'the night bends its knee to you.',
            'Smoke crowns your hunger as cities sleep,',
            'and you walk through the world unafraid.'
          ]}
        />
      </div>

      <div id="sin-envy">
        <SinModule
          name="ENVY"
          palette="#06140c"
          family="Green Chypre"
          notes={["Serpentine Vetiver", "Bitter Absinthe", "Ivy"]}
          myth="Envy coils like a whispered promise—emerald, cool, inevitable."
          poem={[
            'A garden behind glass, untouched, unreal,',
            'vine and shadow learning your name.',
          ]}
        />
      </div>

      <div id="sin-lust">
        <SinModule
          name="LUST"
          palette="#230106"
          family="Gourmand Floral"
          notes={["Red Roses", "Primal Musk", "Dark Chocolate"]}
          myth="Lust wears the night like silk and speaks in the language of heat."
          poem={[
            'The mouth remembers what the mind forgets,',
            'sugar on skin, velvet on breath.',
          ]}
        />
      </div>

      {/* Additional sections (Philosophy, Collection Experience, etc.) can follow */}
    </div>
  )
}

export default App
