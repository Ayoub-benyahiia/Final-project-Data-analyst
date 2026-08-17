import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/80 to-white relative overflow-hidden text-center border-t border-slate-100">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100/70 text-blue-700 border border-blue-200">
          <Sparkles size={12} />
          Accès Immédiat
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Commence à explorer le marché IT maintenant
        </h2>

        <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto font-normal">
          Rejoignez des milliers de développeurs et étudiants qui utilisent TechJob Analytics pour guider leur carrière tech au Maroc.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-extrabold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Explorer le dashboard</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
