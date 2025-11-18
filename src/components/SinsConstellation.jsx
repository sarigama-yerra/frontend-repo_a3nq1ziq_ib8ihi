import { useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

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
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const x = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const y = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const positions = useMemo(() => {
    // Arrange in a heptagram-like radial layout
    const r = 220
    const cx = 0
    const cy = 0
    return sins.map((s, i) => {
      const a = (i / sins.length) * Math.PI * 2 - Math.PI / 2
      return { ...s, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
    })
  }, [])

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 grid place-items-center" onMouseMove={handleMove}>
        <motion.svg width="100%" height="100%" viewBox="-400 -400 800 800" className="opacity-70">
          {/* Connecting lines */}
          <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
            {positions.map((a, i) => (
              positions.map((b, j) => (
                i < j ? (
                  <motion.line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    style={{
                      opacity: 0.2,
                    }}
                  />
                ) : null
              ))
            ))}
          </g>

          {/* Nodes */}
          {positions.map((s) => (
            <Portal key={s.key} sin={s} onSelect={onSelect} x={x} y={y} />
          ))}
        </motion.svg>
      </div>
      <div className="absolute bottom-8 inset-x-0 text-center text-sm text-zinc-400">Click a sin to descend</div>
    </section>
  )
}

function Portal({ sin, onSelect, x, y }) {
  const hover = {
    scale: 1.1,
    filter: `drop-shadow(0 0 30px ${sin.color}55)`
  }
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={hover}
      onClick={() => onSelect && onSelect(sin.key)}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={sin.x} cy={sin.y} r={56} fill="rgba(0,0,0,0.6)" stroke={sin.color} strokeWidth="2" />
      <text x={sin.x} y={sin.y - 68} textAnchor="middle" fontSize="12" fill="#bbb" style={{ letterSpacing: '0.25em' }}>{sin.name}</text>
      <text x={sin.x} y={sin.y + 78} textAnchor="middle" fontSize="10" fill="#9aa" opacity="0.8">{sin.notes}</text>
      <motion.circle cx={sin.x} cy={sin.y} r={38} fill="none" stroke={sin.color} strokeWidth="1" style={{
        filter: `drop-shadow(0 0 10px ${sin.color}aa)`,
        transform: 'rotate(0deg)'
      }} />
      <text x={sin.x} y={sin.y + 100} textAnchor="middle" fontSize="11" fill={sin.color} opacity="0">
        <tspan>{sin.desc}</tspan>
      </text>
    </motion.g>
  )
}
