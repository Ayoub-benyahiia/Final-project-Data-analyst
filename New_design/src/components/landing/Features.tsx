import React from 'react';
import { BarChart3, Puzzle, GitBranch, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Features() {
  const navigate = useNavigate();

  const featuresList = [
    {
      title: 'Analyse de marché en temps réel',
      description: 'Explorez la répartition des contrats, les salaires estimés, les niveaux d’expérience et les tendances historiques 2016-2025.',
      icon: BarChart3,
      iconBg: 'bg-blue-50 text-blue-600',
      path: '/dashboard/analysis',
    },
    {
      title: 'Stack Matcher intelligent',
      description: 'Entrez vos technologies et découvrez immédiatement votre taux de couverture du marché marocain et le ROI des compétences à acquérir.',
      icon: Puzzle,
      iconBg: 'bg-cyan-50 text-cyan-600',
      path: '/dashboard/matcher',
    },
    {
      title: 'Skill Pairings & Synergies',
      description: 'Découvrez les technologies les plus fréquemment demandées ensemble et anticipez les exigences des offres d’emploi tech.',
      icon: GitBranch,
      iconBg: 'bg-emerald-50 text-emerald-600',
      path: '/dashboard/skills/pairings',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 mb-4">
            <Sparkles size={12} />
            Fonctionnalités Clés
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            La plateforme la plus complète pour décrypter le marché IT
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-normal">
            Conçue pour transformer des milliers d'offres d'emploi brutes en décisions de carrière et de recrutement éclairées.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: 3 Feature Items */}
          <div className="lg:col-span-6 space-y-8">
            {featuresList.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  onClick={() => navigate(feature.path)}
                  className="group flex gap-5 p-6 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${feature.iconBg} shadow-2xs group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Dashboard Mockup Card */}
          <div className="lg:col-span-6">
            <div className="p-4 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-50 via-blue-50/50 to-cyan-50/40 border border-slate-200/80 shadow-xl relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-lg space-y-6 relative z-10">
                {/* Header row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Aperçu Analytique Live</span>
                    <span className="text-[10px] text-slate-400 font-mono">Requêtes in-memory &lt;15ms</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    DuckDB Engine
                  </span>
                </div>

                {/* 3 Mini KPI Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Offres</span>
                    <span className="text-base font-black text-slate-900">10,782</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Entreprises</span>
                    <span className="text-base font-black text-blue-600">2,767</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Villes</span>
                    <span className="text-base font-black text-cyan-600">155</span>
                  </div>
                </div>

                {/* Mini Bar Chart Preview */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Concentration Géographique des Postes</span>
                  <div className="space-y-2">
                    {[
                      { city: 'Casablanca', pct: 88, label: '5,942 offres (55.1%)', color: 'bg-blue-600' },
                      { city: 'Rabat - Salé', pct: 64, label: '2,810 offres (26.0%)', color: 'bg-cyan-500' },
                      { city: 'Tanger - Tétouan', pct: 38, label: '954 offres (8.8%)', color: 'bg-indigo-500' },
                      { city: 'Marrakech', pct: 22, label: '480 offres (4.5%)', color: 'bg-emerald-500' },
                    ].map((item) => (
                      <div key={item.city} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                          <span>{item.city}</span>
                          <span className="font-mono text-slate-400">{item.label}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Explorer le Dashboard Complet</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
