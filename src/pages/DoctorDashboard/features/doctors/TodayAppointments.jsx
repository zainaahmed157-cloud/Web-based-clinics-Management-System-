import { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TodayAppointments({ appointments: appointmentsProp }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const rows = appointmentsProp ?? [];
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  const filtered = useMemo(() =>
    rows.filter((a) => a.date === selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [rows, selectedDate]
  );

  const currentTime = new Date().toTimeString().slice(0, 5);
  const getStatus = (time) => time <= currentTime ? (isRtl ? 'جارٍ الفحص' : 'Ongoing Exam') : null;

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const { start, end } = getWeekRange(currentDate);

  const formatRange = () => {
    const options = { month: 'short', year: 'numeric' };
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', options)}`;
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      day: d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'short' }),
      date: d.toISOString().split('T')[0],
      num: d.getDate(),
    };
  });

  return (
    <div className="flex flex-col rounded-2xl border shadow-[var(--shadow-soft)] w-full" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', height: '388px' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b mb-4 p-4" style={{ borderColor: 'var(--card-border)' }}>
        <button className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
          {isRtl ? 'كل المواعيد' : 'All Appointments'}
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'مواعيد اليوم' : "Today's Appointments"}
        </h1>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto px-4 pb-2">
        {filtered.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد مواعيد اليوم' : 'No appointments today'}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'اختر يوماً آخر' : 'Select another day'}</p>
            </div>
          </div>
        )}
        {filtered.map((item, i) => {
          const status = getStatus(item.time);
          return (
            <div key={item.id || i} className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {status ? (
                  <span className="text-[11px] bg-green-100 text-green-600 px-2 py-0.5 rounded mt-1 inline-block">{status}</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.time}</span>
                  </div>
                )}
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{item.type}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto px-4 pb-4">
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }} className="text-base cursor-pointer" style={{ color: 'var(--text-primary)' }}>{isRtl ? '❯' : '❮'}</button>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{formatRange()}</p>
          <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }} className="text-base cursor-pointer" style={{ color: 'var(--text-primary)' }}>{isRtl ? '❮' : '❯'}</button>
        </div>
        <div className="flex justify-between mt-4 text-[11px]" style={{ color: 'var(--text-primary)' }}>
          {weekDays.map((d, i) => (
            <div key={i} onClick={() => setSelectedDate(d.date)}
              className={`cursor-pointer text-center ${d.date === selectedDate ? 'bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl p-1 -translate-y-3' : ''}`}>
              <p>{d.day}</p>
              <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg">{d.num}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
