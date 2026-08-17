import React from 'react';
import { ArrowRight, Sparkles, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DarkCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient Gradient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Accès gratuit — Données temps réel
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          Accède gratuitement aux données du marché IT
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Commence à explorer les offres, les entreprises et les compétences dès maintenant sans inscription requise.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-base font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/analysis')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 text-base font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer"
          >
            <Database size={18} className="text-cyan-400" />
            <span>Voir l'analyse détaillée</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default DarkCTA;
