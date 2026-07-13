import { useEffect, useRef, useState } from 'react';
import {
  addDays, addMonths, endOfMonth, endOfWeek,
  format, isAfter, isBefore, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek,
} from 'date-fns';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ar, enUS } from "date-fns/locale";
const WEEK_LABELS_AR = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];
const WEEK_LABELS_EN = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export default function DashboardHeader({ range, setRange }) {
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
const locale = isEnglish ? enUS : ar;
const WEEK_LABELS = isEnglish ? WEEK_LABELS_EN : WEEK_LABELS_AR;
const MONTHS = isEnglish ? MONTHS_EN : MONTHS_AR;
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => range?.from ?? new Date());
  const [pendingRange, setPendingRange] = useState(range ?? {});
  const CalendarRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => { setPendingRange(range ?? {}); }, [range]);
  useEffect(() => { if (range?.from) setViewDate(range.from); }, [range?.from]);

  useEffect(() => {
    function handleOutside(event) {
      if (modalRef.current?.contains(event.target)) return;
      if (CalendarRef.current?.contains(event.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });
  const days = [];
  let d = calendarStart;
  while (d <= calendarEnd) { days.push(d); d = addDays(d, 1); }

  const handleSelect = (selected) => {
    const { from, to } = pendingRange;
    if (!from) { setPendingRange({ from: selected, to: selected }); return; }
    if (from && to) {
      if (!isSameDay(from, to)) { setPendingRange({ from: selected, to: selected }); return; }
      if (isBefore(selected, from)) { setPendingRange({ from: selected, to: from }); return; }
      if (isSameDay(selected, from)) { setPendingRange({ from: selected, to: selected }); return; }
      setPendingRange({ from, to: selected }); return;
    }
    if (isBefore(selected, from)) setPendingRange({ from: selected, to: from });
    else if (isSameDay(selected, from)) setPendingRange({ from: selected, to: selected });
    else setPendingRange({ from, to: selected });
  };

  const isInRange = (date) => {
    if (!pendingRange.from || !pendingRange.to) return false;
    return (isAfter(date, pendingRange.from) || isSameDay(date, pendingRange.from))
      && (isBefore(date, pendingRange.to) || isSameDay(date, pendingRange.to));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" dir={isEnglish ? "ltr" : "rtl"}>
      <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t("dashboardHeader.title")}
          </h2>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            {t("dashboardHeader.subtitle")}
          </p>
        </div>

        <div className="relative w-full sm:w-auto" ref={CalendarRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between gap-2 border px-3 py-1.5 rounded-xl shadow-[var(--shadow-soft)] cursor-pointer transition sm:min-w-[160px]"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <span className="text-[11px] truncate max-w-[180px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
              {range?.from && range?.to
                ? `${format(range.from, "dd MMM yyyy", { locale })} - ${format(range.to, "dd MMM yyyy", { locale })}`
                : (t("dashboardHeader.chooseDate"))}
            </span>
            <Calendar size={16} style={{ color: 'var(--text-primary)' }} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={isEnglish ? "ltr" : "rtl"}>
                <div ref={modalRef} className="w-[280px] sm:w-[320px] rounded-2xl border p-3 sm:p-4 shadow-[var(--shadow-hover)]"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                    <button
                      onClick={() => setViewDate(addMonths(viewDate, -1))}
                      className="h-7 w-7 rounded-full border hover:bg-[var(--hover-bg)] transition"
                      style={{ borderColor: 'var(--card-border)' }}
                    >◀</button>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
                    </div>
                    <button
                      onClick={() => setViewDate(addMonths(viewDate, 1))}
                      className="h-7 w-7 rounded-full border hover:bg-[var(--hover-bg)] transition"
                      style={{ borderColor: 'var(--card-border)' }}
                    >▶</button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-[10px] py-2" style={{ color: 'var(--text-secondary)' }}>
                    {WEEK_LABELS.map((label) => (
                      <div key={label} className="text-center">{label}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-[11px]">
                    {days.map((date) => {
                      const isSelected = (pendingRange.from && isSameDay(date, pendingRange.from)) || (pendingRange.to && isSameDay(date, pendingRange.to));
                      const inRange = isInRange(date);
                      const muted = !isSameMonth(date, monthStart);
                      const todayDate = isToday(date);
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleSelect(date)}
                          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-all"
                          style={{
                            color: muted ? 'color-mix(in srgb, var(--text-secondary) 50%, transparent)' : 'var(--text-primary)',
                            background: isSelected ? '#0f1b3d' : inRange ? 'rgba(31,43,108,0.1)' : 'transparent',
                            color: isSelected ? '#fff' : muted ? 'color-mix(in srgb, var(--text-secondary) 50%, transparent)' : 'var(--text-primary)',
                            outline: todayDate && !isSelected ? '1px solid rgba(31,43,108,0.4)' : undefined,
                          }}
                        >
                          {format(date, 'd')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t pt-3 mt-3" style={{ borderColor: 'var(--card-border)' }}>
                    <button
                      onClick={() => { setPendingRange(range ?? {}); setOpen(false); }}
                      className="px-3 py-1.5 text-xs rounded-xl border hover:bg-[var(--hover-bg)] transition"
                      style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    >
                      {t("dashboardHeader.cancel")}
                    </button>
                    <button
                      onClick={() => { setRange(pendingRange); setOpen(false); }}
                      className="px-3 py-1.5 text-xs rounded-xl text-white hover:opacity-90 transition"
                      style={{ background: '#0f1b3d' }}
                    >
                    {t("dashboardHeader.apply")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
