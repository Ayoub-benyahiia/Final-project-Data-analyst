import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      q: "D'où viennent les données ?",
      a: "Les données proviennent de 10,782 offres d'emploi IT réelles collectées et normalisées selon un Star Schema en fichiers Parquet (tables fact_offres, dim_tech, dim_city, dim_entreprise, etc.) et interrogées en mémoire via notre moteur DuckDB OLAP.",
    },
    {
      q: "À quelle fréquence les données sont-elles calculées ?",
      a: "Toutes les métriques, graphiques et scores de compatibilité sont calculés dynamiquement en temps réel avec un temps de réponse moyen inférieur à 15ms grâce à notre moteur vectorisé et notre système de mise en cache intelligente.",
    },
    {
      q: "Puis-je filtrer par ville, type de contrat ou niveau d'expérience ?",
      a: "Absolument. Une barre de filtres globale persistante en haut du dashboard vous permet de combiner simultanément 5 dimensions : Villes, Contrats (CDI, Freelance, Stage, etc.), Niveaux d'éducation, Niveaux d'expérience et Technologies cibles.",
    },
    {
      q: "Comment fonctionne le Stack Matcher ?",
      a: "Vous renseignez vos compétences ou choisissez un preset (MERN, Java Spring, .NET, Python Data). L'algorithme calcule votre taux d'adéquation sur l'ensemble du marché et identifie précisément les compétences manquantes qui débloqueront le plus d'opportunités d'embauche supplémentaires (ROI Booster).",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 mb-3">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mt-4">
            Tout ce que vous devez savoir sur la plateforme TechJob Analytics et le traitement des données.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs open:shadow-xl open:shadow-blue-500/5 open:border-blue-200 transition-all duration-200 cursor-pointer"
            >
              <summary className="flex items-center justify-between font-bold text-slate-900 text-base sm:text-lg list-none select-none">
                <span>{faq.q}</span>
                <span className="w-8 h-8 rounded-full bg-slate-50 group-open:bg-blue-50 flex items-center justify-center text-slate-400 group-open:text-blue-600 transition-colors shrink-0 ml-4">
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-2 border-t border-slate-100">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
