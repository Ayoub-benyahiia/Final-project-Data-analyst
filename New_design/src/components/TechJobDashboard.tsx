import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  LineChart, 
  FileText, 
  Building2, 
  Map, 
  TrendingUp, 
  Bell, 
  Search, 
  MapPin, 
  Sliders, 
  ArrowLeft, 
  X,
  RefreshCw,
  Award,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import {
  useGrowthData,
  useTechRadar,
  useCompanies,
  useMarketMetrics,
  useTopSkills,
  useDashboardKpis,
  invalidateDashboardQueries
} from '../hooks/useDashboardData';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TechJobDashboardProps {
  onBackToHome: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TechJobDashboard({ onBackToHome, isDarkMode, onToggleDarkMode }: TechJobDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'radar' | 'insights' | 'reports' | 'companies' | 'geo' | 'trends'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Filters
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedContract, setSelectedContract] = useState<string>('All');
  const [selectedEducation, setSelectedEducation] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Notification and simulation states
  const [notification, setNotification] = useState<string | null>(null);
  const pendingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ============================================================================
  // LAYER 2: REACT QUERY HOOKS WITH FILTER-AWARE CACHING
  // ============================================================================
  // All hooks include current filter state in queryKey for dynamic cache invalidation
  // Switching filters automatically triggers new fetch or cache lookup

  const filters = useMemo(() => ({
    city: selectedCity,
    tech: selectedTech,
    experience: selectedExperience,
    contract: selectedContract,
    education: selectedEducation,
    remote_only: remoteOnly,
    search: searchQuery
  }), [selectedCity, selectedTech, selectedExperience, selectedContract, selectedEducation, remoteOnly, searchQuery]);

  // Fetch data with automatic caching based on filter combinations
  const { isLoading: growthLoading, error: growthError } = useGrowthData(filters);
  const { isLoading: radarLoading, error: radarError } = useTechRadar(filters);
  const { isLoading: companiesLoading, error: companiesError } = useCompanies(filters);
  const { isLoading: metricsLoading, error: metricsError } = useMarketMetrics(filters);
  const { isLoading: skillsLoading, error: skillsError } = useTopSkills(filters);
  const { isLoading: kpisLoading, error: kpisError } = useDashboardKpis(filters);

  // Handle manual refresh with cache invalidation
  const handleRefresh = useCallback(() => {
    invalidateDashboardQueries();
    showNotification('Cache invalidated and data refreshed');
  }, []);

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

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    scheduleTimeout(() => setNotification(null), 3000);
  }, [scheduleTimeout]);

  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedExperience('All');
    setSelectedContract('All');
    setSelectedEducation('All');
    setSelectedTech('All');
    setRemoteOnly(false);
    setSearchQuery('');
    invalidateDashboardQueries(); // Clear cache on reset
    showNotification('Filters have been successfully reset');
  };

  // Base raw companies database
  const companiesData = [
    { id: 1, name: 'Sofrecom Maroc', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE', baseOpenPositions: 819, topTechs: ['Java', 'React', 'Angular'], city: 'Rabat', tags: ['Recherche de nouveauté', 'Autonomie', 'Implication', 'Ambition', 'Réflexion'] },
    { id: 2, name: 'Alten Maroc', segment: 'ASSISTANAT DE DIRECTION / SERVICES GÉNÉRAUX - SECTEUR INFORMATIQUE', baseOpenPositions: 716, topTechs: ['Java', 'React', 'C#'], city: 'Rabat', tags: ['Assistanat de direction', 'Autonomie', 'Implication', 'Réflexion', 'Ambition'] },
    { id: 3, name: 'Atos', segment: 'GESTION PROJET / ETUDES / R&D - INFORMATIQUE / ELECTRONIQUE - SECTEUR INFORMATIQUE', baseOpenPositions: 504, topTechs: ['Java', 'React', 'Python'], city: 'Casablanca', tags: ['Gestion de projet', 'Implication', 'Recherche de nouveauté', 'Ambition', 'Réflexion'] },
    { id: 4, name: 'Capgemini', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE', baseOpenPositions: 420, topTechs: ['Java', 'React', 'DevOps'], city: 'Casablanca', tags: ['Autonomie', 'Recherche de nouveauté', 'Ambition', 'Implication', 'Réflexion'] },
    { id: 5, name: 'Sqli Maroc', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE', baseOpenPositions: 289, topTechs: ['Java', 'React', 'Node.js'], city: 'Rabat', tags: ['Ambition', 'Recherche de nouveauté', 'Autonomie', 'Réflexion'] },
    { id: 6, name: 'Cgi Technologies Et Solutions Maroc', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE', baseOpenPositions: 275, topTechs: ['Java', 'React', 'SQL'], city: 'Fès', tags: ['Ambition', 'Recherche de nouveauté', 'Autonomie', 'Implication', 'Réflexion'] },
    { id: 7, name: 'Attijariwafa Bank', segment: 'BANQUE / FINANCE', baseOpenPositions: 258, topTechs: ['Java', 'React', 'Cobol'], city: 'Casablanca', tags: ['Implication', 'Ambition', 'Autonomie', 'Recherche de nouveauté', 'Réflexion'] },
    { id: 8, name: 'Welink', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE', baseOpenPositions: 216, topTechs: ['Java', 'React', 'Python'], city: 'Casablanca', tags: ['Implication', 'Autonomie', 'Ambition', 'Réflexion'] },
    { id: 9, name: 'Sofrecom Services Maroc', segment: 'INFORMATIQUE', baseOpenPositions: 204, topTechs: ['Java', 'React', 'Spring'], city: 'Rabat', tags: ['Ambition', 'Implication', 'Autonomie', 'Recherche de nouveauté', 'Réflexion'] },
    { id: 10, name: 'Maroc Climate And Security Mcs Carrier', segment: 'INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR AUTRES SERVICES', baseOpenPositions: 204, topTechs: ['Java', 'React', 'Docker'], city: 'Casablanca', tags: ['Organisation', 'Non spécifié', 'Implication', 'Flexibilité', 'Recherche de nouveauté'] }
  ];

  // Base raw technologies distribution
  const baseTechnologies = [
    { name: 'Java', baseCount: 2245, category: 'Backend' },
    { name: 'Sql', baseCount: 2068, category: 'Database' },
    { name: 'Agile', baseCount: 1969, category: 'Methodology' },
    { name: 'Linux', baseCount: 1184, category: 'Infrastructure' },
    { name: 'Oracle', baseCount: 1166, category: 'Database' },
    { name: 'Git', baseCount: 1165, category: 'Tools' },
    { name: 'Javascript', baseCount: 1030, category: 'Frontend' },
    { name: 'Angular', baseCount: 1030, category: 'Frontend' },
    { name: 'Spring', baseCount: 1005, category: 'Backend' },
    { name: 'Rest', baseCount: 997, category: 'API' },
    { name: 'DevOps', baseCount: 920, category: 'Infrastructure' },
    { name: 'Scrum', baseCount: 880, category: 'Methodology' },
    { name: 'Python', baseCount: 850, category: 'Backend' },
    { name: 'Docker', baseCount: 800, category: 'Infrastructure' }
  ];

  // Base raw city distribution
  const baseCities = [
    { name: 'Casablanca', baseCount: 5507, percentage: 53.6 },
    { name: 'Rabat', baseCount: 2674, percentage: 26.0 },
    { name: 'Fès', baseCount: 480, percentage: 4.7 },
    { name: 'Salé', baseCount: 458, percentage: 4.5 },
    { name: 'Ben Guerir', baseCount: 227, percentage: 2.2 },
    { name: 'Tétouan', baseCount: 183, percentage: 1.8 },
    { name: 'Kénitra', baseCount: 161, percentage: 1.6 },
    { name: 'Oujda', baseCount: 135, percentage: 1.3 },
    { name: 'Tanger', baseCount: 120, percentage: 1.1 },
    { name: 'Cabo Negro', baseCount: 75, percentage: 0.7 },
    { name: 'Paris', baseCount: 68, percentage: 0.7 },
    { name: 'Marrakech', baseCount: 67, percentage: 0.7 }
  ];

  // Compute live filtered multipliers & values
  const filterMultiplier = useMemo(() => {
    let mult = 1.0;
    if (selectedCity !== 'All') {
      if (selectedCity === 'Casablanca') mult *= 0.54;
      else if (selectedCity === 'Rabat') mult *= 0.28;
      else mult *= 0.12;
    }
    if (selectedExperience !== 'All') {
      if (selectedExperience === 'Junior') mult *= 0.21;
      else if (selectedExperience === 'Intermédiaire') mult *= 0.39;
      else if (selectedExperience === 'Confirmé') mult *= 0.26;
      else if (selectedExperience === 'Senior') mult *= 0.11;
      else mult *= 0.03; // Expert
    }
    if (selectedContract !== 'All') {
      if (selectedContract === 'CDI') mult *= 0.89;
      else if (selectedContract === 'CDD') mult *= 0.04;
      else if (selectedContract === 'Freelance') mult *= 0.03;
      else mult *= 0.04;
    }
    if (selectedEducation !== 'All') {
      if (selectedEducation === 'Bac+5') mult *= 0.75;
      else if (selectedEducation === 'Bac') mult *= 0.21;
      else mult *= 0.04;
    }
    if (selectedTech !== 'All') {
      mult *= 0.15;
    }
    if (remoteOnly) {
      mult *= 0.18;
    }
    return Math.max(mult, 0.002);
  }, [selectedCity, selectedExperience, selectedContract, selectedEducation, selectedTech, remoteOnly]);

  // Dynamic KPIs responding to filters
  const computedTotalOffers = useMemo(() => {
    return Math.round(10782 * filterMultiplier);
  }, [filterMultiplier]);

  // Filtered technologies list
  const computedTechnologies = useMemo(() => {
    return baseTechnologies.map(tech => {
      let count = tech.baseCount;
      if (selectedCity !== 'All' && selectedCity !== 'Multiple') {
        const index = baseCities.findIndex(c => c.name === selectedCity);
        if (index !== -1) {
          count = Math.round(count * (baseCities[index].percentage / 100) * 1.5);
        }
      }
      count = Math.round(count * filterMultiplier * (1 / filterMultiplier ** 0.3));
      if (selectedTech !== 'All' && tech.name.toLowerCase() !== selectedTech.toLowerCase()) {
        count = Math.round(count * 0.05);
      }
      return {
        ...tech,
        count: Math.max(count, 3)
      };
    }).sort((a, b) => b.count - a.count);
  }, [selectedCity, selectedTech, filterMultiplier]);

  // Filtered cities list
  const computedCities = useMemo(() => {
    return baseCities.map(city => {
      let count = city.baseCount;
      count = Math.round(count * filterMultiplier * (1 / filterMultiplier ** 0.25));
      if (selectedCity !== 'All' && city.name !== selectedCity) {
        count = Math.round(count * 0.08);
      }
      return {
        ...city,
        count: Math.max(count, 1)
      };
    }).sort((a, b) => b.count - a.count);
  }, [selectedCity, filterMultiplier]);

  // Dynamic Companies List with filter and search
  const computedCompanies = useMemo(() => {
    return companiesData.map(c => {
      let openPositions = c.baseOpenPositions;
      openPositions = Math.round(openPositions * filterMultiplier * (1 / filterMultiplier ** 0.4));
      return {
        ...c,
        openPositions: Math.max(openPositions, 12)
      };
    }).filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.segment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || c.city === selectedCity;
      const matchesTech = selectedTech === 'All' || c.topTechs.some(
        (tech) => tech.toLowerCase() === selectedTech.toLowerCase()
      );
      return matchesSearch && matchesCity && matchesTech;
    });
  }, [selectedCity, selectedTech, searchQuery, filterMultiplier]);


  // Monthly Trend Chart Data
  const monthlyPostingTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseVolume = [800, 950, 1100, 1150, 1300, 1500];
    return months.map((month, idx) => {
      let vol = baseVolume[idx];
      vol = Math.round(vol * filterMultiplier * (1 / filterMultiplier ** 0.3));
      return {
        month,
        offers: Math.max(vol, 45)
      };
    });
  }, [filterMultiplier]);

  // Radar Skill Profile
  const radarSkillProfileData = [
    { subject: 'Java', Junior: 35, Mid: 70, Senior: 95 },
    { subject: 'Sql', Junior: 50, Mid: 85, Senior: 90 },
    { subject: 'Agile', Junior: 25, Mid: 65, Senior: 95 },
    { subject: 'Linux', Junior: 30, Mid: 60, Senior: 85 },
    { subject: 'Oracle', Junior: 20, Mid: 55, Senior: 90 },
    { subject: 'Git', Junior: 80, Mid: 90, Senior: 95 }
  ];

  // Tech x Contract Matrix list
  const techContractMatrix = [
    { tech: 'Java', cdi: 2245, cdd: 7, freelance: 65, stage: 39 },
    { tech: 'Sql', cdi: 2068, cdd: 19, freelance: 57, stage: 30 },
    { tech: 'Agile', cdi: 1969, cdd: 5, freelance: 35, stage: 13 },
    { tech: 'Linux', cdi: 1184, cdd: 8, freelance: 30, stage: 16 },
    { tech: 'Oracle', cdi: 1166, cdd: 2, freelance: 40, stage: 13 },
    { tech: 'Git', cdi: 1165, cdd: 5, freelance: 32, stage: 18 },
    { tech: 'Javascript', cdi: 1030, cdd: 12, freelance: 37, stage: 18 },
    { tech: 'Angular', cdi: 1030, cdd: 2, freelance: 34, stage: 12 },
    { tech: 'Spring', cdi: 1005, cdd: 1, freelance: 25, stage: 13 },
    { tech: 'Rest', cdi: 997, cdd: 1, freelance: 23, stage: 9 }
  ];

  // Experience Requirements Over Time Chart Data
  const experienceRequirementsOverTimeData = [
    { year: '2016', CDI: 3.2, CDD: 1.8, Freelance: 4.8, Stage: 0.1 },
    { year: '2017', CDI: 3.5, CDD: 1.9, Freelance: 4.6, Stage: 0.1 },
    { year: '2018', CDI: 3.8, CDD: 1.7, Freelance: 5.2, Stage: 0.2 },
    { year: '2019', CDI: 4.1, CDD: 1.6, Freelance: 5.8, Stage: 0.2 },
    { year: '2020', CDI: 4.5, CDD: 1.8, Freelance: 6.0, Stage: 0.3 },
    { year: '2021', CDI: 4.3, CDD: 2.0, Freelance: 6.1, Stage: 0.2 },
    { year: '2022', CDI: 4.8, CDD: 1.9, Freelance: 5.9, Stage: 0.1 },
    { year: '2023', CDI: 5.0, CDD: 1.8, Freelance: 6.2, Stage: 0.2 },
    { year: '2024', CDI: 5.2, CDD: 1.7, Freelance: 5.8, Stage: 0.2 },
    { year: '2025', CDI: 4.9, CDD: 1.8, Freelance: 5.5, Stage: 0.1 },
    { year: '2026', CDI: 4.6, CDD: 1.6, Freelance: 5.0, Stage: 0.1 }
  ];

  // Education Level by City Chart Data
  const educationLevelByCityData = [
    { city: 'Rabat', Bac: 345, 'Bac+2': 672, 'Bac+3': 112, 'Bac+5': 1845, Doctorat: 45 },
    { city: 'Fès', Bac: 120, 'Bac+2': 230, 'Bac+3': 34, 'Bac+5': 310, Doctorat: 8 },
    { city: 'Salé', Bac: 110, 'Bac+2': 190, 'Bac+3': 22, 'Bac+5': 285, Doctorat: 4 },
    { city: 'Kénitra', Bac: 45, 'Bac+2': 82, 'Bac+3': 12, 'Bac+5': 110, Doctorat: 2 },
    { city: 'Ben Guerir', Bac: 30, 'Bac+2': 55, 'Bac+3': 18, 'Bac+5': 180, Doctorat: 12 }
  ];

  // Year over Year Comparison Data (Market Trends)
  const yoyComparisonData = [
    { year: '2016', posts: '999', growth: '—', tech: 'Java', city: 'Casablanca' },
    { year: '2017', posts: '998', growth: '-0.1%', tech: 'Java', city: 'Casablanca' },
    { year: '2018', posts: '990', growth: '-0.8%', tech: 'Sql', city: 'Casablanca' },
    { year: '2019', posts: '1,000', growth: '+1.0%', tech: 'Java', city: 'Casablanca' },
    { year: '2020', posts: '1,000', growth: '+0.0%', tech: 'Java', city: 'Casablanca' },
    { year: '2021', posts: '1,000', growth: '+0.0%', tech: 'Java', city: 'Casablanca' },
    { year: '2022', posts: '1,000', growth: '+0.0%', tech: 'Agile', city: 'Casablanca' },
    { year: '2023', posts: '1,000', growth: '+0.0%', tech: 'Agile', city: 'Casablanca' },
    { year: '2024', posts: '998', growth: '-0.2%', tech: 'Agile', city: 'Casablanca' },
    { year: '2025', posts: '995', growth: '-0.3%', tech: 'Sql', city: 'Casablanca' },
    { year: '2026', posts: '802', growth: '-19.4%', tech: 'Persuasion', city: 'Casablanca' }
  ];

  const safeMonthlyPostingTrendData = monthlyPostingTrendData.length > 0
    ? monthlyPostingTrendData
    : [{ month: 'N/A', offers: 0 }];
  const safeRadarSkillProfileData = radarSkillProfileData.length > 0
    ? radarSkillProfileData
    : [{ subject: 'N/A', Junior: 0, Mid: 0, Senior: 0 }];
  const safeExperienceRequirementsData = experienceRequirementsOverTimeData.length > 0
    ? experienceRequirementsOverTimeData
    : [{ year: 'N/A', CDI: 0, CDD: 0, Freelance: 0, Stage: 0 }];
  const safeEducationLevelByCityData = educationLevelByCityData.length > 0
    ? educationLevelByCityData
    : [{ city: 'N/A', Bac: 0, 'Bac+2': 0, 'Bac+3': 0, 'Bac+5': 0, Doctorat: 0 }];

  // Combined loading state
  const isLoading = growthLoading || radarLoading || companiesLoading || metricsLoading || skillsLoading || kpisLoading;
  
  // Combined error state
  const hasError = growthError || radarError || companiesError || metricsError || skillsError || kpisError;

  return (
    <div className="min-h-screen bg-cream text-zinc-950 font-sans antialiased selection:bg-rose-500 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Pop notification toast (Neo-brutalist Style) */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-bold shadow-hard text-zinc-950 text-xs font-mono font-black py-3.5 px-6 rounded-lg flex items-center gap-2.5 animate-bounce">
          <RefreshCw className="w-3.5 h-3.5 text-rose-600 animate-spin shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-cream/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white border-bold shadow-hard-lg rounded-xl p-8 flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-rose-600 animate-spin" />
            <span className="text-sm font-mono font-black text-zinc-950">Loading cached data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="fixed inset-0 z-40 bg-cream/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white border-bold border-red-600 shadow-hard-lg rounded-xl p-8 flex flex-col items-center gap-4 max-w-md">
            <div className="text-red-600 font-black text-sm font-mono">Error loading data</div>
            <p className="text-xs text-zinc-700 text-center">Failed to fetch data from backend. Please ensure the FastAPI server is running on port 8000.</p>
            <button 
              onClick={handleRefresh}
              className="bg-zinc-950 text-white px-6 py-2 rounded-lg text-xs font-black hover:bg-rose-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Outer Dashboard layout wrapper */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border-bold-thin rounded-lg shadow-hard-sm cursor-pointer"
        >
          <Menu className="w-5 h-5 text-zinc-950" />
        </button>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-zinc-950/50 z-30"
          />
        )}

        {/* ═══════════════════════════════════════════════════════════
            SIDEBAR NAVIGATION PANEL (NEO-BRUTALIST LANDING STYLE)
            ═══════════════════════════════════════════════════════════ */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-sand border-r-2.5 border-zinc-950 flex flex-col justify-between shrink-0 p-5 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="space-y-8">
            
            {/* Header branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-rose-600 rounded-lg flex items-center justify-center font-serif font-black text-white text-lg border-bold-thin shadow-hard-sm">
                  T
                </div>
                <div>
                  <span className="font-serif font-black text-zinc-950 tracking-tight text-lg block">
                    TechJob<span className="text-rose-600">.ma</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-650 font-mono block">
                    Recruitment Intel
                  </span>
                </div>
              </div>

              {/* Close mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2 text-zinc-900 hover:bg-zinc-950/5 rounded-lg cursor-pointer border-bold-thin bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Back to Home desktop action */}
            <button 
              onClick={onBackToHome}
              className="w-full bg-white hover:bg-zinc-50 text-zinc-950 border-bold-thin shadow-hard-sm rounded-lg py-2 px-3 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
              <span>Back to Home Screen</span>
            </button>

            {/* Nav sections */}
            <div className="space-y-6">
              
              {/* Menu listings */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 block mb-3 font-mono">MENU</span>
                <nav className="space-y-1.5">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('radar')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'radar'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <Compass className="w-4 h-4 shrink-0" />
                    <span>Technology Radar</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'insights'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <LineChart className="w-4 h-4 shrink-0" />
                    <span>Career & Education</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'reports'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Saved Reports</span>
                  </button>
                </nav>
              </div>

              {/* Analysis list */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 block mb-3 font-mono">ANALYSIS</span>
                <nav className="space-y-1.5">
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'companies'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>Employers Directory</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('geo')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'geo'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <Map className="w-4 h-4 shrink-0" />
                    <span>Geospatial Density</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('trends')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'trends'
                        ? 'bg-zinc-950 text-white border-bold-thin font-black shadow-hard-sm'
                        : 'text-zinc-850 hover:text-zinc-950 hover:bg-zinc-950/5 border border-transparent'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Macro Trends</span>
                  </button>
                </nav>
              </div>

            </div>

          </div>

          {/* User metadata bottom card */}
          <div className="pt-6 border-t border-zinc-950/20 flex items-center justify-between mt-8 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-rose-600 border-bold-thin rounded-full flex items-center justify-center font-black text-xs text-white">
                AM
              </div>
              <div>
                <span className="text-xs font-black block text-zinc-950">Ayoub M.</span>
                <span className="text-[10px] font-bold text-zinc-600 font-mono block">Premium Admin</span>
              </div>
            </div>
            <button 
              onClick={() => showNotification('Opening administration control panel...')}
              className="text-[10px] text-zinc-950 hover:bg-zinc-100 font-mono bg-white border-bold-thin px-2 py-1 rounded cursor-pointer transition-colors shadow-hard-sm"
            >
              Settings
            </button>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MAIN CONTAINER FRAME
            ═══════════════════════════════════════════════════════════ */}
        <main className="flex-1 bg-cream flex flex-col min-w-0">
          
          {/* Header top row panel */}
          <header className="min-h-16 border-b-2 border-zinc-950 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white/95 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-3 flex-1 min-w-0 max-w-md bg-white border-bold-thin rounded-lg px-3 py-1.5 shadow-hard-sm">
              <Search className="w-4 h-4 text-zinc-700" />
              <input 
                type="text" 
                placeholder="Search companies, technologies..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-xs font-semibold focus:outline-none text-zinc-950 placeholder:text-zinc-400 w-full"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Theme Toggle Button */}
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 text-zinc-850 hover:text-zinc-950 cursor-pointer bg-white border-bold-thin shadow-hard-sm rounded-lg flex items-center justify-center"
                aria-label="Toggle Dark Mode"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>

              {/* Notification icon */}
              <button 
                onClick={() => showNotification('You have 3 system crawl recommendations ready')}
                className="relative p-1.5 text-zinc-800 hover:text-zinc-950 cursor-pointer bg-white border-bold-thin shadow-hard-sm rounded-lg"
              >
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                <Bell className="w-4 h-4" />
              </button>

            </div>
          </header>

          {/* ═══════════════════════════════════════════════════════════
              COMMON MULTI-DIMENSIONAL FILTERS SLIDER ROW
              ═══════════════════════════════════════════════════════════ */}
          <div className="bg-sand border-b-2 border-zinc-950 p-5 sticky top-16 z-30">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-950 font-mono">Dynamic Market Filters</span>
              </div>
              <button 
                onClick={resetFilters}
                className="text-[10px] font-bold text-zinc-800 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors font-mono"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Filter grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
              
              {/* City Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono">City</span>
                <select 
                  value={selectedCity} 
                  onChange={(e) => { setSelectedCity(e.target.value); showNotification(`Filtered by City: ${e.target.value}`); }}
                  className="bg-white border-bold-thin rounded-lg p-2 text-xs font-extrabold text-zinc-950 focus:outline-none focus:border-rose-600 transition-all shadow-hard-sm"
                >
                  <option value="All">All Cities</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Fès">Fès</option>
                  <option value="Salé">Salé</option>
                  <option value="Ben Guerir">Ben Guerir</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Marrakech">Marrakech</option>
                </select>
              </div>

              {/* Experience Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono">Experience</span>
                <select 
                  value={selectedExperience} 
                  onChange={(e) => { setSelectedExperience(e.target.value); showNotification(`Filtered by Experience: ${e.target.value}`); }}
                  className="bg-white border-bold-thin rounded-lg p-2 text-xs font-extrabold text-zinc-950 focus:outline-none focus:border-rose-600 transition-all shadow-hard-sm"
                >
                  <option value="All">All Seniorities</option>
                  <option value="Débutant">Débutant (0-1 ans)</option>
                  <option value="Junior">Junior (1-3 ans)</option>
                  <option value="Intermédiaire">Intermédiaire (3-5 ans)</option>
                  <option value="Confirmé">Confirmé (5-10 ans)</option>
                  <option value="Expert">Expert (10+ ans)</option>
                </select>
              </div>

              {/* Contract Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono">Contract</span>
                <select 
                  value={selectedContract} 
                  onChange={(e) => { setSelectedContract(e.target.value); showNotification(`Filtered by Contract: ${e.target.value}`); }}
                  className="bg-white border-bold-thin rounded-lg p-2 text-xs font-extrabold text-zinc-950 focus:outline-none focus:border-rose-600 transition-all shadow-hard-sm"
                >
                  <option value="All">All Modalities</option>
                  <option value="CDI">CDI (Full-time)</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Stage">Stage</option>
                  <option value="Intérim">Intérim</option>
                </select>
              </div>

              {/* Education Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono">Education</span>
                <select 
                  value={selectedEducation} 
                  onChange={(e) => { setSelectedEducation(e.target.value); showNotification(`Filtered by Education: ${e.target.value}`); }}
                  className="bg-white border-bold-thin rounded-lg p-2 text-xs font-extrabold text-zinc-950 focus:outline-none focus:border-rose-600 transition-all shadow-hard-sm"
                >
                  <option value="All">All Degrees</option>
                  <option value="Bac">Bac</option>
                  <option value="Bac+2">Bac+2</option>
                  <option value="Bac+3">Bac+3</option>
                  <option value="Bac+5">Bac+5 (Master)</option>
                  <option value="Doctorat">Doctorat</option>
                </select>
              </div>

              {/* Technology Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono">Technology</span>
                <select 
                  value={selectedTech} 
                  onChange={(e) => { setSelectedTech(e.target.value); showNotification(`Filtered by Tech: ${e.target.value}`); }}
                  className="bg-white border-bold-thin rounded-lg p-2 text-xs font-extrabold text-zinc-950 focus:outline-none focus:border-rose-600 transition-all shadow-hard-sm"
                >
                  <option value="All">All Technologies</option>
                  <option value="Java">Java</option>
                  <option value="Sql">SQL</option>
                  <option value="React">React</option>
                  <option value="Angular">Angular</option>
                  <option value="Python">Python</option>
                  <option value="Docker">Docker</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              {/* Remote Toggle Switch */}
              <div className="flex flex-col justify-end pb-1">
                <span className="text-[9px] uppercase font-black text-zinc-700 font-mono block mb-1">Remote</span>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={remoteOnly} 
                    onChange={(e) => { setRemoteOnly(e.target.checked); showNotification(e.target.checked ? 'Showing Remote-only vacancies' : 'Showing all office modalities'); }}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-zinc-200 border-bold-thin rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-zinc-700 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white peer-checked:border-bold-thin"></div>
                  <span className="text-xs font-bold text-zinc-800 font-mono">Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              MAIN VIEWS SECTION PORT
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 1: DEFAULT MAIN DASHBOARD
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <DashboardOverview filters={filters} />
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 2: TECH RADAR
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'radar' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Technology Demand Radar</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Deep-dive into technology demand patterns across Morocco's tech sector
                  </p>
                </div>

                {/* Primary Technology Ecosystem bar ranking */}
                <div className="bg-white border-bold rounded-xl p-6 shadow-hard text-zinc-950">
                  <h3 className="text-lg font-serif font-black text-zinc-950 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-rose-600" />
                    <span>Technology Demand Volume</span>
                  </h3>

                  <div className="space-y-3.5">
                    {computedTechnologies.map((tech) => {
                      const maxVal = computedTechnologies[0]?.count || 1;
                      const percentage = (tech.count / maxVal) * 100;
                      return (
                        <div key={tech.name} className="flex items-center gap-4">
                          <span className="w-24 text-xs font-mono text-zinc-800 font-black truncate">{tech.name}</span>
                          <div className="flex-1 bg-sand h-7.5 rounded-md overflow-hidden relative border-bold-thin shadow-hard-sm">
                            <div 
                              className="bg-rose-600 h-full rounded-md transition-all duration-500 border-r border-zinc-950"
                              style={{ width: `${Math.max(percentage, 2)}%` }}
                            ></div>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-950 font-mono bg-white px-2 py-0.5 rounded border border-zinc-950/20 shadow-hard-sm">
                              {tech.count.toLocaleString()} offers
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Radar and Table Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Skill Profile radar representation */}
                  <div className="lg:col-span-5 col-span-1 bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                    <h3 className="text-sm font-bold text-zinc-950 font-serif mb-1">Required Skills Profile by Seniority</h3>
                    <p className="text-[10px] text-zinc-650 mb-5">Technology demand variations by experience tier</p>

                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={safeRadarSkillProfileData}>
                          <PolarGrid stroke="#e4e4e7" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#09090b', fontSize: 8 }} />
                          <Radar name="Junior" dataKey="Junior" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                          <Radar name="Mid" dataKey="Mid" stroke="#e11d48" fill="#e11d48" fillOpacity={0.15} />
                          <Radar name="Senior" dataKey="Senior" stroke="#059669" fill="#059669" fillOpacity={0.15} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-5 text-[10px] font-mono font-bold text-zinc-800 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full border border-zinc-950 bg-blue-600"></span>
                        <span>Junior</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full border border-zinc-950 bg-rose-600"></span>
                        <span>Mid-Level</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full border border-zinc-950 bg-emerald-600"></span>
                        <span>Senior</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Contract Type Matrix */}
                  <div className="lg:col-span-7 col-span-1 bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                    <h3 className="text-sm font-bold text-zinc-950 font-serif mb-1">Tech Matrix x Contract Mode</h3>
                    <p className="text-[10px] text-zinc-650 mb-4">Distribution of tech demands mapped to contract modalities</p>

                    <div className="overflow-x-auto rounded-lg border-2 border-zinc-950 bg-white">
                      <table className="w-full text-left text-xs text-zinc-800 border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-sand border-b-2 border-zinc-950 text-[9px] uppercase font-black tracking-wider font-mono text-zinc-900">
                            <th className="p-2.5">Technology</th>
                            <th className="p-2.5 text-right">CDI (offers)</th>
                            <th className="p-2.5 text-right">CDD (offers)</th>
                            <th className="p-2.5 text-right">Freelance</th>
                            <th className="p-2.5 text-right">Internship</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 font-semibold text-[11px]">
                          {techContractMatrix.map((item) => (
                            <tr key={item.tech} className="hover:bg-sand/30">
                              <td className="p-2.5 text-zinc-950 font-black">{item.tech}</td>
                              <td className="p-2.5 text-right font-mono text-rose-600 font-bold">{(Math.round(item.cdi * filterMultiplier)).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-mono text-zinc-600">{(Math.round(item.cdd * filterMultiplier)).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-mono text-blue-600 font-bold">{(Math.round(item.freelance * filterMultiplier)).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-mono text-emerald-600">{(Math.round(item.stage * filterMultiplier)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 3: CAREER & EDUCATION
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'insights' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Seniority & Education Demands</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Analyze average experience requirements and education levels across Morocco's tech sector
                  </p>
                </div>

                {/* Seniority Cards grid list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { title: 'Intermédiaire', offers: '4,274', share: '39.6%', techs: ['Java', 'Spring', 'Docker'], color: 'border-bold' },
                    { title: 'Confirmé', offers: '2,843', share: '26.4%', techs: ['Java', 'AWS', 'Kubernetes'], color: 'border-bold' },
                    { title: 'Junior', offers: '2,227', share: '20.7%', techs: ['Java', 'JavaScript', 'SQL'], color: 'border-bold' },
                    { title: 'Débutant', offers: '1,163', share: '10.8%', techs: ['Python', 'JavaScript', 'React'], color: 'border-bold' },
                    { title: 'Expert', offers: '274', share: '2.5%', techs: ['Architecture', 'AWS', 'DevOps'], color: 'border-bold' }
                  ].map(c => (
                    <div key={c.title} className={`bg-white border-bold rounded-xl p-4.5 flex flex-col justify-between shadow-hard-sm ${c.color}`}>
                      <div>
                        <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-widest">{c.title}</span>
                        <div className="mt-2.5">
                          <span className="text-2xl font-black text-zinc-950 font-serif">{c.offers}</span>
                          <span className="text-[10px] text-zinc-600 block font-mono">{c.share} of total market</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3.5 border-t border-zinc-950/15">
                        <span className="text-[8px] uppercase tracking-wider font-mono text-zinc-550 block mb-1">Top Tech demands:</span>
                        <div className="flex flex-wrap gap-1">
                          {c.techs.map(t => (
                            <span key={t} className="bg-sand text-zinc-900 border-bold-thin font-mono text-[9px] px-1.5 py-0.5 rounded shadow-hard-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphs row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Line chart experience over time */}
                  <div className="lg:col-span-6 col-span-1 bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                    <h3 className="text-sm font-bold text-zinc-950 font-serif mb-1">Experience Requirements Over Time</h3>
                    <p className="text-[10px] text-zinc-650 mb-6">Average years of experience required across posting windows</p>

                    <div className="h-[180px] sm:h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={safeExperienceRequirementsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="year" axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                          <YAxis axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                          <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="3 3" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #09090b', boxShadow: '4px 4px 0px 0px #09090b', fontSize: '11px', color: '#09090b', fontWeight: 'bold' }} />
                          <Line type="monotone" dataKey="CDI" stroke="#e11d48" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="CDD" stroke="#f43f5e" strokeWidth={2} />
                          <Line type="monotone" dataKey="Freelance" stroke="#2563eb" strokeWidth={2} />
                          <Line type="monotone" dataKey="Stage" stroke="#059669" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-4 text-[10px] font-mono font-bold text-zinc-800 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-rose-600"></span>
                        <span>CDI</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-rose-500"></span>
                        <span>CDD</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-blue-600"></span>
                        <span>Freelance</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-emerald-600"></span>
                        <span>Stage</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Bar chart Education level by city */}
                  <div className="lg:col-span-6 col-span-1 bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                    <h3 className="text-sm font-bold text-zinc-950 font-serif mb-1">Education Requirements by Tech Hub</h3>
                    <p className="text-[10px] text-zinc-650 mb-5">Relative density of required degree tiers geographically</p>

                    <div className="h-[180px] sm:h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={safeEducationLevelByCityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="city" axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                          <YAxis axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                          <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="3 3" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #09090b', boxShadow: '4px 4px 0px 0px #09090b', fontSize: '11px', color: '#09090b', fontWeight: 'bold' }} />
                          <Bar dataKey="Bac+5" fill="#2563eb" stackId="a" />
                          <Bar dataKey="Bac+2" fill="#d97706" stackId="a" />
                          <Bar dataKey="Bac" fill="#f43f5e" stackId="a" />
                          <Bar dataKey="Bac+3" fill="#059669" stackId="a" />
                          <Bar dataKey="Doctorat" fill="#e11d48" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] font-mono font-bold text-zinc-800 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-blue-600"></span>
                        <span>Bac+5 (Master)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-rose-500"></span>
                        <span>Bac</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-emerald-600"></span>
                        <span>Bac+3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-yellow-600"></span>
                        <span>Bac+2</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded border border-zinc-950 bg-rose-600"></span>
                        <span>Doctorat</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom distribution stats card row */}
                <div className="bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                  <h3 className="text-sm font-bold text-zinc-950 font-serif mb-4">Degree Distributions Overall</h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                      { degree: 'BAC+5', share: '75.5%', count: '8,140 offers', color: 'text-rose-600' },
                      { degree: 'BAC', share: '21.1%', count: '2,274 offers', color: 'text-zinc-950' },
                      { degree: 'BAC+2', share: '2.5%', count: '270 offers', color: 'text-zinc-800' },
                      { degree: 'BAC+3', share: '0.6%', count: '69 offers', color: 'text-zinc-650' },
                      { degree: 'DOCTORAT', share: '0.1%', count: '15 offers', color: 'text-emerald-600' },
                      { degree: 'NON SPÉCIFIÉ', share: '0.1%', count: '14 offers', color: 'text-zinc-500' }
                    ].map(item => (
                      <div key={item.degree} className="bg-sand border-bold-thin rounded-lg p-3.5 text-center shadow-hard-sm">
                        <span className="text-[10px] font-mono font-black text-zinc-650 block">{item.degree}</span>
                        <div className="mt-1">
                          <span className={`text-xl font-serif font-black ${item.color}`}>{item.share}</span>
                          <span className="text-[9px] text-zinc-600 block font-mono mt-0.5">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 4: SAVED REPORTS
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Exported Reports Archive</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Manage your saved filter combinations and compiled PDF exports
                  </p>
                </div>

                {/* Empty folder visual layout */}
                <div className="bg-white border-bold rounded-xl p-16 text-center max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 mt-10 shadow-hard">
                  <div className="h-16 w-16 rounded-2xl bg-sand border-bold flex items-center justify-center text-rose-600 shadow-hard-sm">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-serif font-black text-zinc-950">No saved reports in this session</h3>
                    <p className="text-xs text-zinc-700 max-w-sm mx-auto leading-relaxed font-sans">
                      When you save customized search profiles, they will accumulate in this dynamic listing.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('dashboard'); showNotification('Switched to primary dashboard'); }}
                    className="bg-zinc-950 hover:bg-cream hover:text-zinc-950 text-white font-black text-xs px-5 py-2.5 rounded-lg border-bold shadow-hard-sm transition-all cursor-pointer"
                  >
                    Go back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 5: COMPANIES DIRECTORY
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'companies' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Employers Directory</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Browse top tech employers, multinational hubs, and regional IT service networks in Morocco
                  </p>
                </div>

                {/* Search row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-sand border-bold p-4.5 rounded-xl shadow-hard-sm">
                  <div className="relative flex-1 max-w-md bg-white border-bold-thin rounded-lg shadow-hard-sm">
                    <Search className="w-4 h-4 text-zinc-700 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search employers by brand name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 text-xs rounded-lg pl-9 pr-4 py-3 focus:outline-none text-zinc-950 placeholder:text-zinc-400 w-full font-semibold"
                    />
                  </div>
                  <span className="text-xs font-black text-zinc-950 font-mono self-center">
                    {computedCompanies.length} Active Employers Matching
                  </span>
                </div>

                {/* Card grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {computedCompanies.map(c => (
                    <div key={c.id} className="bg-white border-bold rounded-xl p-5 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between shadow-hard">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-sand border-bold-thin rounded-lg flex items-center justify-center font-serif font-black text-rose-600 text-sm uppercase shrink-0 shadow-hard-sm">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-black text-zinc-950 text-sm line-clamp-1">{c.name}</h3>
                              <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1.5 mt-0.5 font-bold">
                                <MapPin className="w-3 h-3 text-rose-600" />
                                {c.city}
                              </span>
                            </div>
                          </div>
                          
                          <span className="text-[9px] uppercase font-black text-zinc-950 bg-sand border-bold-thin px-2 py-0.5 rounded font-mono shrink-0 shadow-hard-sm">
                            {c.openPositions} roles
                          </span>
                        </div>

                        <p className="text-[10px] text-zinc-600 mt-4 leading-relaxed line-clamp-2 uppercase font-mono font-bold">
                          {c.segment}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-zinc-200">
                        <span className="text-[9px] uppercase font-black text-zinc-500 font-mono block mb-1.5">Culture Indicators</span>
                        <div className="flex flex-wrap gap-1.5">
                          {c.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-sand text-zinc-950 text-[9px] font-bold px-2 py-0.5 rounded border-bold-thin shadow-hard-sm font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {computedCompanies.length === 0 && (
                    <div className="col-span-full py-16 text-center text-zinc-600 font-serif text-sm">
                      No employers match your dynamic searches or selected indices
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 6: GEOSPATIAL DENSITY
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'geo' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Geographic Density Analysis</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Job posting density and geographic distribution across Moroccan cities
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Top Cities bar */}
                  <div className="lg:col-span-7 bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                    <h3 className="text-base font-serif font-black text-zinc-950 mb-5">Indexed Tech Roles by City</h3>
                    
                    <div className="space-y-3.5">
                      {computedCities.map((city) => {
                        const maxVal = computedCities[0]?.count || 1;
                        const widthPct = (city.count / maxVal) * 100;
                        return (
                          <div key={city.name} className="flex items-center gap-3">
                            <span className="w-24 text-xs font-mono text-zinc-800 font-black truncate">{city.name}</span>
                            <div className="flex-1 bg-sand h-7 rounded overflow-hidden relative border-bold-thin shadow-hard-sm">
                              <div 
                                className="bg-rose-600 h-full rounded transition-all duration-300 border-r border-zinc-950"
                                style={{ width: `${Math.max(widthPct, 1)}%` }}
                              ></div>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono font-black text-zinc-950 bg-white px-1.5 py-0.5 rounded border border-zinc-950/20 shadow-hard-sm">
                                {city.count.toLocaleString()} roles
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Ranked List */}
                  <div className="lg:col-span-5 bg-white border-bold rounded-xl p-5 space-y-4 shadow-hard text-zinc-950">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-zinc-950">
                      <h3 className="text-base font-serif font-black text-zinc-950">City Density Rankings</h3>
                      <span className="text-[10px] text-zinc-650 font-mono font-bold">Total indexed: {computedTotalOffers.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                      {computedCities.map((city, idx) => (
                        <div key={city.name} className="bg-sand border-bold-thin rounded-lg p-3 flex items-center justify-between gap-4 shadow-hard-sm">
                          <div className="flex items-center gap-3">
                            <span className="h-6.5 w-6.5 rounded bg-white border-bold-thin flex items-center justify-center font-mono text-[10px] font-black text-rose-600 shadow-hard-sm">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-black text-zinc-950 text-xs block">{city.name}</span>
                              <span className="text-[9px] text-zinc-600 font-mono font-semibold">Morocco territory</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-zinc-950 font-mono block">{city.count.toLocaleString()}</span>
                            <span className="text-[10px] text-rose-600 font-mono font-black">
                              {computedTotalOffers > 0
                                ? ((city.count / computedTotalOffers) * 100).toFixed(1)
                                : '0.0'}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom KPIs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border-bold rounded-xl p-4.5 flex items-center gap-4 shadow-hard hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    <div className="p-3 bg-rose-50 border-bold-thin rounded-lg text-rose-600 shadow-hard-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black text-zinc-600 font-mono block">Primary Cluster</span>
                      <span className="text-base font-serif font-black text-zinc-950 block mt-0.5">Casablanca</span>
                      <span className="text-[10px] text-zinc-650 font-mono">5,507 indexed postings</span>
                    </div>
                  </div>

                  <div className="bg-white border-bold rounded-xl p-4.5 flex items-center gap-4 shadow-hard hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    <div className="p-3 bg-emerald-50 border-bold-thin rounded-lg text-emerald-600 shadow-hard-sm">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black text-zinc-600 font-mono block">Regional Zones</span>
                      <span className="text-base font-serif font-black text-zinc-950 block mt-0.5">7 Regions Indexed</span>
                      <span className="text-[10px] text-zinc-650 font-mono">De-duplicated coverage</span>
                    </div>
                  </div>

                  <div className="bg-white border-bold rounded-xl p-4.5 flex items-center gap-4 shadow-hard hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    <div className="p-3 bg-blue-50 border-bold-thin rounded-lg text-blue-600 shadow-hard-sm">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black text-zinc-600 font-mono block">Hub Average</span>
                      <span className="text-base font-serif font-black text-zinc-950 block mt-0.5">1,468 postings</span>
                      <span className="text-[10px] text-zinc-650 font-mono">Calculated active mean</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 7: MACRO TRENDS
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'trends' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-serif font-black text-zinc-950 tracking-tight">Market Growth & Trends</h1>
                  <p className="text-xs text-zinc-700 mt-1">
                    Historical vacancy volumes and rolling year-over-year expansion dynamics
                  </p>
                </div>

                {/* Primary Trend Metrics Card List */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'YoY Growth Rate', value: '-19.4%', color: 'text-rose-600', note: 'Annual correction index' },
                    { title: 'Peak Demand Window', value: 'January 2019', color: 'text-zinc-950', note: 'Historical volume record' },
                    { title: 'Lowest Cyclical Drop', value: 'January 2026', color: 'text-zinc-800', note: 'Recent seasonal dip' },
                    { title: 'Total Indexed', value: '10,782', color: 'text-emerald-600', note: 'Rolling rolling records window' }
                  ].map(c => (
                    <div key={c.title} className="bg-white border-bold rounded-xl p-4.5 shadow-hard-sm">
                      <span className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest block">{c.title}</span>
                      <span className={`text-xl font-serif font-black block mt-2 ${c.color}`}>{c.value}</span>
                      <span className="text-[9px] text-zinc-650 block font-mono mt-1">{c.note}</span>
                    </div>
                  ))}
                </div>

                {/* Monthly Volume Area Chart */}
                <div className="bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                  <h3 className="text-base font-serif font-black text-zinc-950 mb-1">Monthly Vacancies Volume Trends</h3>
                  <p className="text-xs text-zinc-600 mb-6">Job offers indexed per month (rolling sequence timeline)</p>

                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={safeMonthlyPostingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                        <YAxis axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
                        <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="3 3" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #09090b', boxShadow: '4px 4px 0px 0px #09090b', fontSize: '11px', color: '#09090b', fontWeight: 'bold' }} />
                        <Area type="monotone" dataKey="offers" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#roseGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Year-over-Year comparison table */}
                <div className="bg-white border-bold rounded-xl p-5 shadow-hard text-zinc-950">
                  <h3 className="text-base font-serif font-black text-zinc-950 mb-4">Historical Year-over-Year Comparative Analysis</h3>
                  
                  <div className="overflow-x-auto rounded-lg border-2 border-zinc-950 bg-white">
                    <table className="w-full text-left text-xs text-zinc-800 border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-sand border-b-2 border-zinc-950 text-[10px] uppercase font-black tracking-wider font-mono text-zinc-900">
                          <th className="p-3">Year Window</th>
                          <th className="p-3 text-right">Total Estimated Posts</th>
                          <th className="p-3 text-right">YoY Change %</th>
                          <th className="p-3">Top Required Tech</th>
                          <th className="p-3">Highest Density Hub</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-semibold">
                        {yoyComparisonData.map((row) => (
                          <tr key={row.year} className="hover:bg-sand/30">
                            <td className="p-3 font-mono text-[11px] font-black text-zinc-950">{row.year}</td>
                            <td className="p-3 text-right font-mono text-zinc-950 font-bold">
                              {Math.round(parseInt(row.posts.replace(/,/g, '')) * filterMultiplier * (1 / filterMultiplier ** 0.35)).toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border-bold-thin shadow-hard-sm ${
                                row.growth.includes('+') ? 'text-emerald-800 bg-emerald-100' : 
                                row.growth.includes('-') ? 'text-rose-800 bg-rose-100' : 'text-zinc-700 bg-white'
                              }`}>
                                {row.growth}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="bg-sand border-bold-thin text-zinc-950 px-2 py-0.5 rounded text-[10px] font-mono shadow-hard-sm">
                                {row.tech}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-zinc-700">{row.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
