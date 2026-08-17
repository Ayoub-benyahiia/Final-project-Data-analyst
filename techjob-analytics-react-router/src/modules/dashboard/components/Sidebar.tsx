"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Star,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  HelpCircle,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

const mainNavItems = [
  { href: "/dashboard", label: "Market Overview", icon: LayoutDashboard },
  { href: "/dashboard/analysis", label: "Detailed Analysis", icon: BarChart3 },
  { href: "/dashboard/matcher", label: "Stack Matcher", icon: Star },
  { href: "/dashboard/skills/pairings", label: "Skill Pairings", icon: Users },
  { href: "/dashboard/skills/catalog", label: "Skills Catalog", icon: Sparkles },
];

const generalNavItems = [
  { href: "/#pipeline", label: "Data Pipeline", icon: Database },
  { href: "/#faq", label: "Documentation", icon: HelpCircle },
  { href: "/#settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex h-screen min-h-screen flex-col border-r border-[#232529] bg-[#161719] text-white transition-all duration-200 select-none overflow-x-hidden",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* 1. Fixed Header (No Scroll) */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#D4F84B] text-[#161719] shadow-sm">
            <span className="text-sm font-black tracking-tighter">TJ</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                TechJob <span className="text-[9px] uppercase font-extrabold bg-white/10 text-[#D4F84B] px-1.5 py-0.2 rounded-full">SaaS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">Morocco IT Analytics</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Scrollable Body Area (Zero Browser Scrollbar Artifacts) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-2.5 py-3 space-y-4">
        {/* Main Menu Section */}
        <div>
          {!collapsed && (
            <div className="px-2.5 pb-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
              Menu
            </div>
          )}
          <ul className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all group",
                      isActive
                        ? "bg-white/[0.08] text-white font-semibold shadow-sm"
                        : "text-[#8E929C] hover:bg-white/[0.04] hover:text-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors flex-shrink-0",
                        isActive
                          ? "bg-[#D4F84B] text-[#161719]"
                          : "text-[#8E929C] group-hover:text-white"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* General Section */}
        <div>
          {!collapsed && (
            <div className="px-2.5 pb-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
              General
            </div>
          )}
          <ul className="space-y-0.5">
            {generalNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#8E929C] hover:bg-white/[0.04] hover:text-slate-200 transition-all group"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md text-[#8E929C] group-hover:text-white flex-shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pro / Live Pipeline Badge Card */}
        {!collapsed && (
          <div className="rounded-xl border border-white/[0.06] bg-[#1E1F24] p-3 text-center">
            <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4F84B]/15 text-[#D4F84B]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="text-[11px] font-bold text-white">DuckDB OLAP Live</div>
            <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">
              10,782 records in-memory with sub-15ms vectorized queries.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4F84B] px-2.5 py-0.5 text-[9px] font-extrabold text-[#161719]">
                Star Schema V2 <ArrowUpRight className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Fixed Footer (Stable User Info + Collapse Trigger) */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-2.5 space-y-1.5 bg-[#161719]">
        {!collapsed && (
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2">
            <div className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white ring-1 ring-[#D4F84B]/50">
              IT
              <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#10B981] ring-1 ring-[#161719]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-white truncate">Data Analyst</div>
              <div className="text-[9px] text-slate-400 truncate">Enterprise Admin</div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-md py-1 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
    </aside>
  );
}
