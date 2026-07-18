import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Database, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  TrendingUp, 
  Building2, 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  Zap, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  FileSpreadsheet, 
  HelpCircle,
  Clock,
  Terminal,
  Activity,
  Award,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FaqSection from './components/FaqSection';
import TechJobDashboard from './components/TechJobDashboard';

const MICRO_STATS = [
  "Casablanca-Settat average senior salary leads at 31,000 MAD/month",
  "DevOps Framework volume grew +48.6% year-over-year in Rabat",
  "TypeScript/React accounts for 22.7% of all active frontend listings",
  "Deduplicated star schema database sync completed 2 hours ago",
  "Estimated average recruitment agency cost per placement is 33,000 MAD",
] as const;

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [scrolled, setScrolled] = useState(false);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Monitor scrolling to style the header glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % MICRO_STATS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (view === 'dashboard') {
    return (
      <TechJobDashboard 
        onBackToHome={() => setView('landing')} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-zinc-950 overflow-x-hidden selection:bg-rose-500 selection:text-white">
      
      {/* ═══════════════════════════════════════════════════════════
          SECTION 0 · PREMIUM NAVIGATION NAVBAR
          ═══════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-sand border-b-4 border-zinc-950 py-3 shadow-hard-sm' 
            : 'bg-sand/80 backdrop-blur-md border-b-2 border-zinc-950/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="group flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-zinc-950 border-bold-thin flex items-center justify-center text-white font-serif font-extrabold text-lg sm:text-xl group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="text-left leading-none">
              <span className="font-serif font-black text-zinc-950 tracking-tight text-lg sm:text-xl block">
                TechJob <span className="font-serif italic font-medium text-rose-600">Analytics</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono block mt-0.5">
                Moroccan IT Database
              </span>
            </div>
          </a>

          {/* Nav Jumps - Desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            <a href="#value-proposition" className="text-xs font-extrabold text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest">
              Target Personas
            </a>
            <a href="#testimonials" className="text-xs font-extrabold text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest">
              Testimonials
            </a>
            <a href="#pricing" className="text-xs font-extrabold text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest">
              Free Access
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-rose-600 hidden md:block uppercase tracking-wider font-mono">
              100% Free
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:p-2.5 rounded-lg border-bold-thin bg-white hover:bg-zinc-100 text-zinc-950 transition-all shadow-hard-sm cursor-pointer flex items-center justify-center"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />}
            </button>

            <button
              onClick={() => setView('dashboard')}
              className="bg-zinc-950 hover:bg-cream hover:text-zinc-950 text-white border-bold-thin px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all shadow-hard-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore <span className="hidden xs:inline">Database</span></span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded border-bold-thin bg-white text-zinc-950 hover:bg-zinc-150 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Menu Drawer */}
      <div 
        className={`fixed left-0 right-0 z-40 bg-sand border-b-4 border-zinc-950 p-6 shadow-hard transition-all duration-300 lg:hidden ${
          mobileMenuOpen 
            ? `${scrolled ? 'top-[64px]' : 'top-[74px]'} opacity-100 pointer-events-auto` 
            : 'top-[-500px] opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-3.5">
          <a 
            href="#value-proposition" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-black text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest py-2 border-b border-zinc-950/10 block"
          >
            Target Personas
          </a>
          <a 
            href="#testimonials" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-black text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest py-2 border-b border-zinc-950/10 block"
          >
            Testimonials
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-black text-zinc-950 hover:text-rose-600 transition-colors uppercase tracking-widest py-2 block"
          >
            Free Access
          </a>
          
          <div className="pt-4 border-t-2 border-zinc-950 flex flex-col gap-2">
            <span className="text-center text-xs font-black text-rose-600 uppercase tracking-wider py-2 font-mono">
              100% Free - Open Access
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white hover:bg-zinc-50 text-zinc-950 border-bold-thin py-2.5 rounded-lg text-xs font-black transition-all shadow-hard-sm flex items-center justify-center gap-2 cursor-pointer mb-2"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-rose-600" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setView('dashboard'); }}
              className="bg-zinc-950 hover:bg-cream hover:text-zinc-950 text-white border-bold px-5 py-3 rounded-lg text-xs font-extrabold transition-all shadow-hard-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 · HERO HEADER
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Live micro stats ticker */}
        <div className="mb-6 bg-white border-bold rounded-lg py-2 px-4 inline-flex items-center gap-2 shadow-hard-sm max-w-xl overflow-hidden transition-all">
          <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="text-[10px] font-extrabold text-zinc-950 uppercase tracking-wider font-mono">Live Indicator:</span>
          <p className="text-[11px] font-bold text-zinc-800 truncate font-mono">
            {MICRO_STATS[currentStatIndex]}
          </p>
        </div>

        {/* Headline */}
        <h1 
          className="text-5xl md:text-7xl lg:text-[84px] leading-[1.02] font-black text-zinc-950 tracking-tighter max-w-5xl mb-8"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          The Unfair Data Advantage for Moroccan Tech Pioneers.
        </h1>
        
        {/* Subheadline */}
        <p className="text-base md:text-xl text-zinc-800 max-w-3xl mb-12 leading-relaxed font-sans">
          Stop guessing salary grids and talent pool distributions. Track, analyze, and negotiate with <strong className="text-zinc-950 font-extrabold underline decoration-rose-600 decoration-2">10,782+ verified job listings</strong> scraped across Casablanca, Rabat, and regional hubs spanning a 10-year rolling window (2016-2026).
        </p>
        
        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 z-10">
          <button
            onClick={() => setView('dashboard')}
            className="group flex items-center gap-2 bg-zinc-950 text-white border-bold px-8 py-4.5 rounded-xl font-extrabold text-base hover:bg-cream hover:text-zinc-950 transition-all shadow-hard cursor-pointer transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            Explore Free Datasets
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="group flex items-center gap-2 bg-white border-bold text-zinc-950 px-8 py-4.5 rounded-xl font-extrabold text-base hover:bg-zinc-50 transition-all shadow-hard cursor-pointer transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            100% Free Access
          </button>
        </div>

        {/* Live counter & database metadata */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-zinc-600 font-bold font-mono">
          <div className="flex items-center gap-1.5 bg-white border-bold-thin py-1 px-3 rounded">
            <Clock className="w-3.5 h-3.5 text-zinc-900" />
            <span>Database refreshed: July 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border-bold-thin py-1 px-3 rounded">
            <Database className="w-3.5 h-3.5 text-zinc-900" />
            <span>Market Feed: ReKrute Aggregated</span>
          </div>
        </div>

        {/* Floating Highlight badges - Visual proof */}
        <div className="mt-14 relative w-full max-w-4xl h-10 pointer-events-none hidden md:block">
          <div className="absolute left-1/10 top-0 bg-white border-bold-thin shadow-hard-sm rounded-lg px-4 py-2 flex items-center gap-2 text-[11px] font-extrabold text-zinc-950">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            54.0% Casa-Settat Density
          </div>
          <div className="absolute right-1/10 top-0 bg-white border-bold-thin shadow-hard-sm rounded-lg px-4 py-2 flex items-center gap-2 text-[11px] font-extrabold text-zinc-950">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            TS/React Commands Premium
          </div>
        </div>

        {/* Logo Trust Ribbon */}
        <div className="mt-20 pt-8 border-t-2 border-zinc-950 w-full max-w-4xl flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-zinc-950 uppercase tracking-widest mb-6 font-mono">
            Compiling Raw Feeds Mapped From Key Moroccan Channels
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-80 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-serif font-black text-zinc-950 text-xl">
              <Building2 className="w-5 h-5 text-zinc-950" />
              <span>Rekrute Feed</span>
            </div>
            <div className="flex items-center gap-2 font-serif font-black text-zinc-950 text-xl">
              <Users className="w-5 h-5 text-zinc-950" />
              <span>Emploi.ma Feed</span>
            </div>
            <div className="flex items-center gap-2 font-serif font-black text-zinc-950 text-xl">
              <Terminal className="w-5 h-5 text-zinc-950" />
              <span>LinkedIn IT</span>
            </div>
            <div className="flex items-center gap-2 font-serif font-black text-zinc-950 text-xl">
              <Code2 className="w-5 h-5 text-zinc-950" />
              <span>Corporate ATS</span>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 · THE PROBLEM & OPPORTUNITY (Market Realities)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t-2 border-zinc-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block font-mono">Market Realities</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-zinc-950 leading-tight">
              The high cost of informational asymmetry.
            </h2>
            <p className="text-zinc-800 text-sm md:text-base leading-relaxed">
              Traditional compensation indices are either outdated or heavily biased. TechJob Analytics solves this with pure, raw database transaction mappings.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Reality 1 */}
            <div className="bg-white border-bold p-6 rounded-xl shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-10 w-10 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-4 font-black font-mono">01</div>
              <h3 className="font-serif font-extrabold text-zinc-950 text-lg mb-2">Agency Consultancies Cost Too Much</h3>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                Paying external recruitment agencies 30,000+ MAD per placement because you lack live internal salary grids is a budget leak. Benchmark directly with exact multi-dimensional metrics.
              </p>
            </div>

            {/* Reality 2 */}
            <div className="bg-white border-bold p-6 rounded-xl shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-10 w-10 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-4 font-black font-mono">02</div>
              <h3 className="font-serif font-extrabold text-zinc-950 text-lg mb-2">18% Candidate Drop-Off Overhead</h3>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                Offering 15,000 MAD for a role when the live Casablanca benchmark commands 18,500 MAD is why senior developers reject your final-round offers. Secure talent using empirical boundaries.
              </p>
            </div>

            {/* Reality 3 */}
            <div className="bg-white border-bold p-6 rounded-xl shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-10 w-10 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-4 font-black font-mono">03</div>
              <h3 className="font-serif font-extrabold text-zinc-950 text-lg mb-2">Vibe-Based Salary Negotiations</h3>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                Navigating job interviews without localized data results in candidates being low-balled by multinational ESNs, or founders overpaying by 20% due to candidate pressure. Stop guessing.
              </p>
            </div>

            {/* Reality 4 */}
            <div className="bg-white border-bold p-6 rounded-xl shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-10 w-10 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-4 font-black font-mono">04</div>
              <h3 className="font-serif font-extrabold text-zinc-950 text-lg mb-2">Location Placement Blindspots</h3>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                Setting up regional engineering branches in Casablanca without analyzing Rabat or Tangier hiring volumes means competing in crowded markets. Optimize spatial placements empirically.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 · TARGET AUDIENCE PERSONAS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t-2 border-zinc-950" id="value-proposition">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block mb-2 font-mono">Engineered For Moroccan Builders</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-zinc-950 tracking-tighter leading-tight">
            How different teams achieve leverage.
          </h2>
          <p className="text-zinc-800 mt-2 text-base">
            Whether sourcing a junior developer, opening a branch, or negotiating an offer—we have your dimensions mapped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Persona 1: HR & Recruiters */}
          <div className="bg-white border-bold p-8 rounded-xl flex flex-col justify-between shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div>
              <div className="h-12 w-12 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-6 font-bold text-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-extrabold text-zinc-950 mb-3 leading-tight">HR Teams & Talent Acquisition</h3>
              <p className="text-xs text-zinc-700 leading-relaxed mb-6">
                Align your corporate compensation structures dynamically with Casablanca and Rabat peak thresholds. Benchmark ESN competitors and seal senior recruits with confidence.
              </p>
              
              <ul className="space-y-3.5 text-xs text-zinc-800 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Establish highly competitive offer bands</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verify local talent volumes before listing roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Reduce placement dependency on external agencies</span>
                </li>
              </ul>
            </div>

            <a href="#interactive-demo" className="text-xs font-black text-zinc-950 uppercase tracking-wider hover:text-rose-600 mt-8 block">
              Explore Market Data &rarr;
            </a>
          </div>

          {/* Persona 2: Developers & Analysts */}
          <div className="bg-white border-bold p-8 rounded-xl flex flex-col justify-between shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div>
              <div className="h-12 w-12 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-6 font-bold text-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-extrabold text-zinc-950 mb-3 leading-tight">Engineers & Data Analysts</h3>
              <p className="text-xs text-zinc-700 leading-relaxed mb-6">
                Never enter interviews blind. Stop accepting low-ball offers from offshoring consultancies. Negotiate with empirical market graphs to back up your worth.
              </p>
              
              <ul className="space-y-3.5 text-xs text-zinc-800 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Know exact salary command for your tech stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Track which libraries command premium rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Build custom growth career pathways</span>
                </li>
              </ul>
            </div>

            <a href="#interactive-demo" className="text-xs font-black text-zinc-950 uppercase tracking-wider hover:text-rose-600 mt-8 block">
              Explore Salary Trends &rarr;
            </a>
          </div>

          {/* Persona 3: CTOs & Founders */}
          <div className="bg-white border-bold p-8 rounded-xl flex flex-col justify-between shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div>
              <div className="h-12 w-12 rounded bg-zinc-950 border-bold-thin flex items-center justify-center text-white mb-6 font-bold text-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-serif font-extrabold text-zinc-950 mb-3 leading-tight">CTOs & Board Executives</h3>
              <p className="text-xs text-zinc-700 leading-relaxed mb-6">
                Optimize company location placements. Decide between Casablanca Settat and Rabat Salé based on live demand metrics and talent availability density index maps.
              </p>
              
              <ul className="space-y-3.5 text-xs text-zinc-800 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Map geospatial density counts of target skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Select frameworks with mature local pools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Optimize nearshore / offshore developer budgets</span>
                </li>
              </ul>
            </div>

            <a href="#interactive-demo" className="text-xs font-black text-zinc-950 uppercase tracking-wider hover:text-rose-600 mt-8 block">
              Launch Geography Map &rarr;
            </a>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 · MICRO SAAS INTELLIGENCE ENGINE (The Pipeline)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-sand border-bold rounded-xl my-14 shadow-hard-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Premium Value Pitch */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block font-mono">Our Technology</span>
            <h2 className="text-4xl font-serif font-black text-zinc-950 leading-tight">
              An intelligent engine turning raw listings into gold.
            </h2>
            <p className="text-zinc-800 text-sm md:text-base leading-relaxed font-semibold">
              We don't just display lists. Our proprietary data pipeline crawls, cleans, and structures thousands of unstructured Moroccan tech job offers into clean, actionable intelligence.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-950 border-bold-thin rounded text-white mt-1 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-zinc-950 text-base">Direct ReKrute Integration</h4>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    We parse raw postings directly to extract technology keywords, location brackets, experience requirements, and actual compensation budgets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-950 border-bold-thin rounded text-white mt-1 shrink-0">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-zinc-950 text-base">Smart Salary Normalization</h4>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    By analyzing market benchmarks, we filter out anomalies, extreme outliers, and placeholder numbers to present the cleanest salary trends in Morocco.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Beautiful Visual Pipeline Steps */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1 */}
            <div className="bg-zinc-950 text-zinc-100 rounded-xl p-5 border border-zinc-800 shadow-hard relative overflow-hidden transition-all hover:border-rose-500/50">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-mono text-[9px] px-2 py-0.5 rounded font-black">STEP 01</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">Intelligent ReKrute Crawling</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Running
                </span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 space-y-1">
                <p className="text-zinc-500">&gt; GET https://www.rekrute.com/offres-emploi-maroc-tech.html</p>
                <p className="text-emerald-400">&gt;&gt; [Scraped] Found 14 new software developer roles in Casablanca & Rabat</p>
                <p>&gt;&gt; Extracting unstructured descriptions, company labels, and skill requirements...</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-950 text-zinc-100 rounded-xl p-5 border border-zinc-800 shadow-hard relative overflow-hidden transition-all hover:border-rose-500/50">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-mono text-[9px] px-2 py-0.5 rounded font-black">STEP 02</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">Data Cleansing & Deduplication</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">100% Accurate</span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 space-y-1">
                <p className="text-zinc-500">&gt; Filtering duplicate recruitment agency listings...</p>
                <p className="text-indigo-400">&gt;&gt; Parsed Tags: City="Casablanca" | Exp="3-5 years" | TechStack=["React", "TypeScript", "Node.js"]</p>
                <p>&gt;&gt; Salary parsed: 18,500 MAD/month (Standardized from unstructured text)</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-950 text-zinc-100 rounded-xl p-5 border border-zinc-800 shadow-hard relative overflow-hidden transition-all hover:border-rose-500/50">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-mono text-[9px] px-2 py-0.5 rounded font-black">STEP 03</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">Interactive Dashboard Delivery</span>
                </div>
                <span className="text-[10px] text-rose-400 font-mono">Active Delivery</span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 space-y-1">
                <p className="text-zinc-500">&gt; Aggregating regional salary grids & skill supply metrics</p>
                <p className="text-rose-400">&gt;&gt; Live Update: Dashboard components refreshed with 10,782 items</p>
                <p>&gt;&gt; UI response latency: 12ms | Prepared exports: CSV & PDF ready</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 · TESTIMONIALS (BENTO PROOF)
          ═══════════════════════════════════════════════════════════ */}
      <Testimonials />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 · PRICING PLANS
          ═══════════════════════════════════════════════════════════ */}
      <Pricing onExplore={() => setView('dashboard')} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 · ACCORDION FAQS
          ═══════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 10 · BOTTOM HIGH-CONVERTING CTA BLOCK
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-zinc-950 text-white border-bold rounded-xl p-10 md:p-16 text-center shadow-hard-lg relative overflow-hidden">
          {/* Design elements */}
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-850 via-transparent to-transparent opacity-60 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <span className="bg-white/10 text-rose-300 font-mono text-[10px] uppercase font-extrabold tracking-widest px-4 py-1.5 rounded border-bold-thin inline-block">
              100% Free Forever
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight text-white tracking-tighter">
              Stop vibe-coding your recruitment budgets.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Join CGI, Capgemini, and over 1,400 software engineers querying the pure, raw truth of the Moroccan technology market.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => setView('dashboard')}
                className="inline-flex items-center justify-center gap-2 bg-cream text-zinc-950 border-bold font-extrabold px-8 py-4 rounded-xl text-base transition-all shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer w-full sm:w-auto"
              >
                <span>Get Free Access</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
              <button
                onClick={() => setView('dashboard')}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border-bold font-bold px-8 py-4 rounded-xl text-base transition-all w-full sm:w-auto hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-hard cursor-pointer"
              >
                <span>Learn About Open Initiative</span>
                <Sparkles className="w-4 h-4 text-rose-400" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 font-bold font-mono uppercase tracking-wider">
              No login required. Explore open-access data to empower your tech journey.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 11 · PREMIUM FOOTER & BIG BRANDING
          ═══════════════════════════════════════════════════════════ */}
      <footer className="pt-24 pb-12 px-6 max-w-7xl mx-auto border-t-2 border-zinc-950 flex flex-col items-center">
        
        {/* Foot grids */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 px-4">
          <div>
            <h5 className="text-[11px] font-extrabold text-zinc-950 uppercase tracking-widest mb-4 font-mono">Market Insights</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-zinc-700 font-bold">
              <li><a href="#value-proposition" className="hover:text-rose-600 transition-colors">Live KPIs Index</a></li>
              <li><a href="#value-proposition" className="hover:text-rose-600 transition-colors">YoY Market Growth</a></li>
              <li><a href="#value-proposition" className="hover:text-rose-600 transition-colors">Geospatial Densities</a></li>
              <li><a href="#value-proposition" className="hover:text-rose-600 transition-colors">Programming Skills Radar</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-zinc-950 uppercase tracking-widest mb-4 font-mono">Enterprise Assets</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-zinc-700 font-bold">
              <li><a href="#pricing" className="hover:text-rose-600 transition-colors">Open API Keys</a></li>
              <li><a href="#pricing" className="hover:text-rose-600 transition-colors">Community Sourcing Access</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Market Index Datasets</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Standardized JSON Exports</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-zinc-950 uppercase tracking-widest mb-4 font-mono">Data Clean Rules</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-zinc-700 font-bold">
              <li><a href="#faqs" className="hover:text-rose-600 transition-colors">Deduplication Pipelines</a></li>
              <li><a href="#faqs" className="hover:text-rose-600 transition-colors">Salary Anomaly Filtering</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Daily Scrape Intervals</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">ReKrute Compliant Mappings</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-zinc-950 uppercase tracking-widest mb-4 font-mono">SaaS Engineering</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-zinc-700 font-bold">
              <li><a href="mailto:ayouuubbeenyahya@gmail.com" className="hover:text-rose-600 transition-colors">Developer Contact</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">System Service Status</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Privacy & GDPR Mappings</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Terms of Scraped Mappings</a></li>
            </ul>
          </div>
        </div>

        {/* Giant Typographical Logo */}
        <div className="w-full text-center mb-12 select-none overflow-hidden">
          <h2 className="text-[13vw] font-black text-zinc-950 tracking-tighter leading-none opacity-100">
            TechJob <span className="font-serif font-normal italic text-rose-600">=</span>
          </h2>
        </div>

        {/* Bottom micro lines */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-[11px] text-zinc-600 font-extrabold font-mono px-4 gap-4 border-t-2 border-zinc-950 pt-8">
          <p>© 2026 TechJob Analytics. Moroccan recruitment data intelligence engine mapped from official job channels.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-rose-600 transition-colors">Cookie Configurations</a>
            <span className="text-zinc-950">|</span>
            <a href="#" className="hover:text-rose-600 transition-colors">GDPR Compliant Data</a>
          </div>
        </div>

      </footer>
    </div>
  );
}
