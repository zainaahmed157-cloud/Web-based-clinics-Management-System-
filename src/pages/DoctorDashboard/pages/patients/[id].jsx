import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Calendar, Stethoscope, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PatientDetailPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/doctor-dashboard/patients')}
          className="p-2 rounded-xl border hover:bg-[var(--hover-bg)] transition cursor-pointer"
          style={{ borderColor: 'var(--card-border)' }}>
          <ArrowLeft size={18} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'تفاصيل المريض' : 'Patient Details'}
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <User size={48} style={{ color: 'var(--text-secondary)' }} className="mb-4" />
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'تفاصيل المريض' : 'Patient details'}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'اختر مريضاً من القائمة' : 'Select a patient from the list'}</p>
      </div>
    </div>
  );
}
