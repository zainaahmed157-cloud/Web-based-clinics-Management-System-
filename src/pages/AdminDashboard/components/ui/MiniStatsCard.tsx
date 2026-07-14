import { ReactNode } from "react";

interface MiniStatsCardProps {
  title: string;
  value: number | string;
  percentage: number;
  icon: ReactNode;
  iconBg: string;
}

export default function MiniStatsCard({
  title,
  value,
  percentage,
  icon,
  iconBg,
}: MiniStatsCardProps) {
  return (
    <div className="group flex items-center justify-between bg-(--card-bg) border border-(--card-border) rounded-2xl p-4 shadow-[var(--shadow-soft)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`${iconBg} w-12 h-12 rounded-full flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-(--text-secondary) mb-1">
            {title}
          </p>
          <h3 className="text-xl font-bold text-(--text-primary)">
            {value.toLocaleString()}
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-lg ${
            percentage >= 0
              ? "bg-[#DCFCE7] text-[#008236] border border-[#B9F8CF]"
              : "bg-[#FFE2E2] text-[#C10007] border border-[#FFC9C9]"
          }`}
        >
          {percentage > 0 ? "+" : ""}
          {percentage}%
        </span>
      </div>
    </div>
  );
}
