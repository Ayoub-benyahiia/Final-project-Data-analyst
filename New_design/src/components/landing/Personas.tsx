import React from 'react';
import { GraduationCap, Briefcase, Route, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Personas() {
  const navigate = useNavigate();

  const personasList = [
    {
      title: 'Étudiants & Fresh Grads',
      subtitle: 'Maximisez vos chances d’embauche dès la sortie d’école.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-50 text-emerald-600',
      benefits: [
        'Identifier les technologies junior-friendly',
        'Cibler les villes avec le plus d’offres débutants',
        'Comprendre les attentes en diplôme (Bac+2 à Bac+5)',
      ],
      cta: 'Explorer les offres juniors',
      path: '/dashboard?experience=Junior',
    },
    {
      title: 'Juniors & Confirmés (0–3 ans)',
      subtitle: 'Accélérez votre évolution de carrière et votre salaire.',
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
      benefits: [
        'Mesurer la couverture marché de votre stack actuel',
        'Découvrir les compétences manquantes à plus fort ROI',
        'Voir les entreprises qui recrutent votre profil exact',
      ],
      cta: 'Analyser mon stack technique',
      path: '/dashboard/matcher',
    },
    {
      title: 'Reconversion & Switchers',
      subtitle: 'Pivotez sereinement vers les métiers tech les plus porteurs.',
      icon: Route,
      iconBg: 'bg-cyan-50 text-cyan-600',
      benefits: [
        'Cartographier les passerelles de compétences',
        'Comprendre les synergies entre technologies',
        'Éviter d’apprendre des stacks en déclin sur le marché',
      ],
      cta: 'Simuler une transition',
      path: '/dashboard/matcher',
    },
  ];

  return (
    <section className="py-24 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono block mb-2">
            Orienté Impact
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Des solutions pour tous les profils tech
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-normal">
            Que vous prépariez votre premier stage ou votre prochaine montée en séniorité, accédez aux bonnes données.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personasList.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${persona.iconBg} shadow-xs`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {persona.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 font-normal">
                    {persona.subtitle}
                  </p>

                  <div className="space-y-3 mb-8 border-t border-slate-100 pt-6">
                    {persona.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(persona.path)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-200 hover:border-transparent text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-2xs"
                >
                  <span>{persona.cta}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Personas;
