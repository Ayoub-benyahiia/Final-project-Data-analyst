import React from 'react';

export function SocialProof() {
  const companies = [
    'SOFRECOM',
    'CAPGEMINI',
    'ALTEN MAROC',
    'ATOS',
    'CGI',
    'ATTIJARIWAFA',
    'SQLI',
    'WELINK',
    'MAROC TELECOM',
  ];

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono mb-8">
          Données analysées sur les offres de ces entreprises et plus de 2,700 recruteurs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {companies.map((company) => (
            <span
              key={company}
              className="text-slate-400/70 hover:text-slate-700 font-black text-sm sm:text-base md:text-lg tracking-wider transition-colors duration-200 cursor-default select-none"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialProof;
