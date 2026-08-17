import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Code2, TrendingUp, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?technologies=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Blurred Gradient Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-cyan-400/20 to-indigo-400/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-48 -right-24 w-[350px] h-[350px] bg-cyan-400/15 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-48 -left-24 w-[350px] h-[350px] bg-blue-500/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-xs mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span>10,782+ offres IT analysées au Maroc</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Décrypte le{' '}
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 bg-clip-text text-transparent">
            marché IT
          </span>{' '}
          au Maroc
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Analyse en temps réel des compétences demandées, des entreprises qui recrutent et des opportunités par ville.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white border-2 border-slate-200/90 hover:border-blue-500 focus-within:border-blue-600 rounded-2xl shadow-xl shadow-blue-500/5 p-2 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une technologie (ex: React, Spring Boot, Docker, Python)..."
              className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              <span>Explorer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600 font-medium mb-16">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 shadow-2xs">
            <MapPin size={14} className="text-blue-600" />
            <span><strong>155</strong> Villes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 shadow-2xs">
            <Code2 size={14} className="text-cyan-600" />
            <span><strong>Java</strong> #1 Skill (22.2%)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 shadow-2xs">
            <TrendingUp size={14} className="text-emerald-600" />
            <span><strong>79.5%</strong> Télétravail & Flex</span>
          </div>
        </div>

        {/* Centerpiece Floating Mockups */}
        <div className="relative max-w-5xl mx-auto pt-6">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl -z-10 rounded-3xl" />

          {/* Left Floating Card (Hidden on Mobile) */}
          <div className="hidden lg:block absolute -left-12 top-20 z-20 w-72 bg-white rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-900/10 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900">Stack Java / Spring</span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">+24.7% YoY</span>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Java Core</span>
                  <span className="font-semibold">2,392 offres</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Spring Boot</span>
                  <span className="font-semibold">1,840 offres</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full w-[68%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Microservices</span>
                  <span className="font-semibold">1,210 offres</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full w-[52%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Main Dashboard Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/10 overflow-hidden text-left relative z-10 transition-transform hover:-translate-y-1 duration-300">
            {/* Browser Chrome Header */}
            <div className="bg-slate-50/90 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-white px-4 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                techjob-analytics.ma/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Dashboard Inner Preview */}
            <div className="p-4 sm:p-8 bg-slate-50/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">Total Offres</span>
                  <span className="text-lg sm:text-2xl font-black text-slate-900">10,782</span>
                </div>
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">Entreprises</span>
                  <span className="text-lg sm:text-2xl font-black text-slate-900">2,767</span>
                </div>
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">Top Ville</span>
                  <span className="text-base sm:text-xl font-extrabold text-blue-600">Casablanca</span>
                </div>
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">Top Skill</span>
                  <span className="text-base sm:text-xl font-extrabold text-cyan-600">Java / Spring</span>
                </div>
              </div>

              {/* Chart Mockup */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Top Technologies en Demande</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">DuckDB OLAP Engine</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Java', count: '2,392', pct: '85%', color: 'bg-blue-600' },
                    { label: 'JavaScript / React', count: '2,140', pct: '76%', color: 'bg-cyan-500' },
                    { label: 'SQL & Data', count: '1,980', pct: '70%', color: 'bg-emerald-500' },
                    { label: 'Python', count: '1,650', pct: '58%', color: 'bg-indigo-500' },
                    { label: 'PHP / Symfony', count: '1,420', pct: '50%', color: 'bg-amber-500' },
                  ].map((tech) => (
                    <div key={tech.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{tech.label}</span>
                        <span className="font-mono text-slate-500">{tech.count} offres</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`${tech.color} h-2 rounded-full`} style={{ width: tech.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Card (Hidden on Mobile) */}
          <div className="hidden lg:block absolute -right-12 top-28 z-20 w-72 bg-white rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-900/10 transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Top Recruteurs</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Actifs</span>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'Sofrecom Maroc', jobs: '342 offres' },
                { name: 'Capgemini TS', jobs: '198 offres' },
                { name: 'Alten Delivery', jobs: '156 offres' },
                { name: 'CGI Technologies', jobs: '124 offres' },
              ].map((co) => (
                <div key={co.name} className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="font-medium text-slate-800">{co.name}</span>
                  </div>
                  <span className="font-mono text-slate-500 font-semibold">{co.jobs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
