import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/axiosInstance';

export default function ClinicsPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { user } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clinicId = user?.profile?.clinic_id || user?.clinic_id;
    if (!clinicId) {
      setLoading(false);
      return;
    }
    axiosInstance.get(`/api/clinic/${clinicId}/profile`)
      .then(({ data }) => {
        if (data.status === 'success' && data.clinic) {
          setClinics([data.clinic]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'عياداتي' : 'My Clinics'}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'إدارة عياداتك' : 'Manage your clinics'}</p>
      </div>

      {loading && <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f2b6c]" /></div>}

      {!loading && clinics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <Building2 size={48} style={{ color: 'var(--text-secondary)' }} className="mb-4" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد عيادات' : 'No clinics found'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لم تنضم إلى أي عيادة بعد' : "You haven't joined any clinics yet"}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {clinics.map((clinic, i) => (
          <div key={i} className="rounded-2xl border p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>{clinic.name || (isRtl ? 'عيادة' : 'Clinic')}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${clinic.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {clinic.status === 'active' ? (isRtl ? 'نشطة' : 'Active') : (isRtl ? 'غير نشطة' : 'Inactive')}
                </span>
              </div>
            </div>
            {clinic.address && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={14} /><span>{clinic.address}</span>
              </div>
            )}
            {clinic.phone && (
              <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={14} /><span>{clinic.phone}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
