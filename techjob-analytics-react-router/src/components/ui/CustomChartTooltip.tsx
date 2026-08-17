import React from "react";

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, any>;
    [key: string]: any;
  }>;
  label?: string;
  suffix?: string;
  prefix?: string;
  valueFormatter?: (val: number) => string;
}

export function CustomChartTooltip({
  active,
  payload,
  label,
  suffix = "",
  prefix = "",
  valueFormatter,
}: CustomChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];
  const title = label || item.name || item.payload?.name || item.payload?.city || item.payload?.skill || item.payload?.sector || "";
  const rawValue = item.value;
  const numValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  const formattedValue = !isNaN(numValue)
    ? valueFormatter
      ? valueFormatter(numValue)
      : `${prefix}${numValue.toLocaleString()}${suffix ? ` ${suffix}` : ""}`
    : String(rawValue);

  return (
    <div className="rounded-lg border border-white/[0.1] bg-[#161719] text-white px-2.5 py-1.5 shadow-xl backdrop-blur-md transition-all select-none">
      {title && <div className="text-[10px] font-medium text-slate-400 mb-0.5">{title}</div>}
      <div className="flex items-center gap-1.5">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: item.color || "#D4F84B" }}
        />
        <div className="text-xs font-extrabold text-white tracking-tight tabular-nums">
          {formattedValue}
        </div>
      </div>
      {item.payload?.pct !== undefined && (
        <div className="text-[9px] font-medium text-slate-400 mt-0.5">
          Share: <span className="font-bold text-[#D4F84B]">{item.payload.pct}%</span>
        </div>
      )}
    </div>
  );
}
