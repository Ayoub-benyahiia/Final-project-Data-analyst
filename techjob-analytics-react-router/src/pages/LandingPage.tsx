import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  MapPin,
  GitMerge,
  Menu,
  X,
  ChevronRight,
  Terminal,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f3f1] text-[#242424] font-mono antialiased selection:bg-[#cfdaf5] selection:text-[#2b59d1]">
      
      {/* ─────────────────────────────────────────────────────────────
          00 — ANNOUNCEMENT BAR (Full-width Black Bar per DESIGN.md)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#000000] text-[#f6f3f1] font-mono text-xs py-2.5 px-4 sm:px-6 select-none border-b border-[#242424]">
        <div className="max-w-[1432px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a7fccd]" />
            <span className="uppercase tracking-wider truncate">
              Morocco Tech Labor Market Intelligence • 2026 Live Dataset
            </span>
          </div>
          <Link
            to="/dashboard"
            className="flex-shrink-0 rounded-full border border-[#f6f3f1] px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider text-[#f6f3f1] hover:bg-[#f6f3f1] hover:text-[#000000] transition-colors"
          >
            Launch Platform ▸
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          01 — NAVIGATION (Airy Editorial on Parchment)
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#f6f3f1]/95 backdrop-blur-md border-b border-[#cecac8] transition-all">
        <div className="mx-auto flex h-20 max-w-[1432px] items-center justify-between px-6 sm:px-10 lg:px-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1] transition-transform duration-200 group-hover:scale-105">
              <TrendingUp className="h-4.5 w-4.5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[16px] font-normal tracking-[-0.02em] text-[#242424]">
                TechJob <span className="text-[#4e4d4d]">Analytics</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#797776] -mt-0.5">
                Market Intelligence
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#4e4d4d]">
            <Link to="/dashboard" className="hover:text-[#242424] transition-colors">
              Market Overview
            </Link>
            <Link to="/dashboard/analysis" className="hover:text-[#242424] transition-colors">
              Insights
            </Link>
            <Link to="/dashboard/skills/catalog" className="hover:text-[#242424] transition-colors">
              Skills Taxonomy
            </Link>
            <Link to="/dashboard/matcher" className="hover:text-[#242424] transition-colors">
              Stack Matcher
            </Link>
          </nav>

          {/* Right Action: Primary Pill Button (Lake Blue) */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/dashboard"
              className="text-xs font-mono uppercase tracking-wider text-[#4e4d4d] hover:text-[#242424] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#2b59d1] px-6 py-3 text-xs font-mono uppercase tracking-wider text-white transition-all hover:bg-[#244cb5] group"
            >
              <span>Explore Market</span>
              <span className="text-white group-hover:translate-x-0.5 transition-transform">▸</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#cecac8] bg-[#f6f3f1] text-[#242424]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#cecac8] bg-[#f6f3f1] px-6 py-6 space-y-4 font-mono text-xs uppercase tracking-wider">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#4e4d4d] hover:text-[#242424] py-1.5"
            >
              Market Overview
            </Link>
            <Link
              to="/dashboard/analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#4e4d4d] hover:text-[#242424] py-1.5"
            >
              Detailed Analysis
            </Link>
            <Link
              to="/dashboard/matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#4e4d4d] hover:text-[#242424] py-1.5"
            >
              Stack Matcher
            </Link>
            <Link
              to="/dashboard/skills/pairings"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#4e4d4d] hover:text-[#242424] py-1.5"
            >
              Skill Pairings
            </Link>
            <Link
              to="/dashboard/skills/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#4e4d4d] hover:text-[#242424] py-1.5"
            >
              Skills Catalog
            </Link>
            <div className="pt-3 border-t border-[#cecac8]">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#2b59d1] py-3 text-xs font-mono uppercase tracking-wider text-white shadow-sm"
              >
                <span>Explore Market</span>
                <span>▸</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          02 — HERO: Typographic Editorial Composition
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden border-b border-[#cecac8]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Editorial Monumental Stance */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Signal Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 py-1.5 text-xs font-mono text-[#242424]">
                <span className="h-2 w-2 rounded-full bg-[#a7fccd] border border-[#242424]/20" />
                <span className="uppercase tracking-wider text-[11px] text-[#797776]">Live Market Intelligence</span>
                <span className="text-[#cecac8]">•</span>
                <span className="text-[11px] font-medium text-[#242424]">2026 Dataset</span>
              </div>

              {/* Monumental Headline in Untitled Serif 400 (Never Bold) */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[72px] font-normal tracking-[-0.02em] leading-[1.08] text-[#242424]">
                The intelligence layer for Morocco&apos;s tech job market.
              </h1>

              {/* Subtitle in Diatype Mono */}
              <p className="font-mono text-base sm:text-lg text-[#4e4d4d] leading-relaxed max-w-xl">
                Real hiring data. Technology demand. Skills intelligence. One unified analytical view of Morocco&apos;s technology employment ecosystem.
              </p>

              {/* Pill CTAs: Lake Blue Primary + Ghost Secondary */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b59d1] px-8 py-4 text-xs font-mono uppercase tracking-wider text-white shadow-ambient transition-all hover:bg-[#244cb5] group"
                >
                  <span>Explore the Market</span>
                  <span className="group-hover:translate-x-1 transition-transform">▸</span>
                </Link>

                <a
                  href="#where"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#242424] bg-transparent px-8 py-4 text-xs font-mono uppercase tracking-wider text-[#242424] hover:bg-[#242424] hover:text-[#f6f3f1] transition-all"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Live Metadata Footer */}
              <div className="pt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-mono text-[#797776] border-t border-[#cecac8]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#242424]" />
                  <span>2,767 ACTIVE EMPLOYERS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#242424]" />
                  <span>27 MOROCCAN CITIES</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2b59d1]" />
                  <span>121 TECHNICAL SKILLS</span>
                </div>
              </div>

            </div>

            {/* Right: Elevated Feature Card (Periwinkle Mist Surface) */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[40px] border border-[#a0b5eb] bg-[#cfdaf5] p-6 sm:p-10 space-y-6">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-[#a0b5eb] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1]">
                      <Terminal className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#242424] font-medium">
                      MARKET SIGNAL / MOROCCO / 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#a7fccd] border border-[#242424]/30" />
                    <span className="rounded-full bg-[#f6f3f1] border border-[#a0b5eb] px-2.5 py-0.5 text-[10px] font-mono text-[#242424]">
                      LIVE FEED
                    </span>
                  </div>
                </div>

                {/* Primary Aggregated Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#f6f3f1] border border-[#a0b5eb] p-5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#797776]">
                      Total Analyzed Postings
                    </div>
                    <div className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.02em] text-[#242424] tabular-nums mt-1">
                      10,782
                    </div>
                    <div className="text-[10px] text-[#797776] mt-1 font-mono">
                      ● 100% Real Records
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#f6f3f1] border border-[#a0b5eb] p-5 flex flex-col justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#797776]">
                      10-Yr Posting Volume
                    </div>
                    <div className="h-10 mt-1 flex items-end">
                      <svg viewBox="0 0 120 36" className="w-full h-9 overflow-visible">
                        <path
                          d="M 0,30 Q 25,28 45,20 T 85,12 T 120,6"
                          fill="none"
                          stroke="#242424"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="120" cy="6" r="3.5" fill="#2b59d1" stroke="#242424" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="text-[9px] text-[#797776] font-mono">
                      2016 → 2026 Trajectory
                    </div>
                  </div>
                </div>

                {/* Top Technology Demand Signals */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#4e4d4d]">
                    <span>Top Technology Signals</span>
                    <span>Market Share</span>
                  </div>

                  {/* Java */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-medium text-[#242424]">Java / Enterprise</span>
                      <span className="text-[#242424]">2,391 jobs (22.18%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f6f3f1] overflow-hidden">
                      <div className="h-full rounded-full bg-[#2b59d1]" style={{ width: "22.18%" }} />
                    </div>
                  </div>

                  {/* Scrum */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-medium text-[#242424]">Scrum / Agile Methodology</span>
                      <span className="text-[#242424]">2,283 jobs (21.17%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f6f3f1] overflow-hidden">
                      <div className="h-full rounded-full bg-[#242424]" style={{ width: "21.17%" }} />
                    </div>
                  </div>

                  {/* SQL */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-medium text-[#242424]">SQL / Relational DBs</span>
                      <span className="text-[#242424]">1,878 jobs (17.42%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f6f3f1] overflow-hidden">
                      <div className="h-full rounded-full bg-[#797776]" style={{ width: "17.42%" }} />
                    </div>
                  </div>
                </div>

                {/* Regional Concentration Strip */}
                <div className="border-t border-[#a0b5eb] pt-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <MapPin className="h-4 w-4" />
                    <span>Casablanca Tech Hub:</span>
                  </div>
                  <span className="text-xs font-medium text-[#2b59d1] bg-[#f6f3f1] px-3 py-1 rounded-full border border-[#a0b5eb]">
                    5,482 Postings (50.84%)
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03 — MARKET SIGNAL STRIP (Full-Width Editorial Stat Bar)
          ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#cecac8] bg-[#f6f3f1] py-12">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#cecac8]">
            
            {/* Metric 1 */}
            <div className="py-4 md:py-0 md:px-8 first:pl-0 space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#242424] tabular-nums">
                10,782+
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                Postings Analyzed
              </div>
            </div>

            {/* Metric 2 */}
            <div className="py-4 md:py-0 md:px-8 space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#242424] tabular-nums">
                2,767
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                Active Employers
              </div>
            </div>

            {/* Metric 3 */}
            <div className="py-4 md:py-0 md:px-8 space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#242424] tabular-nums">
                27
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                Moroccan Cities
              </div>
            </div>

            {/* Metric 4 */}
            <div className="py-4 md:py-0 md:px-8 last:pr-0 space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#242424] tabular-nums">
                121
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                Technical Skills
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04 — SECTION: WHERE (Regional Concentration)
          ───────────────────────────────────────────────────────────── */}
      <section id="where" className="py-24 sm:py-32 border-b border-[#cecac8] bg-[#f6f3f1]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Editorial Story */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                01 / Regional Concentration
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-tight text-[#242424]">
                Where is tech hiring actually happening?
              </h2>

              <p className="font-mono text-base text-[#4e4d4d] leading-relaxed">
                Morocco&apos;s technology recruitment market is heavily concentrated across a small number of economic hubs. Casablanca leads with over half of all digital hiring volume, followed by Rabat as the primary institutional and telecom center.
              </p>

              <div className="space-y-3 pt-2 text-xs font-mono text-[#4e4d4d]">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#2b59d1]" />
                  <span className="text-[#242424] font-medium">Casablanca: 5,482 jobs (50.84%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#242424]" />
                  <span>Rabat: 2,341 jobs (21.71%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#797776]" />
                  <span>Secondary: Fès (782), Marrakech (612), Tanger (240)</span>
                </div>
              </div>
            </div>

            {/* Right: Regional Instrument Card */}
            <div className="lg:col-span-7">
              <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-10 space-y-5">
                
                <div className="flex items-center justify-between border-b border-[#cecac8] pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#242424]">
                    Top Regional Tech Hubs
                  </span>
                  <span className="text-xs font-mono text-[#797776]">2026 Dataset</span>
                </div>

                {/* Ranked Bars */}
                <div className="space-y-4 font-mono text-xs">
                  
                  {/* Casablanca */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#242424]">Casablanca</span>
                      <span className="text-[#2b59d1] bg-[#cfdaf5] px-2.5 py-0.5 rounded-full border border-[#a0b5eb]">
                        5,482 jobs (50.8%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#2b59d1]" style={{ width: "70%" }} />
                    </div>
                  </div>

                  {/* Rabat */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#242424]">Rabat</span>
                      <span className="text-[#242424]">2,341 jobs (21.7%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#242424]" style={{ width: "30%" }} />
                    </div>
                  </div>

                  {/* Fès */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4e4d4d]">Fès</span>
                      <span className="text-[#4e4d4d]">782 jobs (7.3%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#797776]" style={{ width: "10%" }} />
                    </div>
                  </div>

                  {/* Marrakech */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4e4d4d]">Marrakech</span>
                      <span className="text-[#4e4d4d]">612 jobs (5.7%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#797776]" style={{ width: "7.8%" }} />
                    </div>
                  </div>

                  {/* Tanger */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4e4d4d]">Tanger</span>
                      <span className="text-[#4e4d4d]">240 jobs (2.2%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#797776]" style={{ width: "3.1%" }} />
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          05 — SECTION: WHAT (Technology Demand)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 border-b border-[#cecac8] bg-[#f6f3f1]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Technology Ranking Instrument */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-10 space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#242424]">
                    Top Demanded Tech Stack Taxonomy
                  </span>
                  <span className="text-xs font-mono text-[#797776]">Top 10 of 121 Skills</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  
                  {/* Java */}
                  <div className="rounded-2xl border border-[#a0b5eb] bg-[#cfdaf5] p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-[#242424]">01. Java</div>
                      <div className="text-[10px] text-[#4e4d4d]">Enterprise Backend</div>
                    </div>
                    <span className="text-xs font-medium text-[#2b59d1] bg-[#f6f3f1] px-2 py-0.5 rounded-full border border-[#a0b5eb]">
                      2,391 (22.2%)
                    </span>
                  </div>

                  {/* Scrum */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">02. Scrum / Agile</div>
                      <div className="text-[10px] text-[#797776]">Methodology</div>
                    </div>
                    <span className="text-[#242424]">
                      2,283 (21.2%)
                    </span>
                  </div>

                  {/* SQL */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">03. SQL</div>
                      <div className="text-[10px] text-[#797776]">Database</div>
                    </div>
                    <span className="text-[#242424]">1,878 (17.4%)</span>
                  </div>

                  {/* REST API */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">04. REST API</div>
                      <div className="text-[10px] text-[#797776]">Architecture</div>
                    </div>
                    <span className="text-[#242424]">1,405 (13.0%)</span>
                  </div>

                  {/* Linux */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">05. Linux</div>
                      <div className="text-[10px] text-[#797776]">Infrastructure</div>
                    </div>
                    <span className="text-[#242424]">1,262 (11.7%)</span>
                  </div>

                  {/* Oracle */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">06. Oracle DB</div>
                      <div className="text-[10px] text-[#797776]">Database</div>
                    </div>
                    <span className="text-[#242424]">1,250 (11.6%)</span>
                  </div>

                  {/* Git */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">07. Git</div>
                      <div className="text-[10px] text-[#797776]">DevOps / VCS</div>
                    </div>
                    <span className="text-[#242424]">1,241 (11.5%)</span>
                  </div>

                  {/* JavaScript */}
                  <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] p-3 flex justify-between items-center">
                    <div>
                      <div className="text-[#242424]">08. JavaScript</div>
                      <div className="text-[10px] text-[#797776]">Frontend & Web</div>
                    </div>
                    <span className="text-[#242424]">1,212 (11.2%)</span>
                  </div>

                </div>

              </div>
            </div>

            {/* Right: Editorial Story */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                02 / Technology Demand
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-tight text-[#242424]">
                What are companies actually asking for?
              </h2>

              <p className="font-mono text-base text-[#4e4d4d] leading-relaxed">
                Enterprise hiring demand is concentrated around a relatively small set of technologies, revealing the practical stack employers repeatedly request across banking, consulting, and offshore engineering centers.
              </p>

              <div className="pt-2">
                <Link
                  to="/dashboard/skills/catalog"
                  className="inline-flex items-center gap-2 rounded-full border border-[#242424] px-6 py-3 text-xs font-mono uppercase tracking-wider text-[#242424] hover:bg-[#242424] hover:text-[#f6f3f1] transition-all"
                >
                  <span>Explore full 121-skill catalog</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          06 — SECTION: HOW (Skill Co-occurrence Network)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 border-b border-[#cecac8] bg-[#f6f3f1]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Editorial Story */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
                03 / Skill Co-occurrence Network
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-tight text-[#242424]">
                How does the market connect skills?
              </h2>

              <p className="font-mono text-base text-[#4e4d4d] leading-relaxed">
                Skills rarely appear in isolation. TechJob maps the technologies that repeatedly occur together across job postings, identifying companion dependencies and stack synergies.
              </p>

              <div className="rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6 space-y-2 text-xs font-mono">
                <div className="text-[#242424] font-medium">Anchor Analysis: React (1,142 Postings)</div>
                <p className="text-[#4e4d4d] leading-relaxed">
                  More than 51% of React job opportunities simultaneously demand TypeScript proficiency, proving that modern frontend hiring in Morocco is typed by default.
                </p>
              </div>
            </div>

            {/* Right: Skill Pairing Network Graph */}
            <div className="lg:col-span-7">
              <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-10 space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#cecac8] pb-4">
                  <div className="flex items-center gap-2">
                    <GitMerge className="h-4 w-4 text-[#242424]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#242424]">
                      Anchor Skill: React (1,142 Postings)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#797776]">Co-occurrence Index</span>
                </div>

                {/* Analytical Relationship Bars */}
                <div className="space-y-4 font-mono text-xs">
                  
                  {/* React + TypeScript */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#242424]">React + TypeScript (Top Companion)</span>
                      <span className="text-[#2b59d1] bg-[#cfdaf5] px-2.5 py-0.5 rounded-full border border-[#a0b5eb]">
                        584 jobs (51.1%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#2b59d1]" style={{ width: "51.1%" }} />
                    </div>
                  </div>

                  {/* React + JavaScript */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#242424]">React + JavaScript</span>
                      <span className="text-[#242424]">482 jobs (42.2%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#242424]" style={{ width: "42.2%" }} />
                    </div>
                  </div>

                  {/* React + Node.js */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4e4d4d]">React + Node.js</span>
                      <span className="text-[#4e4d4d]">398 jobs (34.9%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#cecac8]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[#797776]" style={{ width: "34.9%" }} />
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          07 — DARK DATA INTERLUDE (Off-Black Surface #242424)
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#242424] text-[#f6f3f1] py-24 sm:py-32">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#a0b5eb]">
                ● Live Market Signal
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] leading-[1.08] text-[#f6f3f1]">
                Read the market before you move with it.
              </h2>
              <p className="font-mono text-base sm:text-lg text-[#cecac8] max-w-xl leading-relaxed">
                Every percentage, volume signal and ranking is calculated from structured job-market data. No sentiment estimates. No guesswork.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4 text-center font-mono">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-normal text-white">10,782+</div>
                <div className="text-[11px] text-[#cecac8] uppercase tracking-wider">POSTINGS</div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-normal text-[#a7fccd]">27</div>
                <div className="text-[11px] text-[#cecac8] uppercase tracking-wider">CITIES</div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-normal text-[#a0b5eb]">121</div>
                <div className="text-[11px] text-[#cecac8] uppercase tracking-wider">TECH SKILLS</div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-normal text-white">100%</div>
                <div className="text-[11px] text-[#cecac8] uppercase tracking-wider">DATA-DRIVEN</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          08 — PRODUCT SHOWCASE (DuckDB Preview Window)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-36 border-b border-[#cecac8] bg-[#f6f3f1]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
              Product Showcase
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] leading-tight text-[#242424]">
              One market. Five intelligence layers.
            </h2>
            <p className="font-mono text-base text-[#4e4d4d]">
              A unified analytical platform built directly over Morocco&apos;s technology job market.
            </p>
          </div>

          {/* Product Window with 40px radius */}
          <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-10 space-y-6">
            
            {/* Window Frame Bar */}
            <div className="flex items-center justify-between border-b border-[#cecac8] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#cecac8]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#cecac8]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#cecac8]" />
                <span className="ml-3 text-xs font-mono text-[#797776]">
                  techjob.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#242424]">
                <span className="h-2 w-2 rounded-full bg-[#a7fccd]" />
                <span>Live DuckDB Analytical Engine</span>
              </div>
            </div>

            {/* Dashboard Sample Top KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-[28px] border border-[#a0b5eb] bg-[#cfdaf5] p-6">
                <div className="text-[10px] font-mono text-[#4e4d4d] uppercase tracking-wider">Total Job Postings</div>
                <div className="font-serif text-3xl font-normal mt-1 text-[#242424]">10,782</div>
                <div className="text-[11px] font-mono text-[#4e4d4d] mt-2">● aggregated records</div>
              </div>

              <div className="rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6">
                <div className="text-[10px] font-mono text-[#797776] uppercase tracking-wider">Active Employers</div>
                <div className="font-serif text-3xl font-normal mt-1 text-[#242424]">2,767</div>
                <div className="text-[11px] font-mono text-[#797776] mt-2">● hiring organizations</div>
              </div>

              <div className="rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6">
                <div className="text-[10px] font-mono text-[#797776] uppercase tracking-wider">Regional Coverage</div>
                <div className="font-serif text-3xl font-normal mt-1 text-[#242424]">27 Cities</div>
                <div className="text-[11px] font-mono text-[#797776] mt-2">● Moroccan tech hubs</div>
              </div>

              <div className="rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6">
                <div className="text-[10px] font-mono text-[#797776] uppercase tracking-wider">Avg. Experience</div>
                <div className="font-serif text-3xl font-normal mt-1 text-[#242424]">3.0 Years</div>
                <div className="text-[11px] font-mono text-[#797776] mt-2">● required seniority</div>
              </div>
            </div>

            {/* Dashboard Visual Body Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-8 rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6 space-y-3">
                <div className="flex justify-between text-xs font-mono text-[#242424]">
                  <span>Historical Job Market Trend (2016–2026)</span>
                  <span className="text-[#797776]">Volume Signal</span>
                </div>
                <div className="h-28 flex items-end">
                  <svg viewBox="0 0 300 70" className="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="monadLakeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2b59d1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2b59d1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,60 Q 50,55 90,40 T 170,25 T 250,15 T 300,10 L 300,70 L 0,70 Z"
                      fill="url(#monadLakeGrad)"
                    />
                    <path
                      d="M 0,60 Q 50,55 90,40 T 170,25 T 250,15 T 300,10"
                      fill="none"
                      stroke="#2b59d1"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-6 flex flex-col justify-between">
                <div className="text-xs font-mono text-[#242424]">Contract Distribution</div>
                <div className="flex items-center justify-center py-2">
                  <div className="h-20 w-20 rounded-full border-8 border-[#242424] border-r-[#2b59d1] flex items-center justify-center font-mono font-medium text-xs">
                    89.9%
                  </div>
                </div>
                <div className="text-[11px] font-mono text-center text-[#797776]">
                  ● CDI (89.9%) ● Stage (3.0%)
                </div>
              </div>
            </div>

            {/* Bottom CTA Action: Primary Lake Blue Pill */}
            <div className="pt-4 flex justify-end">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#2b59d1] px-8 py-4 text-xs font-mono uppercase tracking-wider text-white shadow-ambient hover:bg-[#244cb5] transition-all group"
              >
                <span>Launch Full Intelligence Platform</span>
                <span className="group-hover:translate-x-1 transition-transform">▸</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          09 — FIVE INTELLIGENCE MODULES (Vertical Editorial Index)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 border-b border-[#cecac8] bg-[#f6f3f1]">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#797776]">
              System Architecture
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.02em] text-[#242424]">
              Five specialized intelligence modules.
            </h2>
          </div>

          {/* Vertical Navigator List */}
          <div className="divide-y divide-[#cecac8] border-y border-[#cecac8]">
            
            {/* Module 01 */}
            <Link
              to="/dashboard"
              className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#cecac8]/15 px-4 -mx-4 rounded-3xl transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-xs font-mono text-[#797776] group-hover:text-[#242424]">
                  01
                </span>
                <div>
                  <div className="font-serif text-xl font-normal text-[#242424]">
                    Market Overview
                  </div>
                  <div className="text-xs font-mono text-[#4e4d4d] mt-1">
                    Macro market signals. 10-year posting trajectory, contract breakdown, top demanded skills, and regional hubs.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]">
                <span className="text-[#797776] group-hover:text-[#242424]">Launch</span>
                <ChevronRight className="h-4 w-4 text-[#2b59d1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 02 */}
            <Link
              to="/dashboard/analysis"
              className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#cecac8]/15 px-4 -mx-4 rounded-3xl transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-xs font-mono text-[#797776] group-hover:text-[#242424]">
                  02
                </span>
                <div>
                  <div className="font-serif text-xl font-normal text-[#242424]">
                    Detailed Analysis
                  </div>
                  <div className="text-xs font-mono text-[#4e4d4d] mt-1">
                    Workplace and hiring structure. Top hiring roles, company leaderboards, and full analytical dataset.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]">
                <span className="text-[#797776] group-hover:text-[#242424]">Launch</span>
                <ChevronRight className="h-4 w-4 text-[#2b59d1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 03 */}
            <Link
              to="/dashboard/matcher"
              className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#cecac8]/15 px-4 -mx-4 rounded-3xl transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-xs font-mono text-[#797776] group-hover:text-[#242424]">
                  03
                </span>
                <div>
                  <div className="font-serif text-xl font-normal text-[#242424]">
                    Stack Matcher
                  </div>
                  <div className="text-xs font-mono text-[#4e4d4d] mt-1">
                    Measure technology stack compatibility. Vectorized match score, matched job titles, and missing skills.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]">
                <span className="text-[#797776] group-hover:text-[#242424]">Launch</span>
                <ChevronRight className="h-4 w-4 text-[#2b59d1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 04 */}
            <Link
              to="/dashboard/skills/pairings"
              className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#cecac8]/15 px-4 -mx-4 rounded-3xl transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-xs font-mono text-[#797776] group-hover:text-[#242424]">
                  04
                </span>
                <div>
                  <div className="font-serif text-xl font-normal text-[#242424]">
                    Skill Pairings
                  </div>
                  <div className="text-xs font-mono text-[#4e4d4d] mt-1">
                    Discover companion technologies that move together. Co-occurrence frequencies and affinity lift metrics.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]">
                <span className="text-[#797776] group-hover:text-[#242424]">Launch</span>
                <ChevronRight className="h-4 w-4 text-[#2b59d1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 05 */}
            <Link
              to="/dashboard/skills/catalog"
              className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#cecac8]/15 px-4 -mx-4 rounded-3xl transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-xs font-mono text-[#797776] group-hover:text-[#242424]">
                  05
                </span>
                <div>
                  <div className="font-serif text-xl font-normal text-[#242424]">
                    Skills Catalog
                  </div>
                  <div className="text-xs font-mono text-[#4e4d4d] mt-1">
                    Complete skills taxonomy. 121 standardized hard technologies and 50 behavioral competencies.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]">
                <span className="text-[#797776] group-hover:text-[#242424]">Launch</span>
                <ChevronRight className="h-4 w-4 text-[#2b59d1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10 — FINAL CTA (Deep Off-Black Editorial Conclusion)
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#242424] text-[#f6f3f1] py-24 sm:py-36">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
          
          <div className="space-y-4">
            <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-[-0.02em] leading-[1.08]">
              Stop guessing what the tech market wants. <br />
              <span className="text-[#a0b5eb]">Start reading the data.</span>
            </h2>
            <p className="font-mono text-base sm:text-lg text-[#cecac8] max-w-xl mx-auto">
              Direct, unfiltered intelligence on Moroccan technology employment.
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#2b59d1] px-10 py-4.5 text-xs font-mono uppercase tracking-wider text-white shadow-ambient hover:bg-[#244cb5] transition-all group"
            >
              <span>Explore TechJob</span>
              <span className="group-hover:translate-x-1 transition-transform">▸</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11 — FOOTER (Minimal Editorial Attribution)
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#cecac8] bg-[#f6f3f1] py-14">
        <div className="mx-auto max-w-[1432px] px-6 sm:px-10 lg:px-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1] text-xs">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-xs font-mono text-[#242424]">
                <span className="font-serif text-sm">TechJob Analytics</span> — Moroccan Tech Market Intelligence
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#797776]">
              <Link to="/dashboard" className="hover:text-[#242424] transition-colors">
                Market Overview
              </Link>
              <Link to="/dashboard/analysis" className="hover:text-[#242424] transition-colors">
                Insights
              </Link>
              <Link to="/dashboard/matcher" className="hover:text-[#242424] transition-colors">
                Stack Matcher
              </Link>
              <Link to="/dashboard/skills/catalog" className="hover:text-[#242424] transition-colors">
                Skills Taxonomy
              </Link>
            </div>
          </div>

          {/* Bottom Metadata */}
          <div className="border-t border-[#cecac8] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#797776] gap-2">
            <div>10,782 job postings • 27 Moroccan cities • 2026 dataset</div>
            <div>Powered by live DuckDB analytical OLAP engine</div>
          </div>

        </div>
      </footer>

    </div>
  );
}
