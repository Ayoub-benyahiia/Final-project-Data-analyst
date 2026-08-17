"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { SlidersHorizontal, Search, ChevronDown, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterOptions } from "@/modules/dashboard/hooks/useMarketData";
import { CITIES, CONTRACTS, EDUCATIONS, EXP_BUCKETS } from "@/lib/data";

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  searchable?: boolean;
}

export function FilterBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data: dynamicOptions } = useFilterOptions();

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenKey(null);
        setDropdownSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Construct dynamic filters list
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      key: "city",
      label: "City",
      options: dynamicOptions?.cities || CITIES,
      searchable: true,
    },
    {
      key: "contract",
      label: "Contract",
      options: dynamicOptions?.contracts || CONTRACTS,
    },
    {
      key: "education",
      label: "Education",
      options: dynamicOptions?.educations || EDUCATIONS,
    },
    {
      key: "expBucket",
      label: "Experience",
      options: dynamicOptions?.experiences || EXP_BUCKETS,
    },
    {
      key: "technology",
      label: "Hard Skills",
      options: dynamicOptions?.hard_skills || [],
      searchable: true,
    },
    {
      key: "soft_skills",
      label: "Soft Skills",
      options: dynamicOptions?.soft_skills || [],
      searchable: true,
    },
  ], [dynamicOptions]);

  const createQueryString = useCallback(
    (name: string, value: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.length === 0) {
        params.delete(name);
      } else {
        params.set(name, value.join(","));
      }
      return params.toString();
    },
    [searchParams]
  );

  const getSelected = (key: string): string[] => {
    const raw = searchParams.get(key);
    return raw ? raw.split(",") : [];
  };

  const toggleFilter = (key: string, option: string) => {
    const current = getSelected(key);
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    navigate(`${location.pathname}?${createQueryString(key, next)}`);
  };

  const clearFilterGroup = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${location.pathname}?${createQueryString(key, [])}`);
  };

  const clearAllFilters = () => {
    navigate(location.pathname);
    setOpenKey(null);
  };

  const hasFilters = filterConfigs.some((f) => getSelected(f.key).length > 0);

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-[#161719]/95 backdrop-blur-md px-5 py-2"
    >
      <div className="flex items-center justify-between gap-3 max-w-[1440px] mx-auto">
        {/* Left: Filter Label & Quiet Modest Controls */}
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 mr-1.5 text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Filters
            </span>
          </div>

          {filterConfigs.map((filter) => {
            const selected = getSelected(filter.key);
            const isOpen = openKey === filter.key;

            const filteredOptions = filter.options.filter((opt) =>
              String(opt ?? "").toLowerCase().includes(dropdownSearch.toLowerCase())
            );

            return (
              <div key={filter.key} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (isOpen) {
                      setOpenKey(null);
                      setDropdownSearch("");
                    } else {
                      setOpenKey(filter.key);
                      setDropdownSearch("");
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all select-none",
                    selected.length > 0
                      ? "border-slate-900 bg-slate-900 text-white font-medium shadow-sm dark:border-[#D4F84B] dark:bg-[#D4F84B] dark:text-[#161719]"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1F24] text-slate-600 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80",
                    isOpen && "ring-1 ring-slate-900/20 dark:ring-white/20 border-slate-900 dark:border-white"
                  )}
                >
                  <span>{filter.label}</span>

                  {selected.length > 0 && (
                    <span
                      className={cn(
                        "flex h-3.5 min-w-3.5 items-center justify-center rounded text-[9px] font-bold px-1",
                        "bg-[#D4F84B] text-[#161719] dark:bg-[#161719] dark:text-white"
                      )}
                    >
                      {selected.length}
                    </span>
                  )}

                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-150",
                      isOpen && "rotate-180",
                      selected.length > 0 ? "text-slate-300 dark:text-slate-700" : "text-slate-400"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1F24] p-2.5 shadow-xl z-50 animate-[fadeIn_0.12s_ease-out]">
                    {/* Header with Clear button */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {filter.label} <span className="text-slate-400 font-normal">({filter.options.length})</span>
                      </span>
                      {selected.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => clearFilterGroup(filter.key, e)}
                          className="text-[10px] text-slate-900 dark:text-[#D4F84B] hover:underline font-bold"
                        >
                          Clear ({selected.length})
                        </button>
                      )}
                    </div>

                    {/* Search Input for Searchable Lists */}
                    {filter.searchable && filter.options.length > 6 && (
                      <div className="relative mb-1.5">
                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder={`Search ${filter.label.toLowerCase()}...`}
                          value={dropdownSearch}
                          onChange={(e) => setDropdownSearch(e.target.value)}
                          autoFocus
                          className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161719] py-1 pl-7 pr-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-slate-900 dark:focus:border-[#D4F84B] focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Scrollable Options List */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
                      {filteredOptions.length === 0 ? (
                        <div className="py-3 text-center text-xs text-slate-400">
                          No matching options
                        </div>
                      ) : (
                        filteredOptions.map((option) => {
                          const isSelected = selected.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleFilter(filter.key, option)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs text-left transition-colors",
                                isSelected
                                  ? "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white font-medium"
                                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-3.5 w-3.5 items-center justify-center rounded border transition-colors flex-shrink-0",
                                  isSelected
                                    ? "border-slate-900 bg-slate-900 text-[#D4F84B] dark:border-[#D4F84B] dark:bg-[#D4F84B] dark:text-[#161719]"
                                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161719]"
                                )}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{option}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Clear All Action */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1F24] px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shadow-sm"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </header>
  );
}
