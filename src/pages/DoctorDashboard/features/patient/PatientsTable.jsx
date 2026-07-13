import { useTranslation } from 'react-i18next';

const getDeptColor = (dept) => {
  if (!dept) return 'bg-gray-100 text-gray-600';
  const d = dept.toLowerCase();
  if (d.includes('عظام') || d.includes('orthopedics')) return 'bg-orange-100 text-orange-600';
  if (d.includes('قلب') || d.includes('cardiology')) return 'bg-blue-100 text-blue-600';
  if (d.includes('جلد') || d.includes('dermatology')) return 'bg-purple-100 text-purple-600';
  return 'bg-gray-100 text-gray-600';
};

export default function PatientsTable({ patients }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const rows = patients ?? [];

  const getGenderTranslated = (gender) => {
    if (!gender) return '—';
    const g = gender.toLowerCase();
    if (g === 'ذكر' || g === 'male') return isRtl ? 'ذكر' : 'Male';
    if (g === 'أنثى' || g === 'female') return isRtl ? 'أنثى' : 'Female';
    return gender;
  };

  return (
    <div className="rounded-2xl shadow-[var(--shadow-soft)] border w-full" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b mb-4 p-4 gap-3" style={{ borderColor: 'var(--card-border)' }}>
        <button className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
          {isRtl ? 'عرض الكل' : 'Show All'}
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'سجل المرضى' : 'Patient Registry'}
        </h1>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
          {/* Mobile */}
          <div className="sm:hidden space-y-3 p-4">
            {rows.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا يوجد مرضى' : 'No patients yet'}</p>
              </div>
            )}
            {rows.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 flex-row-reverse">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDeptColor(item.department)}`}>{item.department}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-secondary)', textAlign: isRtl ? 'right' : 'left' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الجنس' : 'Gender'}</span>
                    <span>{getGenderTranslated(item.gender)}</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'آخر زيارة' : 'Last Visit'}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            {rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا يوجد مرضى' : 'No patients yet'}</p>
              </div>
            ) : (
              <table className="w-full min-w-max text-xs sm:text-sm text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)', fontSize: '11px' }}>
                  <tr>
                    <th className="px-3 py-2">{isRtl ? 'آخر زيارة' : 'Last Visit'}</th>
                    <th className="px-3 py-2">{isRtl ? 'القسم' : 'Dept.'}</th>
                    <th className="px-3 py-2">{isRtl ? 'الجنس' : 'Gender'}</th>
                    <th className="px-3 py-2">{isRtl ? 'اسم المريض' : 'Patient Name'}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{item.date}</td>
                      <td className="px-3 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDeptColor(item.department)}`}>{item.department}</span>
                      </td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{getGenderTranslated(item.gender)}</td>
                      <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
