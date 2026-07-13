import React, { useEffect, useMemo, useState } from 'react';
import { MoreVertical, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  const lower = status.toLowerCase();
  if (lower === 'pending' || lower === 'upcoming') return 'bg-purple-100 text-purple-600';
  if (lower === 'completed' || lower === 'confirmed') return 'bg-green-100 text-green-600';
  return 'bg-gray-100 text-gray-600';
};

export default function AppointmentsTable({ appointments: initialAppointments }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [appointments, setAppointments] = useState(initialAppointments ?? []);
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    if (initialAppointments !== undefined) {
      setAppointments(initialAppointments);
    }
  }, [initialAppointments]);

  const totalPages = Math.max(1, Math.ceil(appointments.length / pageSize));
  const paginated = useMemo(() => appointments.slice((page - 1) * pageSize, page * pageSize), [appointments, page]);

  const getPages = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 3, ...(totalPages > 3 ? ['...'] : [])];
    if (page >= totalPages - 1) return [...(totalPages > 3 ? ['...'] : []), totalPages - 2, totalPages - 1, totalPages];
    return ['...', page - 1, page, page + 1, '...'];
  };

  const getStatusTranslated = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower === 'pending' || lower === 'upcoming') return isRtl ? 'قريباً' : 'Upcoming';
    if (lower === 'completed' || lower === 'confirmed') return isRtl ? 'مكتمل' : 'Completed';
    return status;
  };

  return (
    <div className="rounded-2xl p-4 shadow-[var(--shadow-soft)] border w-full" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'آخر المواعيد' : 'Latest Appointments'}
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
        <div className="overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد مواعيد' : 'No appointments'}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'ستظهر هنا عند إضافة مواعيد' : 'Appointments will appear here'}</p>
            </div>
          ) : (
            <table className="w-full min-w-max text-xs sm:text-sm text-center">
              <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</th>
                  <th className="px-3 py-2">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="px-3 py-2">{isRtl ? 'الطبيب' : 'Doctor'}</th>
                  <th className="px-3 py-2">{isRtl ? 'نوع الزيارة' : 'Visit Type'}</th>
                  <th className="px-3 py-2">{isRtl ? 'اسم المريض' : 'Patient Name'}</th>
                  <th className="px-3 py-2">{isRtl ? 'رقم المريض' : 'Patient ID'}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
                    <td className="px-3 py-2 relative" style={{ color: 'var(--text-secondary)' }}>
                      <button onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)} className="p-1 rounded hover:bg-[var(--hover-bg)]">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{item.date}</td>
                    <td className="px-3 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusTranslated(item.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{item.doctor}</td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                    <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="cursor-pointer text-lg flex items-center justify-center border rounded-md p-1 hover:bg-[var(--semi-card-bg)] transition" style={{ borderColor: 'var(--input-border)' }}>
            {isRtl ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
          </button>
          {getPages().map((p, i) => (
            <button key={i} onClick={() => typeof p === 'number' && setPage(p)} disabled={p === '...'}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${p === page ? 'text-white' : p === '...' ? 'cursor-default text-gray-400' : 'border hover:bg-[var(--semi-card-bg)]'}`}
              style={{ borderColor: 'var(--input-border)', background: p === page ? 'var(--primary)' : undefined }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className="cursor-pointer text-lg flex items-center justify-center border rounded-md p-1 hover:bg-[var(--semi-card-bg)] transition" style={{ borderColor: 'var(--input-border)' }}>
            {isRtl ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {isRtl ? `صفحة ${page} من ${totalPages} · إجمالي ${appointments.length}` : `Page ${page} of ${totalPages} · Total ${appointments.length}`}
        </p>
      </div>
    </div>
  );
}
