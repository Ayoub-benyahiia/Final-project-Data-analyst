import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Target,
  Compass,
  Building2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export type DashboardModuleId = 'overview' | 'skills' | 'matcher' | 'career' | 'companies' | 'juniors';

interface SidebarProps {
  activeModule: DashboardModuleId;
  onSelectModule: (module: DashboardModuleId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBackToHome?: () => void;
}

export function Sidebar({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  onBackToHome
}: SidebarProps) {
  const navItems = [
    {
      id: 'overview' as DashboardModuleId,
      label: 'Market Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'skills' as DashboardModuleId,
      label: 'Skills Radar & Graph',
      icon: Sparkles,
      badge: 'Core'
    },
    {
      id: 'matcher' as DashboardModuleId,
      label: 'Stack Matcher & ROI',
      icon: Target,
      badge: 'Boost'
    },
    {
      id: 'career' as DashboardModuleId,
      label: 'Career Simulator',
      icon: Compass,
      badge: 'New'
    },
    {
      id: 'companies' as DashboardModuleId,
      label: 'Company Intelligence',
      icon: Building2,
      badge: 'Live'
    },
    {
      id: 'juniors' as DashboardModuleId,
      label: 'Junior Lens & Heatmap',
      icon: GraduationCap,
      badge: '31.5%'
    }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* ── Brand Logo Header ── */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
          {!collapsed ? (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                TJ
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-1.5 font-sans">
                  TechJob
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                    SaaS
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Morocco IT Intelligence</p>
              </div>
            </button>
          ) : (
            <button
              onClick={onBackToHome}
              className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20 cursor-pointer"
              title="Return to Home"
            >
              TJ
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Navigation Items ── */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                          item.badge === 'New'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : item.badge === 'Boost'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Footer / OLAP Engine Status ── */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DuckDB OLAP Engine</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px]">
              10,782 Parquet Rows · &lt;15ms latency
            </p>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500" title="DuckDB OLAP Active (<15ms)">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
