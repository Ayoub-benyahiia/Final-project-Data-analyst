import { Check, ShieldCheck, Sparkles, Gift, Heart, Database, ArrowRight } from 'lucide-react';

interface PricingProps {
  onExplore?: () => void;
}

export default function Pricing({ onExplore }: PricingProps) {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto" id="pricing">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block mb-2 font-mono">
          Public Good & Open Intelligence
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-black text-zinc-950 tracking-tight leading-none">
          100% Free, Unlimited Market Access
        </h2>
        <p className="text-zinc-800 font-bold mt-4 text-lg">
          No credit cards, no premium paywalls, no trial expirations. Explore the complete Moroccan IT tech-salary dataset with absolute freedom.
        </p>
      </div>

      {/* Main Free Feature Showcase Box */}
      <div className="bg-sand border-bold rounded-lg p-8 md:p-12 shadow-hard relative overflow-hidden max-w-4xl mx-auto">
        {/* Accent Tag */}
        <div className="absolute top-0 right-0 bg-zinc-950 text-rose-500 text-[10px] uppercase font-mono font-black tracking-widest px-5 py-2 border-b-2 border-l-2 border-zinc-950 rounded-bl-lg flex items-center gap-1.5 animate-pulse">
          <Gift className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
          <span>Permanently Unlocked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          {/* Left Column: Big Statement */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded border-bold-thin">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span className="text-xs font-black text-zinc-950 font-mono uppercase tracking-wider">Community Initiative</span>
            </div>
            
            <h3 className="text-3xl font-serif font-black text-zinc-950 leading-tight">
              Empowering Moroccan Tech Talent
            </h3>
            
            <p className="text-xs text-zinc-800 leading-relaxed font-semibold">
              We believe salary transparency should be a fundamental utility. By making this platform 100% free, we enable software engineers, developers, and local tech builders to negotiate from a position of data-backed confidence.
            </p>

            <div className="pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 bg-zinc-950 text-white border-bold font-extrabold px-5 py-3 rounded text-xs transition-all shadow-hard-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Explore Live Datasets</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Key Features Unlocked */}
          <div className="md:col-span-3 bg-white border-bold rounded-lg p-6 md:p-8 shadow-hard-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 font-mono mb-6">
              All Premium Features Included
            </h4>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-950 font-bold">
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Unlimited Queries</strong> across all 10,782+ records
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Multi-Variable Filters</strong> (Location, Exp, Contract)
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Historical Data</strong> spanning 2016 - 2026 rolling trends
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Unlimited CSV Exports</strong> & formatted PDF reports
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Salary Grids</strong> with precise standard deviations
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-950 font-black">Interactive ROI Tools</strong> for team building budgets
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust guarantees bar */}
      <div className="mt-16 bg-cream border-bold rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-hard-sm max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6.5 h-6.5 text-rose-600 shrink-0" />
          <div className="text-left">
            <h4 className="text-xs font-black text-zinc-950 uppercase tracking-wider font-mono">
              Enterprise Grade Security & Compliance
            </h4>
            <p className="text-[11px] text-zinc-800 font-semibold leading-relaxed">
              We never scrape individual user profiles or expose personal contact info. Mapped indices strictly track raw public postings.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-950">
          <div className="flex items-center gap-1.5 bg-white border-bold-thin px-3 py-1.5 rounded text-[10px] font-mono font-black uppercase">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>100% Free Tool</span>
          </div>
        </div>
      </div>
    </section>
  );
}
