import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ar } from "date-fns/locale";
import { useLocale } from "@/lib/hooks";

export default function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const localeStr = useLocale();
  const isRtl = localeStr === "ar";

  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 shadow-[var(--shadow-soft)] flex flex-col h-full overflow-hidden">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-(--text-primary)">التقويم</h2>
        <p className="text-xs text-(--text-secondary) mt-1">
          نظرة سريعة على المواعيد
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <style>
          {`
            .rdp {
              --rdp-cell-size: 38px;
              --rdp-accent-color: #1F2B6C;
              --rdp-background-color: #EBF2F9;
              margin: 0;
            }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: var(--rdp-accent-color);
              color: white;
              font-weight: bold;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: var(--rdp-background-color);
              color: var(--rdp-accent-color);
            }
            .rdp-head_cell {
              font-size: 0.8rem;
              text-transform: uppercase;
              color: var(--text-secondary);
            }
            .rdp-day {
              font-size: 0.875rem;
              color: var(--text-primary);
            }
          `}
        </style>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={isRtl ? ar : undefined}
          dir={isRtl ? "rtl" : "ltr"}
          className="bg-transparent"
        />
      </div>
    </div>
  );
}
