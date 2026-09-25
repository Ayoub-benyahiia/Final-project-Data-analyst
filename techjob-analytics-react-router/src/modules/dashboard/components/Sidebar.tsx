import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Share2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  Menu,
} from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { useMarketPulse } from "@/modules/dashboard/hooks/useMarketData";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

const analyticsNavItems = [
  { href: "/dashboard", label: "Market Overview", icon: LayoutDashboard },
  { href: "/dashboard/analysis", label: "Detailed Analysis", icon: BarChart3 },
];

const intelligenceNavItems = [
  { href: "/dashboard/matcher", label: "Stack Matcher", icon: Target },
  { href: "/dashboard/skills/pairings", label: "Skill Pairings", icon: Share2 },
  { href: "/dashboard/skills/catalog", label: "Skills Catalog", icon: BookOpen },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
      <SidebarInner
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </SidebarContext.Provider>
  );
}

interface SidebarInnerProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

function SidebarInner({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarInnerProps) {
  const location = useLocation();
  const { data: pulseData } = useMarketPulse();

  const totalJobs = pulseData ? pulseData.total_jobs.toLocaleString() : "10,782";
  const totalCities = pulseData ? pulseData.total_cities : 27;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Monad Parchment Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 flex h-screen min-h-screen flex-col border-r border-[#cecac8] bg-[#f6f3f1] text-[#242424] transition-all duration-200 select-none overflow-x-hidden font-mono",
          "lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64",
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full w-64 lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 flex-shrink-0 items-center justify-between border-b border-[#cecac8] px-4">
          <Link to="/" className="flex items-center gap-3 min-w-0 group">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1] transition-transform group-hover:scale-105">
              <TrendingUp className="h-4 w-4 stroke-[2]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-[15px] font-normal tracking-[-0.02em] text-[#242424] truncate">
                  TechJob <span className="text-[#4e4d4d]">Analytics</span>
                </span>
                <span className="text-[9px] font-mono text-[#797776] tracking-wider uppercase truncate">
                  Market Intelligence
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center rounded-full p-2 text-[#4e4d4d] hover:bg-[#cecac8]/30 hover:text-[#242424]"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-6 space-y-6">
          {/* Group 1: Analytics */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#797776]">
                Analytics
              </div>
            )}
            <ul className="space-y-1.5">
              {analyticsNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2.5 text-xs transition-all relative group font-mono",
                        isActive
                          ? "bg-[#cfdaf5] text-[#2b59d1] font-medium border border-[#a0b5eb]"
                          : "text-[#4e4d4d] hover:bg-[#cecac8]/25 hover:text-[#242424]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-[#2b59d1] stroke-[2]" : "text-[#797776] group-hover:text-[#242424]"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 2: Intelligence */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#797776]">
                Intelligence
              </div>
            )}
            <ul className="space-y-1.5">
              {intelligenceNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2.5 text-xs transition-all relative group font-mono",
                        isActive
                          ? "bg-[#cfdaf5] text-[#2b59d1] font-medium border border-[#a0b5eb]"
                          : "text-[#4e4d4d] hover:bg-[#cecac8]/25 hover:text-[#242424]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-[#2b59d1] stroke-[2]" : "text-[#797776] group-hover:text-[#242424]"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Anchored Bottom: TechJob Data Engine Status Panel */}
        <div className="flex-shrink-0 px-3 pb-3">
          {!collapsed ? (
            <div className="rounded-[28px] bg-[#f6f3f1] p-4 text-[#242424] border border-[#cecac8]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#a7fccd] border border-[#242424]/30" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#242424]">
                    Data Engine
                  </span>
                </div>
                <span className="rounded-full bg-[#cecac8]/30 border border-[#cecac8] px-2.5 py-0.5 text-[9px] font-mono text-[#242424]">
                  LIVE
                </span>
              </div>

              <div className="space-y-0.5 mb-3">
                <div className="text-[9px] font-mono uppercase tracking-wider text-[#797776]">
                  Live Market Feed
                </div>
                <div className="text-xl font-mono text-[#242424] tabular-nums tracking-tight leading-none pt-1">
                  {totalJobs}
                </div>
                <div className="text-[10px] font-mono text-[#797776] uppercase tracking-wider">
                  Job Postings
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#cecac8]/50 text-left">
                <div>
                  <div className="text-xs font-mono text-[#242424] leading-none tabular-nums">
                    {totalCities}
                  </div>
                  <div className="text-[9px] font-mono text-[#797776] uppercase tracking-wider mt-0.5">
                    Cities
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-[#242424] leading-none tabular-nums">
                    2026
                  </div>
                  <div className="text-[9px] font-mono text-[#797776] uppercase tracking-wider mt-0.5">
                    Dataset
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#f6f3f1] text-[#242424] border border-[#cecac8]"
              title={`TechJob Data Engine — Live Feed (${totalJobs} postings, ${totalCities} cities, 2026 Dataset)`}
            >
              <span className="h-2 w-2 rounded-full bg-[#a7fccd]" />
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <div className="flex-shrink-0 px-3 pb-3 pt-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center rounded-full py-1.5 text-[#797776] hover:bg-[#cecac8]/30 hover:text-[#242424] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { setMobileOpen } = useSidebar();
  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="lg:hidden flex items-center justify-center rounded-full border border-[#cecac8] bg-[#f6f3f1] p-2.5 text-[#242424] hover:bg-[#cecac8]/30 transition-colors"
      aria-label="Open navigation menu"
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}

