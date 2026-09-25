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
  const title =
    label ||
    item.name ||
    item.payload?.name ||
    item.payload?.city ||
    item.payload?.skill ||
    item.payload?.sector ||
    item.payload?.level ||
    "";
  const rawValue = item.value;
  const numValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  const formattedValue = !isNaN(numValue)
    ? valueFormatter
      ? valueFormatter(numValue)
      : `${prefix}${numValue.toLocaleString()}${suffix ? ` ${suffix}` : ""}`
    : String(rawValue);

  return (
    <div className="rounded-2xl border border-[#cecac8] bg-[#f6f3f1] text-[#242424] px-4 py-3 shadow-ambient select-none font-mono">
      {title && <div className="text-[11px] text-[#797776] mb-1 uppercase tracking-wider">{title}</div>}
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.color || "#2b59d1" }}
        />
        <div className="text-xs font-medium text-[#242424] tracking-tight tabular-nums">
          {formattedValue}
        </div>
      </div>
      {item.payload?.pct !== undefined && (
        <div className="text-[11px] text-[#4e4d4d] mt-1.5 border-t border-[#cecac8]/60 pt-1">
          Share: <span className="font-medium text-[#2b59d1]">{item.payload.pct}%</span>
        </div>
      )}
    </div>
  );
}

