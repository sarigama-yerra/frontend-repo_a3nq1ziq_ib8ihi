import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Check, Shield, Leaf, Package, RotateCcw, Star } from 'lucide-react'

function StarRating({ value = 4.8, reviews = 127 }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const filled = i < full || (i === full && half)
    return (
      <Star
        key={i}
        size={18}
        className={`transition-colors ${filled ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-zinc-600'}`}
      />
    )
  })
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">{stars}</div>
      <span className="text-sm text-zinc-400">{value.toFixed(1)} ({reviews} reviews)</span>
    </div>
  )
}

function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <Icon size={16} className="text-zinc-500" />
      <span>{label}</span>
    </div>
  )
}

function BottleViewer() {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    setTilt({ x, y })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative w-full h-[70vh] md:h-full flex items-center justify-center">
      {/* Ambient glows */}
      <div className="absolute -z-10 inset-0 opacity-40 pointer-events-none">
        <div className="absolute left-10 top-10 w-56 h-56 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,0,0,0.35), rgba(0,0,0,0))' }} />
        <div className="absolute right-10 bottom-14 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.30), rgba(0,0,0,0))' }} />
      </div>

      {/* Bottle silhouette card - placeholder for 3D */}
      <motion.div
        style={{ rotateX: tilt.y, rotateY: tilt.x }}
        className="relative w-[280px] md:w-[360px] h-[520px] md:h-[600px] rounded-[36px] bg-gradient-to-b from-zinc-900/70 to-black border border-zinc-800/70 shadow-2xl overflow-hidden"
      >
        {/* Glass sheen */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.08), transparent 40%)' }} />
        {/* Signature color aura */}
        <div className="absolute -inset-10 blur-2xl opacity-30" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(139,0,0,0.5), transparent 60%)' }} />

        {/* Label */}
        <div className="absolute left-1/2 -translate-x-1/2 top-24 w-[70%] h-44 border border-zinc-700/70 bg-black/60 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="tracking-[0.4em] text-xs text-[#D4AF37] font-[Cinzel]">ELANOR</div>
            <div className="mt-2 text-4xl md:text-5xl font-[Cinzel] tracking-[0.12em] text-white">WRATH</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.35em] text-zinc-400">extrait de Parfum</div>
          </div>
        </div>

        {/* Cap */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-40 h-12 rounded-t-[10px] bg-zinc-800 border border-zinc-700/70" />

        {/* Base shine */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-800/40 to-transparent" />
      </motion.div>
    </div>
  )
}

export default function ProductHero() {
  const [selectedSize, setSelectedSize] = useState('100ml')
  const [added, setAdded] = useState(false)
  const prices = { '50ml': 145, '100ml': 185, 'Discovery 5ml': 35 }

  const price = prices[selectedSize]
  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <section className="relative bg-black text-white pb-14">
      {/* Sticky header always visible */}
      <div className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/80 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-4 min-w-0">
            <span className="tracking-[0.4em] text-[10px] text-[#D4AF37] font-[Cinzel] shrink-0">ELANOR</span>
            <span className="text-lg md:text-xl font-[Cinzel] tracking-[0.12em] truncate">WRATH</span>
            <span className="hidden sm:inline text-sm text-zinc-400 truncate">extrait de Parfum</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
              <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span>4.8 (127)</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="size" className="sr-only">Select size</label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-zinc-900/80 border border-zinc-700 text-sm rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37]"
              >
                {Object.keys(prices).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="text-base md:text-lg font-medium tabular-nums">${price}</div>
            </div>
            <button
              onClick={handleAdd}
              className={`hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-sm border transition-all ${
                added ? 'bg-zinc-900 border-[#1C4D2C] text-[#1C4D2C]' : 'bg-black border-zinc-700 text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]'
              }`}
            >
              {added ? (
                <span className="inline-flex items-center gap-2"><Check size={16} /> Added</span>
              ) : (
                <span>Add to Sin Collection</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content wrapper with top padding to account for fixed header */}
      <div className="pt-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-start">
          {/* Left: 60% viewer */}
          <div className="md:col-span-3 order-2 md:order-1">
            <BottleViewer />
          </div>

          {/* Right: 40% info */}
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="space-y-5">
              <div>
                <h1 className="text-5xl md:text-6xl font-[Cinzel] tracking-[0.08em]">WRATH</h1>
                <div className="mt-1 text-sm uppercase tracking-[0.35em] text-zinc-400">extrait de Parfum</div>
              </div>

              <div className="flex items-center gap-3">
                <StarRating value={4.8} reviews={127} />
                <a href="#reviews" className="text-sm text-[#D4AF37] hover:underline">Read all reviews</a>
              </div>

              <div>
                <div className="text-3xl md:text-4xl">${price}</div>
                {selectedSize === '100ml' && (
                  <div className="text-sm text-zinc-400">or 4 payments of ${(price/4).toFixed(2)}</div>
                )}
              </div>

              <p className="italic text-zinc-300">“Unleash the fire of vengeance—dark leather, smoldering incense, blood orange.”</p>

              {/* Size selector */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Size</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: '50ml', price: 145 },
                    { label: '100ml', price: 185 },
                    { label: 'Discovery 5ml', price: 35 },
                  ].map((opt) => {
                    const active = selectedSize === opt.label
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedSize(opt.label)}
                        className={`relative p-4 border rounded-xl text-left transition-all ${
                          active ? 'border-[#D4AF37] bg-zinc-900/40' : 'border-zinc-800 bg-zinc-900/20'
                        } hover:shadow-[0_0_0_2px_rgba(212,175,55,0.15)]`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{opt.label}</div>
                            <div className="text-sm text-zinc-400">${opt.price}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border ${active ? 'border-[#D4AF37]' : 'border-zinc-600'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full m-[3px] ${active ? 'bg-[#D4AF37]' : 'bg-transparent'}`} />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Stock indicator */}
              <div className="text-sm text-red-600">Only 12 bottles remaining in this batch</div>

              {/* CTA */}
              <div>
                <button
                  onClick={handleAdd}
                  className={`w-full py-4 rounded-full text-center font-medium tracking-wide transition-all border ${
                    added ? 'bg-zinc-900 border-[#1C4D2C] text-[#1C4D2C]' : 'bg-black border-zinc-700 text-white hover:shadow-[0_0_35px_rgba(212,175,55,0.25)]'
                  }`}
                >
                  <AnimatePresence initial={false} mode="wait">
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center justify-center gap-2">
                        <Check size={18} /> Added
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center justify-center gap-2">
                        Add to Sin Collection
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-full border border-zinc-700 text-zinc-200 hover:bg-zinc-900/40">
                    <Heart size={18} /> Add to Wishlist
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-full border border-zinc-700 text-zinc-200 hover:bg-zinc-900/40">
                    <Sparkles size={18} /> Discover Your Sin Quiz
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-3">
                <TrustBadge icon={Leaf} label="Cruelty-Free" />
                <TrustBadge icon={Package} label="Limited Batch" />
                <TrustBadge icon={Shield} label="30-Day Returns" />
                <TrustBadge icon={RotateCcw} label="Hand-Blended" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
