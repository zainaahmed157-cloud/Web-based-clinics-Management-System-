import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function ChartBar({ data }) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const [showNew, setShowNew] = useState(false);
  const [showOld, setShowOld] = useState(false);

  let total = 0;
  data.forEach((item) => {
    if (showNew) total += item.new || 0;
    else if (showOld) total += item.exixiting || 0;
    else total += (item.exixiting || 0) + (item.new || 0);
  });

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-[var(--shadow-soft)]"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      dir={isEnglish ? "ltr" : "rtl"}
    >
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowNew(false); setShowOld(false); }}
            className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
          >
            {t("chartBar.showAll")}
          </button>
        </div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t("chartBar.title")}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-3 px-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowNew(true); setShowOld(false); }}
            className="flex items-center gap-2 text-xs transition"
            style={{ color: showNew ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            <span className={`h-2.5 w-2.5 rounded-full bg-[var(--primary)] ${showNew ? 'ring-2 ring-[var(--primary)]/30' : ''}`} />
           {t("chartBar.newPatients")}
          </button>
          <button
            onClick={() => { setShowOld(true); setShowNew(false); }}
            className="flex items-center gap-2 text-xs transition"
            style={{ color: showOld ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            <span className={`h-2.5 w-2.5 rounded-full bg-[#D7DCF4] ${showOld ? 'ring-2 ring-[#D7DCF4]/40' : ''}`} />
            {t("chartBar.existingPatients")}
          </button>
        </div>
        <h3 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {t("chartBar.totalPatients")} : {total}
        </h3>
      </div>

      {/* Chart */}
      <div className="h-64 min-h-64 w-full min-w-0 px-2 pb-4">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t("chartBar.noData")}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {t("chartBar.noDataSubtitle")}
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={18} barGap={-20}>
              <defs>
                <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="oldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D7DCF4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#D7DCF4" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="var(--card-border)" />
              <XAxis
                reversed={!isEnglish}
                dataKey="date"
                tickMargin={8}
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => { try { return format(new Date(v), 'dd MMM'); } catch { return String(v); } }}
              />
              <YAxis
                orientation={isEnglish ? "left" : "right"}
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(15,23,42,0.04)' }}
                contentStyle={{
                  borderRadius: '14px',
                  border: 'none',
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              />
              <Bar dataKey="exixiting" fill="url(#oldGradient)" barSize={20} radius={[8,8,8,8]} className={showNew ? 'hidden' : 'duration-300'} />
              <Bar dataKey="new" fill="url(#newGradient)" barSize={20} radius={[8,8,8,8]} className={showOld ? 'hidden' : 'duration-300'} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
