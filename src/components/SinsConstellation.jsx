import { useMemo } from 'react'
import { motion } from 'framer-motion'

const sins = [
  { key: 'wrath', name: 'WRATH', color: '#8B0000', notes: 'Leather · Blood Orange · Incense', desc: 'Vengeance incarnate. Leather, blood orange, smoldering incense.' },
  { key: 'envy', name: 'ENVY', color: '#1C4D2C', notes: 'Vetiver · Absinthe · Ivy', desc: 'Covetous desire. Serpentine green vetiver, bitter absinthe, ivy.' },
  { key: 'lust', name: 'LUST', color: '#C41E3A', notes: 'Red Rose · Musk · Dark Chocolate', desc: 'Raw seduction. Red roses, primal musk, dark chocolate.' },
  { key: 'pride', name: 'PRIDE', color: '#D4AF37', notes: 'Oud · Saffron · Amber', desc: 'Gilded arrogance. Royal oud, burnished saffron, amber fire.' },
  { key: 'greed', name: 'GREED', color: '#B8860B', notes: 'Rum · Tobacco · Vanilla', desc: 'Hoarded pleasure. Spiced rum, golden tobacco, dark vanilla.' },
  { key: 'gluttony', name: 'GLUTTONY', color: '#4B0082', notes: 'Plum · Patchouli · Honey', desc: 'Decadent hunger. Black plum, velveteen patchouli, wild honey.' },
  { key: 'sloth', name: 'SLOTH', color: '#6b7280', notes: 'Iris · Cashmere · Sandalwood', desc: 'Hypnotic languor. Powdered iris, cashmere skin, pale sandalwood.' },
]

export default function SinsConstellation({ onSelect }) {
  const positions = useMemo(() => {
    // Arrange in a heptagram-like radial layout
    const r = 220
    const cx = 0
    const cy = 0
    return sins.map((s, i) => {
      const a = (i / sins.length) * Math.PI * 2 - Math.PI / 2
      return { ...s, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, idx: i }
    })
  }, [])

  return (
    <section id="constellation" className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 grid place-items-center">
        <motion.svg width="100%" height="100%" viewBox="-400 -400 800 800">
          {/* Subtle aurora background */}
          <defs>
            <radialGradient id="a" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="rgba(196,30,58,0.12)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect x="-400" y="-400" width="800" height="800" fill="url(#a)" />

          {/* Connecting lines */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
            {positions.map((a, i) => (
              positions.map((b, j) => (
                i < j ? (
                  <motion.line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={{ opacity: 0.18 }} />
                ) : null
              ))
            ))}
          </g>

          {/* Nodes with staggered materialization */}
          {positions.map((s) => (
            <Portal key={s.key} sin={s} onSelect={onSelect} />
          ))}
        </motion.svg>
      </div>
      <div className="absolute bottom-8 inset-x-0 text-center text-sm text-zinc-400">Click a sin to descend</div>
    </section>
  )
}

function Portal({ sin, onSelect }) {
  const hover = {
    scale: 1.1,
    filter: `drop-shadow(0 0 30px ${sin.color}55)`
  }
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: sin.idx * 0.3 }}
      whileHover={hover}
      onClick={() => onSelect && onSelect(sin.key)}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={sin.x} cy={sin.y} r={56} fill="rgba(0,0,0,0.6)" stroke={sin.color} strokeWidth="2" />
      <text x={sin.x} y={sin.y - 68} textAnchor="middle" fontSize="12" fill="#bbb" style={{ letterSpacing: '0.25em' }}>{sin.name}</text>
      <text x={sin.x} y={sin.y + 78} textAnchor="middle" fontSize="10" fill="#9aa" opacity="0.8">{sin.notes}</text>
      <motion.circle cx={sin.x} cy={sin.y} r={38} fill="none" stroke={sin.color} strokeWidth="1" style={{
        filter: `drop-shadow(0 0 10px ${sin.color}aa)`,
      }} />
      <motion.text x={sin.x} y={sin.y + 100} textAnchor="middle" fontSize="11" fill={sin.color} initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
        <tspan>{sin.desc}</tspan>
      </motion.text>
    </motion.g>
  )
}
