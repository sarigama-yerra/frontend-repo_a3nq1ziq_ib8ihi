import React from 'react'

const SinModule = ({ name, palette = '#000', family, notes = [], myth, poem = [] }) => {
  return (
    <section
      className="w-full min-h-screen flex items-center justify-center py-24 px-6"
      style={{ background: `linear-gradient(180deg, ${palette} 0%, #000 100%)` }}
    >
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-4xl md:text-6xl tracking-widest font-semibold mb-6">{name}</h2>
          {family && (
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-300 mb-2">{family}</p>
          )}
          {notes && notes.length > 0 && (
            <p className="text-neutral-200 mb-6">Notes: {notes.join(' • ')}</p>
          )}
          {myth && <p className="text-neutral-300 leading-relaxed mb-8">{myth}</p>}
        </div>
        <div className="border-l border-white/10 pl-6">
          {poem && poem.length > 0 && (
            <div className="space-y-2 italic text-neutral-200">
              {poem.map((line, idx) => (
                <p key={idx} className="text-lg">{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SinModule
