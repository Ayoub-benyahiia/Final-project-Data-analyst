import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { SlidersHorizontal, Search, ChevronDown, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileMenuButton } from "@/modules/dashboard/components/Sidebar";
import { useFilterOptions } from "@/modules/dashboard/hooks/useMarketData";
import { CITIES, CONTRACTS, EDUCATIONS, EXP_BUCKETS } from "@/lib/data";

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  searchable?: boolean;
  popoverWidth?: string;
}

export function FilterBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data: dynamicOptions } = useFilterOptions();

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenKey(null);
        setDropdownSearch("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenKey(null);
        setDropdownSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      key: "city",
      label: "City",
      options: dynamicOptions?.cities || CITIES,
      searchable: true,
      popoverWidth: "w-[280px]",
    },
    {
      key: "contract",
      label: "Contract",
      options: dynamicOptions?.contracts || CONTRACTS,
      popoverWidth: "w-[240px]",
    },
    {
      key: "education",
      label: "Education",
      options: dynamicOptions?.educations || EDUCATIONS,
      popoverWidth: "w-[260px]",
    },
    {
      key: "expBucket",
      label: "Experience",
      options: dynamicOptions?.experiences || EXP_BUCKETS,
      popoverWidth: "w-[260px]",
    },
    {
      key: "technology",
      label: "Hard Skills",
      options: dynamicOptions?.hard_skills || [],
      searchable: true,
      popoverWidth: "w-[320px]",
    },
    {
      key: "soft_skills",
      label: "Soft Skills",
      options: dynamicOptions?.soft_skills || [],
      searchable: true,
      popoverWidth: "w-[320px]",
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
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  };

  const toggleFilter = (key: string, option: string) => {
    const current = getSelected(key);
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    navigate(`${location.pathname}?${createQueryString(key, next)}`);
  };

  const clearFilterGroup = (key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`${location.pathname}?${createQueryString(key, [])}`);
  };

  const clearAllFilters = () => {
    navigate(location.pathname);
    setOpenKey(null);
    setDropdownSearch("");
  };

  const totalActiveFiltersCount = filterConfigs.reduce(
    (acc, f) => acc + getSelected(f.key).length,
    0
  );
  const hasFilters = totalActiveFiltersCount > 0;

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-30 border-b border-[#cecac8] bg-[#f6f3f1]/95 backdrop-blur-[4px] px-4 sm:px-6 py-3 w-full select-none font-mono"
    >
      <div className="flex items-center justify-between gap-3 max-w-[1432px] mx-auto w-full min-w-0">
        {/* Mobile drawer toggle button */}
        <MobileMenuButton />

        {/* Scrollable Filter Pills Rail */}
        <div className="flex flex-1 items-center gap-2.5 overflow-x-auto lg:overflow-visible no-scrollbar min-w-0 py-0.5">
          {/* Global Filter Indicator Pill */}
          <div className="flex items-center gap-2 rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 h-10 text-xs font-mono text-[#242424] flex-shrink-0 select-none">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#242424] stroke-[2]" />
            <span className="uppercase tracking-wider">Filters</span>
            {hasFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2b59d1] text-white px-1.5 text-[10px] font-mono font-medium ml-1">
                {totalActiveFiltersCount}
              </span>
            )}
          </div>

          {/* Individual Filter Dropdown Buttons */}
          {filterConfigs.map((filter) => {
            const selected = getSelected(filter.key);
            const isOpen = openKey === filter.key;
            const isSelected = selected.length > 0;

            const filteredOptions = filter.options.filter((opt) =>
              String(opt ?? "").toLowerCase().includes(dropdownSearch.toLowerCase())
            );

            return (
              <div key={filter.key} className="relative flex-shrink-0">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                  aria-label={`${filter.label} filter`}
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
                    "flex items-center gap-2 rounded-full border h-10 px-4 text-xs font-mono transition-all select-none",
                    isSelected
                      ? "border-[#a0b5eb] bg-[#cfdaf5] text-[#2b59d1] font-medium"
                      : "border-[#cecac8] bg-[#f6f3f1] text-[#4e4d4d] hover:border-[#242424] hover:text-[#242424]",
                    isOpen && "border-[#242424] ring-1 ring-[#242424] text-[#242424]"
                  )}
                >
                  <span className="tracking-tight">{filter.label}</span>

                  {isSelected && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2b59d1] text-white px-1.5 text-[10px] font-mono">
                      {selected.length}
                    </span>
                  )}

                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200 text-[#797776]",
                      isSelected && "text-[#2b59d1]",
                      isOpen && "rotate-180 text-[#242424]"
                    )}
                  />
                </button>

                {/* Floating Filter Popover */}
                {isOpen && (
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 mt-2 rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-4 text-[#242424] shadow-ambient animate-slide-up font-mono",
                      filter.popoverWidth || "w-[280px]"
                    )}
                  >
                    {/* Instant Search Bar */}
                    {filter.searchable && (
                      <div className="mb-3">
                        <div className="relative flex items-center">
                          <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#797776]" />
                          <input
                            type="text"
                            placeholder={`Search ${filter.label.toLowerCase()}...`}
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="w-full rounded-full border border-[#cecac8] bg-[#f6f3f1] py-2 pl-9 pr-4 text-xs text-[#242424] placeholder:text-[#797776] focus:border-[#242424] focus:outline-none transition-all font-mono"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {/* Scrollable Checkbox Options List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                      {filteredOptions.length === 0 ? (
                        <p className="p-4 text-center text-xs text-[#797776] italic">No matching options</p>
                      ) : (
                        filteredOptions.map((opt) => {
                          const optStr = String(opt ?? "");
                          const isOptSelected = selected.includes(optStr);
                          return (
                            <button
                              key={optStr}
                              type="button"
                              onClick={() => toggleFilter(filter.key, optStr)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-xs transition-colors text-left group select-none font-mono",
                                isOptSelected
                                  ? "bg-[#cfdaf5] text-[#2b59d1] font-medium"
                                  : "text-[#4e4d4d] hover:bg-[#cecac8]/25 hover:text-[#242424]"
                              )}
                            >
                              {/* Custom Styled Checkbox Pill */}
                              <span
                                className={cn(
                                  "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
                                  isOptSelected
                                    ? "bg-[#2b59d1] border-[#2b59d1] text-white"
                                    : "border-[#cecac8] bg-[#f6f3f1] group-hover:border-[#242424]"
                                )}
                              >
                                {isOptSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </span>

                              <span className="truncate flex-1">{optStr}</span>
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Popover Footer: Count + Actions */}
                    <div className="mt-3 flex items-center justify-between border-t border-[#cecac8]/60 pt-3 px-1">
                      <span className="text-[11px] font-mono text-[#797776]">
                        {selected.length} selected
                      </span>

                      <div className="flex items-center gap-2">
                        {selected.length > 0 && (
                          <button
                            type="button"
                            onClick={() => clearFilterGroup(filter.key)}
                            className="rounded-full px-3 py-1 text-xs font-mono text-[#797776] hover:bg-[#cecac8]/30 hover:text-[#242424] transition-colors"
                          >
                            Clear
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenKey(null);
                            setDropdownSearch("");
                          }}
                          className="rounded-full bg-[#242424] px-4 py-1.5 text-xs font-mono text-[#f6f3f1] hover:bg-[#4e4d4d] transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Clear All Button */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 h-10 text-xs font-mono text-[#797776] hover:text-[#242424] hover:border-[#242424] transition-all flex-shrink-0 select-none"
              title="Reset all filters to dataset baseline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

