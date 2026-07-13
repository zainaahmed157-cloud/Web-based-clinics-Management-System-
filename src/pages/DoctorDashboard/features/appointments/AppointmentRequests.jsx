import { useEffect, useState } from 'react';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getSpecialtyColor = (specialty) => {
  if (!specialty) return 'bg-gray-100 text-gray-600';
  const s = specialty.toLowerCase();
  if (s.includes('مخ') || s.includes('neurology')) return 'bg-[#EEF9F1] text-[#09800F]';
  if (s.includes('عظام') || s.includes('orthopedics')) return 'bg-[#EBF3FC] text-[#1976D2]';
  if (s.includes('جلد') || s.includes('dermatology')) return 'bg-[#EBF2F1] text-[#00796B]';
  if (s.includes('اسنان') || s.includes('dentistry')) return 'bg-[#F1EBF7] text-[#6A1B9A]';
  return 'bg-gray-100 text-gray-600';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-[#FEF3C7] text-[#92400E]';
    case 'approved': return 'bg-[#EEF9F1] text-[#09800F]';
    case 'rejected': return 'bg-[#FEE2E2] text-[#7F1D1D]';
    case 'canceled': return 'bg-[#FBECEA] text-[#B71C1C]';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function AppointmentRequests({ appointments: appointmentsProp }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [appointments, setAppointments] = useState(appointmentsProp ?? []);

  useEffect(() => {
    if (appointmentsProp !== undefined) setAppointments(appointmentsProp);
  }, [appointmentsProp]);

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item));
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return isRtl ? 'قيد الانتظار' : 'Pending';
      case 'approved': return isRtl ? 'مؤكّد' : 'Approved';
      case 'rejected': return isRtl ? 'مرفوض' : 'Rejected';
      case 'canceled': return isRtl ? 'اعتذر' : 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="rounded-2xl border shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b mb-4 p-4" style={{ borderColor: 'var(--card-border)' }}>
        <button className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300"
          style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
          {isRtl ? 'كل المواعيد' : 'All Appointments'}
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'طلبات المواعيد' : 'Appointment Requests'}
        </h1>
      </div>

      <div className="space-y-3 px-4 pb-4">
        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center" style={{ borderColor: 'var(--card-border)' }}>
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--hover-bg)' }}>
              <Calendar size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد طلبات' : 'No requests'}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'ستظهر الطلبات الجديدة هنا' : 'New requests will appear here'}</p>
          </div>
        )}

        {appointments.map((item) => {
          const timeParts = item.time?.includes(',') ? item.time.split(', ') : (item.time?.split(' - ') || []);
          const dateVal = item.time?.includes(',') ? timeParts[0] : (timeParts[1] || item.time);
          const timeVal = item.time?.includes(',') ? timeParts[1] : (timeParts[0] || '');
          return (
            <div key={item.id} className={`flex justify-between gap-6 flex-col sm:flex-row items-start sm:items-center rounded-2xl border p-3 hover:shadow-[var(--shadow-soft)] transition ${isRtl ? '' : 'sm:flex-row-reverse'}`}
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
              <div className={`flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 ${isRtl ? 'justify-end' : 'justify-start sm:flex-row-reverse'}`}>
                <div className={`min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <p className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  <div className={`flex items-center gap-1.5 text-xs mt-1 ${isRtl ? 'justify-end' : 'justify-start'}`} style={{ color: 'var(--text-secondary)' }}>
                    <div className={`flex items-center gap-1 ${isRtl ? 'border-r pr-2' : 'border-l pl-2'}`} style={{ borderColor: 'var(--card-border)' }}>
                      {timeVal}<Clock size={12} />
                    </div>
                    <div className="flex items-center gap-1">{dateVal}<Calendar size={12} /></div>
                  </div>
                </div>
                <img src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'P')}&background=e7edf3`} alt="" className="w-10 h-10 rounded-md object-cover" />
              </div>

              <div className="shrink-0">
                <span className={`px-2 py-1 rounded-md text-xs sm:text-sm ${getSpecialtyColor(item.specialty)}`}>{item.specialty}</span>
              </div>

              <div className="flex gap-2 shrink-0">
                {item.status === 'pending' ? (
                  <>
                    <button onClick={() => updateStatus(item.id, 'rejected')} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#EEF2F7] hover:bg-[#FECACA] transition cursor-pointer">
                      <X size={14} className="text-[#0B0D0E]" />
                    </button>
                    <button onClick={() => updateStatus(item.id, 'approved')} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#EEF2F7] hover:bg-[#BFDBFE] transition cursor-pointer">
                      <Check size={14} className="text-[#0B0D0E]" />
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
