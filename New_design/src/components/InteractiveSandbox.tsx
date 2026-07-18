import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  Layers, 
  Building2, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Briefcase, 
  Users, 
  Search, 
  Globe, 
  Sliders, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { growthData, techRadarData, companyHubProfiles } from '../data';

export default function InteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<'kpis' | 'trends' | 'geo' | 'radar' | 'companies'>('kpis');
  
  // Interactive Filters
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedContract, setSelectedContract] = useState<string>('All');
  const [isSimulatingExport, setIsSimulatingExport] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const pendingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      pendingTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const scheduleTimeout = useCallback((callback: () => void, delayMs: number) => {
    const timerId = setTimeout(() => {
      pendingTimersRef.current = pendingTimersRef.current.filter((id) => id !== timerId);
      callback();
    }, delayMs);
    pendingTimersRef.current.push(timerId);
  }, []);

  // Search filter for Tech Radar / Company Hub
  const [searchQuery, setSearchQuery] = useState('');

  // Reset Filters helper
  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedExperience('All');
    setSelectedContract('All');
    setSearchQuery('');
    setExportSuccessMessage(null);
  };

  // Filtered values computed on-the-fly
  const totalOffers = useMemo(() => {
    let base = 10782;
    if (selectedCity === 'Casablanca') base = 5820;
    else if (selectedCity === 'Rabat') base = 3104;
    else if (selectedCity === 'Tangier') base = 610;
    
    // adjust by experience
    if (selectedExperience === 'Junior') base = Math.round(base * 0.22);
    else if (selectedExperience === 'Mid') base = Math.round(base * 0.45);
    else if (selectedExperience === 'Senior') base = Math.round(base * 0.25);
    else if (selectedExperience === 'Lead') base = Math.round(base * 0.08);

    // adjust by contract
    if (selectedContract === 'CDI') base = Math.round(base * 0.85);
    else if (selectedContract === 'Freelance') base = Math.round(base * 0.10);
    else if (selectedContract === 'Anapec') base = Math.round(base * 0.05);

    return base;
  }, [selectedCity, selectedExperience, selectedContract]);

  const avgSalary = useMemo(() => {
    let base = 21500; // Average overall MAD per month
    if (selectedCity === 'Casablanca') base += 2500;
    else if (selectedCity === 'Rabat') base += 1000;
    else if (selectedCity === 'Tangier') base -= 2000;

    if (selectedExperience === 'Junior') base = 11000;
    else if (selectedExperience === 'Mid') base = 19500;
    else if (selectedExperience === 'Senior') base = 31000;
    else if (selectedExperience === 'Lead') base = 48000;

    if (selectedContract === 'Freelance') base *= 1.35; // Freelancer premium
    return Math.round(base);
  }, [selectedCity, selectedExperience, selectedContract]);

  const remoteRate = useMemo(() => {
    let rate = 38.4; // Base percentage
    if (selectedExperience === 'Junior') rate -= 15;
    if (selectedExperience === 'Lead') rate += 10;
    if (selectedContract === 'Freelance') rate += 25;
    return Math.min(Math.max(Math.round(rate), 5), 90);
  }, [selectedExperience, selectedContract]);

  // Export action handler
  const handleExport = () => {
    setIsSimulatingExport(true);
    setExportSuccessMessage(null);
    setExportMessage('Analyzing and compiling live ReKrute job offers...');
    scheduleTimeout(() => {
      setExportMessage('Applying dynamic filters (City: ' + selectedCity + ', Exp: ' + selectedExperience + ')...');
      scheduleTimeout(() => {
        setIsSimulatingExport(false);
        setExportSuccessMessage(`Success! Exported ${totalOffers.toLocaleString()} tech job market listings scraped and analyzed from ReKrute Morocco.`);
        scheduleTimeout(() => setExportSuccessMessage(null), 4000);
      }, 800);
    }, 800);
  };

  // Radar tech items matching search & filters
  const filteredTech = useMemo(() => {
    return techRadarData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExp = selectedExperience === 'All' || item.experienceLevel === selectedExperience;
      return matchesSearch && matchesExp;
    });
  }, [searchQuery, selectedExperience]);

  // Dynamic charts adjusted by active location
  const activeGrowthChartData = useMemo(() => {
    const source = growthData.length > 0 ? growthData : [{ year: 'N/A', Casablanca: 0, Rabat: 0, Tangier: 0, Marrakech: 0 }];
    return source.map(d => {
      let multiplier = 1.0;
      if (selectedExperience === 'Junior') multiplier = 0.8;
      if (selectedExperience === 'Senior') multiplier = 1.2;
      return {
        year: d.year,
        Casablanca: Math.round(d.Casablanca * multiplier),
        Rabat: Math.round(d.Rabat * multiplier),
        Tangier: Math.round(d.Tangier * multiplier),
        Marrakech: Math.round(d.Marrakech * multiplier)
      };
    });
  }, [selectedExperience]);

  return (
    <div className="w-full bg-white rounded-xl border-bold shadow-hard overflow-hidden" id="interactive-demo">
      {/* Simulation Banner Header */}
      <div className="bg-zinc-950 text-zinc-100 px-6 py-3.5 flex flex-wrap items-center justify-between text-xs font-bold gap-3 border-b-2 border-zinc-950">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-zinc-100 font-mono text-[11px] uppercase tracking-wider">STATUS: LIVE MOROCCAN IT MARKET DATA HUB</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-300 font-mono text-[11px] hidden sm:inline">Data Sources: ReKrute Morocco & Premium Portals (10,782 items)</span>
          <button 
            onClick={resetFilters} 
            className="text-[11px] bg-white/10 hover:bg-white/20 border-bold-thin text-white px-3 py-1 rounded transition-colors font-mono font-bold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Control Slicer Bar */}
      <div className="p-6 bg-cream border-b-2 border-zinc-950 flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4.5 h-4.5 text-zinc-950" />
          <span className="font-serif text-lg font-black text-zinc-950 tracking-tight">Compound Dimensions:</span>
        </div>

        {/* The Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
          {/* City Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-950 font-mono">HQ Region</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border-bold text-zinc-950 text-sm font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-sand transition-colors"
            >
              <option value="All">All Regions (Morocco)</option>
              <option value="Casablanca">Casablanca-Settat</option>
              <option value="Rabat">Rabat-Salé-Kénitra</option>
              <option value="Tangier">Tanger-Tétouan-Al Hoceïma</option>
            </select>
          </div>

          {/* Experience level */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-950 font-mono">Target Experience</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="bg-white border-bold text-zinc-950 text-sm font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-sand transition-colors"
            >
              <option value="All">All Career Stages</option>
              <option value="Junior">Junior (0 - 2 years)</option>
              <option value="Mid">Mid-Level (2 - 5 years)</option>
              <option value="Senior">Senior (5 - 8 years)</option>
              <option value="Lead">Lead / Principal (8+ years)</option>
            </select>
          </div>

          {/* Contract Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-950 font-mono">Contract Modality</label>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="bg-white border-bold text-zinc-950 text-sm font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-sand transition-colors"
            >
              <option value="All">All Modalities</option>
              <option value="CDI">CDI (Full-time Contract)</option>
              <option value="Freelance">Independent / Freelance</option>
              <option value="Anapec">Anapec / Structured Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="flex flex-col lg:flex-row min-h-[550px]">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 bg-cream border-r-2 border-zinc-950 p-4 flex flex-col justify-between gap-4">
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0">
            <span className="text-[10px] font-extrabold text-zinc-950 uppercase tracking-widest px-3 mb-2 hidden lg:block font-mono">Core Fact Dashboards</span>
            
            <button
              onClick={() => setActiveTab('kpis')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'kpis'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-hard-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'text-zinc-800 border-transparent hover:bg-sand hover:text-zinc-950'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>1. Live KPIs Index</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'trends'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-hard-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'text-zinc-800 border-transparent hover:bg-sand hover:text-zinc-950'
              }`}
            >
              <TrendingUp className="w-4.5 h-4.5" />
              <span>2. YoY Market Growth</span>
            </button>

            <button
              onClick={() => setActiveTab('geo')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'geo'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-hard-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'text-zinc-800 border-transparent hover:bg-sand hover:text-zinc-950'
              }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              <span>3. Geospatial Density</span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'radar'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-hard-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'text-zinc-800 border-transparent hover:bg-sand hover:text-zinc-950'
              }`}
            >
              <Layers className="w-4.5 h-4.5" />
              <span>4. Skills Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('companies')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'companies'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-hard-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'text-zinc-800 border-transparent hover:bg-sand hover:text-zinc-950'
              }`}
            >
              <Building2 className="w-4.5 h-4.5" />
              <span>5. Corporate Hubs</span>
            </button>
          </div>


        </div>

        {/* Content Panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          
          {/* TAB 1: LIVE KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-serif font-black text-zinc-950 mb-1">Live Market KPI Indicators</h3>
                <p className="text-sm text-zinc-700 font-medium">Real-time macro compensation metrics mapped against selected parameters.</p>
              </div>

              {/* Grid of Key metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-5 rounded-lg border-bold shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 block mb-3 font-mono">Postings Counted</span>
                  <div>
                    <div className="text-3xl md:text-4xl font-black font-serif text-zinc-950 mb-1 leading-none">
                      {totalOffers.toLocaleString()}
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-block mt-2 font-mono">
                      100% verified entries
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-5 rounded-lg border-bold shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 block mb-3 font-mono">Est. Median Salary</span>
                  <div>
                    <div className="text-3xl md:text-4xl font-black font-serif text-zinc-950 mb-1 leading-none">
                      {avgSalary.toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-500">MAD/mo</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 inline-block mt-2 font-mono">
                      Based on current bands
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-5 rounded-lg border-bold shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 block mb-3 font-mono">Hybrid / Remote Slices</span>
                  <div>
                    <div className="text-3xl md:text-4xl font-black font-serif text-zinc-950 mb-1 leading-none">
                      {remoteRate}%
                    </div>
                    <span className="text-[11px] font-extrabold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded border border-zinc-200 inline-block mt-2 font-mono">
                      Out-of-office options
                    </span>
                  </div>
                </div>
              </div>

              {/* Informative text & simulation graph */}
              <div className="bg-sand p-5 rounded-lg border-bold flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="max-w-md">
                  <h4 className="text-sm font-extrabold text-zinc-950 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    Interactive Sandbox Insights
                  </h4>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    Changing your dimension sliders automatically calculates compensation variables. Try toggling <strong className="text-zinc-950 font-black">Senior</strong> and <strong className="text-zinc-950 font-black">Casablanca</strong> to observe the instant correction in monthly averages.
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></div>
                  <span className="text-xs font-bold text-zinc-800 font-mono">Dynamic update complete</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: YOY TRENDS */}
          {activeTab === 'trends' && (
            <div className="space-y-6 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-2xl font-serif font-black text-zinc-950 mb-1">10-Year Growth Sequence (2016 - 2026)</h3>
                  <p className="text-sm text-zinc-700 font-medium">Year-over-year tech hiring movements calculated across regional platforms.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-sand border-bold-thin px-2.5 py-1 rounded text-zinc-900">
                  Unit: Volume Index count
                </span>
              </div>

              {/* Area Chart Container */}
              <div className="h-[280px] w-full border-bold rounded-lg bg-cream p-4 shadow-hard-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeGrowthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCasa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRabat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#18181b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#18181b', fontWeight: 'bold' }} />
                    <CartesianGrid vertical={false} stroke="#e4e4e7" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fffdf9', borderRadius: '4px', border: '2px solid #09090b', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#18181b', fontWeight: 'black' }}
                    />
                    {/* Render specific lines based on active selections or show multiple */}
                    <Area type="monotone" name="Casablanca Hub" dataKey="Casablanca" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorCasa)" />
                    <Area type="monotone" name="Rabat Hub" dataKey="Rabat" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorRabat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-extrabold text-zinc-950 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-rose-600 block border-bold-thin"></span>
                  <span>Casablanca (+113.1% cumulative growth)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-zinc-950 block border-bold-thin"></span>
                  <span>Rabat (+171.7% cumulative growth)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GEOSPATIAL DENSITY */}
          {activeTab === 'geo' && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-serif font-black text-zinc-950 mb-1">Geospatial Distribution Matrix</h3>
                <p className="text-sm text-zinc-700 font-medium">Concentration of tech job offers segmented by geographical development zones.</p>
              </div>

              {/* Horizontal bar visualization or localized cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Visual Map Mimic */}
                <div className="relative bg-cream h-[250px] rounded-lg border-bold flex items-center justify-center overflow-hidden shadow-hard-sm">
                  <Globe className="w-48 h-48 text-zinc-300 absolute opacity-80" />
                  
                  {/* Interactive Region Pointers */}
                  <div 
                    onClick={() => setSelectedCity('Casablanca')}
                    className={`absolute top-1/2 left-1/3 bg-white px-3 py-1.5 rounded border-bold shadow-hard-sm cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5 ${
                      selectedCity === 'Casablanca' ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/20' : 'border-zinc-950'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
                    <span className="text-xs font-extrabold text-zinc-950">Casablanca</span>
                  </div>

                  <div 
                    onClick={() => setSelectedCity('Rabat')}
                    className={`absolute top-1/3 left-1/2 bg-white px-3 py-1.5 rounded border-bold shadow-hard-sm cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5 ${
                      selectedCity === 'Rabat' ? 'bg-zinc-100 border-zinc-950 ring-2 ring-zinc-950/20' : 'border-zinc-950'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-950"></span>
                    <span className="text-xs font-extrabold text-zinc-950">Rabat</span>
                  </div>

                  <div 
                    onClick={() => setSelectedCity('Tangier')}
                    className={`absolute top-1/5 left-2/3 bg-white px-3 py-1.5 rounded border-bold shadow-hard-sm cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5 ${
                      selectedCity === 'Tangier' ? 'bg-yellow-50 border-yellow-600 ring-2 ring-yellow-600/20' : 'border-zinc-950'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-xs font-extrabold text-zinc-950">Tangier</span>
                  </div>

                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-black tracking-widest text-zinc-900 font-mono bg-white px-2 py-0.5 border-bold-thin">
                    Click a node to slice dashboard
                  </span>
                </div>

                {/* Region details list */}
                <div className="space-y-4">
                  <div className={`p-4 rounded border-bold transition-all ${selectedCity === 'Casablanca' ? 'bg-rose-50/70 border-rose-600' : 'bg-white border-zinc-950'}`}>
                    <div className="flex justify-between items-center font-black text-sm text-zinc-950 mb-1">
                      <span className="font-serif font-extrabold">Casablanca-Settat Region</span>
                      <span className="text-rose-600 font-mono font-bold">54.0% of market</span>
                    </div>
                    <div className="text-xs text-zinc-800 leading-relaxed font-semibold">
                      Mainly multinational consultancy entities, enterprise banking centers, and massive off-shoring hubs. Command highest compensation peaks.
                    </div>
                  </div>

                  <div className={`p-4 rounded border-bold transition-all ${selectedCity === 'Rabat' ? 'bg-zinc-100/70 border-zinc-950' : 'bg-white border-zinc-950'}`}>
                    <div className="flex justify-between items-center font-black text-sm text-zinc-950 mb-1">
                      <span className="font-serif font-extrabold">Rabat-Salé-Kénitra Region</span>
                      <span className="text-zinc-950 font-mono font-bold">28.8% of market</span>
                    </div>
                    <div className="text-xs text-zinc-800 leading-relaxed font-semibold">
                      Sovereign digital structures, telecom corporate offices, and fast-growing product startups. Exceptional engineering-to-cost density.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: TECH RADAR */}
          {activeTab === 'radar' && (
            <div className="space-y-6 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-2xl font-serif font-black text-zinc-950 mb-1">Skill & Frame Volume Matrix</h3>
                  <p className="text-sm text-zinc-700 font-medium">Demand shifts, volume splits, and estimated compensation tiers.</p>
                </div>

                {/* Search input inside table */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-950 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search frameworks (e.g. React)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-bold text-xs rounded-lg pl-9 pr-4 py-2.5 outline-none font-bold focus:bg-cream transition-all text-zinc-950 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Table listing */}
              <div className="overflow-x-auto rounded-lg border-bold bg-white shadow-hard-sm">
                <table className="w-full text-left text-xs text-zinc-800 border-collapse">
                  <thead>
                    <tr className="bg-sand border-b-2 border-zinc-950 font-extrabold text-zinc-950 font-mono">
                      <th className="p-3">Core Stack / Technology</th>
                      <th className="p-3">YoY Shift</th>
                      <th className="p-3 text-right">Job Vol. Index</th>
                      <th className="p-3 text-right">Est. Avg Salary</th>
                      <th className="p-3 text-center">Seniority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-zinc-950 font-semibold">
                    {filteredTech.map((item, index) => (
                      <tr key={index} className="hover:bg-cream/40 transition-colors">
                        <td className="p-3 font-extrabold text-zinc-950 flex items-center gap-2 font-serif">
                          <span className="w-2 h-2 rounded bg-rose-600 border-bold-thin"></span>
                          {item.name}
                        </td>
                        <td className="p-3">
                          <span className={`font-extrabold inline-flex px-1.5 py-0.5 border rounded font-mono ${
                            item.growth > 0 
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-300' 
                              : 'text-rose-800 bg-rose-50 border-rose-300'
                          }`}>
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-zinc-900 font-bold">{(item.volume).toLocaleString()}</td>
                        <td className="p-3 text-right font-extrabold text-zinc-950 font-serif">{(item.avgSalary).toLocaleString()} MAD</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 rounded border border-zinc-950 bg-sand text-zinc-950 font-extrabold font-mono text-[10px]">
                            {item.experienceLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredTech.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">
                          No stacks matched your queries or active experience levels.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COMPANY HUB */}
          {activeTab === 'companies' && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-serif font-black text-zinc-950 mb-1">Corporate Stacks Hub</h3>
                <p className="text-sm text-zinc-700 font-medium">Track which systems and technologies are hired by major employers in Morocco.</p>
              </div>

              {/* Company cluster cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {companyHubProfiles.map((company, idx) => (
                  <div key={idx} className="bg-white border-bold rounded-lg p-5 hover:bg-sand hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-hard transition-all duration-300 flex flex-col justify-between shadow-hard-sm">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-serif font-extrabold text-zinc-950 text-base">{company.name}</h4>
                        <span className="text-[10px] uppercase font-extrabold text-zinc-950 tracking-wider bg-cream border-bold-thin px-2 py-0.5 rounded font-mono">
                          {company.segment}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-800 text-xs mb-4 font-bold">
                        <Briefcase className="w-3.5 h-3.5 text-rose-600" />
                        <span>{company.activeJobs} active technical openings</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-zinc-950">
                      <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-900 block mb-1 font-mono">Primary Tech Stack</span>
                      <p className="text-xs font-black text-rose-600 font-mono">{company.topTech}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Persistent Interactive Sandbox Footer Call-To-Action */}
          <div className="pt-6 mt-8 border-t-2 border-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <p className="text-xs text-zinc-800 font-bold">
                Showing simulated dynamic slices. Real dashboard has over <strong className="text-zinc-950 font-black">40+ dimensions</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                disabled={isSimulatingExport}
                className="group flex items-center gap-1.5 bg-white border-bold text-zinc-950 px-4 py-2.5 rounded-lg text-xs font-extrabold shadow-hard-sm cursor-pointer hover:bg-zinc-50 hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isSimulatingExport ? 'Exporting...' : 'Export Filtered CSV'}</span>
              </button>
              <a
                href="#pricing"
                className="group flex items-center gap-1 text-white bg-zinc-950 border-bold-thin px-4 py-2.5 rounded-lg text-xs font-extrabold shadow-hard-sm hover:bg-cream hover:text-zinc-950 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <span>Get Full Database</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
              </a>
            </div>
          </div>

          {/* Simulation status messages */}
          {isSimulatingExport && (
            <div className="mt-3 text-center bg-rose-600 text-white py-2 px-4 rounded border-bold text-xs font-mono font-extrabold shadow-hard animate-pulse">
              {exportMessage}
            </div>
          )}
          {exportSuccessMessage && (
            <div className="mt-3 text-center bg-emerald-600 text-white py-2 px-4 rounded border-bold text-xs font-mono font-extrabold shadow-hard animate-bounce">
              {exportSuccessMessage}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
