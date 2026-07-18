import { Star } from 'lucide-react';
import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto border-t-4 border-zinc-950" id="testimonials">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block mb-2 font-mono">Empirical Proof</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-zinc-950 tracking-tight max-w-xl leading-none">
            Loved by builders, recruiters, and CTOs.
          </h2>
        </div>
        <div className="max-w-md">
          <p className="text-zinc-800 text-base leading-relaxed font-bold">
            From negotiating five-figure salary increases to saving millions in regional headquarter expansions, here is how tech leaders leverage TechJob Analytics.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div 
            key={idx} 
            className="bg-cream p-6 border-bold rounded-lg shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-hard transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Stars & Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-600 text-rose-600" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-zinc-950 text-sm font-black leading-relaxed mb-6 font-serif">
                "{t.quote}"
              </blockquote>
            </div>

            {/* Profile Info */}
            <div>
              <div className="border-t-2 border-zinc-950 mb-5"></div>
              
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border-bold text-zinc-950 flex items-center justify-center text-xs font-black tracking-wider shrink-0 shadow-hard-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">{t.name}</h4>
                    <p className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider font-mono">{t.role}</p>
                    <span className="text-[10px] font-extrabold text-zinc-800 font-serif">{t.company}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-0">
                  {t.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-wider bg-sand text-zinc-950 px-2.5 py-0.5 rounded border-bold-thin font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
