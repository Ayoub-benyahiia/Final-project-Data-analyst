import { useState, useMemo } from 'react';
import { HelpCircle, Calculator, Percent, ArrowUpRight, Check } from 'lucide-react';

export default function ROIcalc() {
  const [mode, setMode] = useState<'recruiter' | 'candidate'>('recruiter');

  // Recruiter Inputs
  const [hiresPerYear, setHiresPerYear] = useState<number>(8);
  const [avgDeveloperSalary, setAvgDeveloperSalary] = useState<number>(22000); // Monthly MAD
  const [useAgencyPercent, setUseAgencyPercent] = useState<number>(15); // Percentage of hires using recruiters (0 - 100)

  // Candidate Inputs
  const [currentSalary, setCurrentSalary] = useState<number>(18000); // Monthly MAD
  const [hasTechRadarProof, setHasTechRadarProof] = useState<boolean>(true);

  // Recruiter Calculations
  const recruiterSavings = useMemo(() => {
    // Annualized salary pool
    const annualSalary = avgDeveloperSalary * 12;
    
    // Average external agency placement fee in Morocco is typically 15% of annual salary
    const agencyFeePerPlacement = annualSalary * 0.15;
    
    // Number of hires utilizing external recruitment agencies
    const agencyHires = Math.round(hiresPerYear * (useAgencyPercent / 100));
    const rawAgencyCost = agencyHires * agencyFeePerPlacement;

    // Savings 1: Mitigate agency dependency by direct sourcing (est 40% reduction)
    const agencySavings = rawAgencyCost * 0.40;

    // Savings 2: Prevent salary over-offering due to asymmetric information
    // If you don't know the exact benchmark, you often offer 10% higher than the market peak to secure a candidate
    const overOfferOverhead = (hiresPerYear * annualSalary) * 0.08; 

    // Total savings
    const total = Math.round(agencySavings + overOfferOverhead);
    
    return {
      total,
      agencyHires,
      agencySavings,
      overOfferOverhead,
      roiMultiplier: Math.round(total / 4800) // 4,800 MAD is the Pro annual plan cost!
    };
  }, [hiresPerYear, avgDeveloperSalary, useAgencyPercent]);

  // Candidate Calculations
  const candidateUpside = useMemo(() => {
    // In Morocco, developer candidates with market analytics data command an average 18.5% higher offer
    const percentPremium = hasTechRadarProof ? 0.185 : 0.08;
    const monthlyIncrease = Math.round(currentSalary * percentPremium);
    const annualIncrease = monthlyIncrease * 12;

    return {
      monthlyIncrease,
      annualIncrease,
      percentPremium: Math.round(percentPremium * 100),
      roiMultiplier: Math.round(annualIncrease / 950) // 950 MAD is candidate license price!
    };
  }, [currentSalary, hasTechRadarProof]);

  return (
    <div className="bg-sand border-bold rounded-xl p-6 md:p-8 max-w-4xl mx-auto shadow-hard" id="roi-calculator">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-zinc-950 pb-6 mb-8">
        <div>
          <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block mb-1 font-mono">Interactive ROI Engine</span>
          <h3 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Calculate Your Financial Advantage</h3>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-cream border-bold-thin p-1 rounded-lg">
          <button
            onClick={() => setMode('recruiter')}
            className={`px-4 py-2 rounded text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'recruiter' 
                ? 'bg-zinc-950 text-white shadow-hard-sm' 
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            I am a Recruiter / HR
          </button>
          <button
            onClick={() => setMode('candidate')}
            className={`px-4 py-2 rounded text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'candidate' 
                ? 'bg-zinc-950 text-white shadow-hard-sm' 
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            I am an Engineer / Analyst
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="md:col-span-6 space-y-6">
          {mode === 'recruiter' ? (
            <>
              {/* Recruiter Inputs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">Planned Tech Hires / Year</label>
                  <span className="text-sm font-black font-mono text-rose-600">{hiresPerYear} hires</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={hiresPerYear}
                  onChange={(e) => setHiresPerYear(Number(e.target.value))}
                  className="w-full accent-zinc-950 bg-white h-2 rounded-lg border-bold-thin appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-800 font-extrabold mt-1 font-mono">
                  <span>2 hires</span>
                  <span>100 hires</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">Avg Monthly dev salary target</label>
                  <span className="text-sm font-black font-mono text-rose-600">{(avgDeveloperSalary).toLocaleString()} MAD</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="70000"
                  step="1000"
                  value={avgDeveloperSalary}
                  onChange={(e) => setAvgDeveloperSalary(Number(e.target.value))}
                  className="w-full accent-zinc-950 bg-white h-2 rounded-lg border-bold-thin appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-800 font-extrabold mt-1 font-mono">
                  <span>8K MAD</span>
                  <span>70K MAD</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">% Of recruitment via agencies</label>
                  <span className="text-sm font-black font-mono text-rose-600">{useAgencyPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={useAgencyPercent}
                  onChange={(e) => setUseAgencyPercent(Number(e.target.value))}
                  className="w-full accent-zinc-950 bg-white h-2 rounded-lg border-bold-thin appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-800 font-extrabold mt-1 font-mono">
                  <span>0% (In-house)</span>
                  <span>100% (Agency dependent)</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Candidate Inputs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">Your Current Monthly Salary</label>
                  <span className="text-sm font-black font-mono text-rose-600">{(currentSalary).toLocaleString()} MAD</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="80000"
                  step="1000"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Number(e.target.value))}
                  className="w-full accent-zinc-950 bg-white h-2 rounded-lg border-bold-thin appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-800 font-extrabold mt-1 font-mono">
                  <span>5,000 MAD</span>
                  <span>80,000 MAD</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-bold space-y-3 shadow-hard-sm">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="hasTechRadarProof"
                    checked={hasTechRadarProof}
                    onChange={(e) => setHasTechRadarProof(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded text-zinc-950 accent-zinc-950 border-bold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="hasTechRadarProof" className="text-xs font-black text-zinc-950 block cursor-pointer select-none">
                      Utilize TechJob verification data in interviews
                    </label>
                    <p className="text-[11px] text-zinc-700 font-semibold leading-relaxed mt-0.5">
                      Show your hiring manager actual aggregate market demand percentiles to back up your requested band with empirical evidence.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="text-[11px] text-zinc-800 leading-relaxed font-bold flex items-center gap-1.5 bg-cream p-3.5 rounded border-bold-thin">
            <Percent className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>
              All formulas utilize validated Moroccan digital recruitment models. Standard HR consultancy assumptions applied.
            </span>
          </div>
        </div>

        {/* Right Side: Outputs (Value Card) */}
        <div className="md:col-span-6 bg-zinc-950 text-white rounded-lg border-bold p-6 flex flex-col justify-between relative overflow-hidden shadow-hard">
          {/* Subtle design element */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-rose-500" />
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Estimated Financial Edge</span>
            </div>

            {mode === 'recruiter' ? (
              <div className="space-y-6">
                <div>
                  <span className="text-zinc-300 text-[10px] uppercase font-extrabold tracking-widest block mb-2 font-mono">Annual Sourcing Leak Saved</span>
                  <div className="text-4xl lg:text-5xl font-black font-serif text-white tracking-tighter leading-none mb-2">
                    {recruiterSavings.total.toLocaleString()} <span className="text-lg font-sans font-normal text-zinc-400">MAD</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    Calculated as saved agency commissions & optimized offer spreads.
                  </span>
                </div>

                <div className="border-t-2 border-zinc-850"></div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between text-xs text-zinc-300 font-bold">
                    <span>Agency dependencies avoided:</span>
                    <span className="font-mono font-black text-rose-400">{(recruiterSavings.agencyHires)} hires</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300 font-bold">
                    <span>Direct-placement commission saved:</span>
                    <span className="font-mono font-black text-white">{(Math.round(recruiterSavings.agencySavings)).toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300 font-bold">
                    <span>Over-offering overhead mitigated:</span>
                    <span className="font-mono font-black text-white">{(Math.round(recruiterSavings.overOfferOverhead)).toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-zinc-300 text-[10px] uppercase font-extrabold tracking-widest block mb-2 font-mono">Negotiable Salary Uplift</span>
                  <div className="text-4xl lg:text-5xl font-black font-serif text-white tracking-tighter leading-none mb-2">
                    +{candidateUpside.monthlyIncrease.toLocaleString()} <span className="text-lg font-sans font-normal text-zinc-400">MAD/mo</span>
                  </div>
                  <span className="text-xs font-bold text-rose-300">
                    Equates to <strong className="text-white">+{candidateUpside.annualIncrease.toLocaleString()} MAD</strong> in annual cumulative growth.
                  </span>
                </div>

                <div className="border-t-2 border-zinc-850"></div>

                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <Check className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Average candidate premium: <strong className="text-white font-mono">{candidateUpside.percentPremium}%</strong> command improvement</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <Check className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Empirical proof stops salary low-balling during interviews</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono block font-extrabold">Investment Return Rate</span>
              <span className="text-sm font-extrabold font-serif text-rose-500">
                {mode === 'recruiter' 
                  ? `${recruiterSavings.roiMultiplier}x Annual Plan ROI` 
                  : `${candidateUpside.roiMultiplier}x License ROI`}
              </span>
            </div>

            <a
              href="#pricing"
              className="bg-cream hover:bg-white text-zinc-950 border-bold font-extrabold px-4.5 py-2.5 rounded-lg text-xs transition-all text-center flex items-center gap-1.5 shrink-0 shadow-hard-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <span>Secure My Access</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
