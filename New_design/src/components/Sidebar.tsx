import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Puzzle, GitBranch, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

const navItems = [
  { label: 'Market Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Detailed Analysis', path: '/dashboard/analysis', icon: BarChart3 },
  { label: 'Stack Matcher', path: '/dashboard/matcher', icon: Puzzle },
  { label: 'Skill Pairings', path: '/dashboard/skills/pairings', icon: GitBranch },
];

export function Sidebar({ collapsed, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className={cn(
      "flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
      collapsed ? "w-[72px]" : "w-[240px]"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div 
          className={cn("flex items-center cursor-pointer overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}
          onClick={() => {
            navigate('/');
            onCloseMobile?.();
          }}
        >
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">TJ</div>
          <span className="ml-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">TechJob SaaS</span>
        </div>
        {!collapsed && (
          <button onClick={onToggleCollapse} className="hidden md:flex p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ChevronLeft size={20} />
          </button>
        )}
        {collapsed && (
           <button onClick={onToggleCollapse} className="hidden md:flex p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 mx-auto">
             <ChevronRight size={20} />
           </button>
        )}
      </div>
      <nav className="flex-1 py-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => onCloseMobile?.()}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                isActive 
                  ? "border-l-4 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                  : "border-l-4 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon size={20} className={cn("shrink-0", collapsed ? "mx-auto" : "mr-3")} />
              <span className={cn("whitespace-nowrap overflow-hidden transition-all", collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block")}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className={cn("flex items-center text-xs text-slate-500 dark:text-slate-400", collapsed ? "justify-center" : "justify-start")}>
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
          <span className={cn("ml-2 whitespace-nowrap overflow-hidden transition-all", collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block")}>
            DuckDB Active
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
