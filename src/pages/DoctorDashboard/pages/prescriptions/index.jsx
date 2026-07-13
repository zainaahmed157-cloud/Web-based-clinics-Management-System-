import { useCallback, useEffect, useState } from 'react';
import {
  FileText, ChevronLeft, ChevronRight, X,
  Pill, Stethoscope, Calendar, User, Printer,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../api/axiosInstance';

function formatDate(value, locale = 'en') {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PrescriptionCard({ rx, isRtl, locale, onViewFull }) {
  return (
    <div className="min-w-0 space-y-4 rounded-2xl border p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0 text-start">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'رقم الوصفة' : 'Prescription #'}</p>
          <p className="break-all text-lg font-bold" style={{ color: 'var(--text-primary)' }}>#{rx.prescription_id || rx.id}</p>
        </div>
        <div className="min-w-0 text-end">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'تاريخ الإنشاء' : 'Created'}</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(rx.created_at, locale)}</p>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--card-border)' }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rx.patient_name && (
          <div className="flex min-w-0 items-center gap-2">
            <User size={15} style={{ color: 'var(--text-secondary)' }} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'المريض' : 'Patient'}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rx.patient_name}</p>
            </div>
          </div>
        )}
        {rx.booking_date && (
          <div className="flex min-w-0 items-center gap-2">
            <Calendar size={15} style={{ color: 'var(--text-secondary)' }} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'تاريخ الزيارة' : 'Visit Date'}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(rx.booking_date, locale)}</p>
            </div>
          </div>
        )}
      </div>

      {(rx.diagnosis || rx.medication_name) && (
        <div className="space-y-3">
          {rx.diagnosis && (
            <div className="flex min-w-0 items-start gap-2 rounded-xl p-3" style={{ background: 'var(--semi-card-bg)' }}>
              <Stethoscope size={15} style={{ color: 'var(--text-secondary)' }} className="shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'التشخيص' : 'Diagnosis'}</p>
                <p className="text-sm break-words" style={{ color: 'var(--text-primary)' }}>{rx.diagnosis}</p>
              </div>
            </div>
          )}
          {rx.medication_name && (
            <div className="flex min-w-0 items-start gap-2 rounded-xl p-3" style={{ background: 'var(--semi-card-bg)' }}>
              <Pill size={15} style={{ color: 'var(--text-secondary)' }} className="shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'الدواء' : 'Medication'}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rx.medication_name}</p>
                {(rx.dose || rx.duration) && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{rx.dose} {rx.duration && `— ${rx.duration}`}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={() => onViewFull(rx)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition cursor-pointer"
        style={{ background: '#1f2b6c', color: 'white' }}>
        <Printer size={15} />{isRtl ? 'معاينة وطباعة' : 'Preview & Print'}
      </button>
    </div>
  );
}

export default function PrescriptionsPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const locale = i18n.language;
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedRx, setSelectedRx] = useState(null);
  const PAGE_SIZE = 6;

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      // The real backend endpoint is /api/prescriptions/my-prescriptions
      const { data } = await axiosInstance.get('/api/prescriptions/my-prescriptions');
      // Clynk returns { status, results, prescriptions } or { success, data }
      const list = data.prescriptions || data.data || (Array.isArray(data) ? data : []);
      setPrescriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(prescriptions.length / PAGE_SIZE));
  const paginated = prescriptions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الوصفات الطبية' : 'Prescriptions'}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? `${prescriptions.length} وصفة` : `${prescriptions.length} prescriptions`}</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f2b6c]" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <FileText size={48} style={{ color: 'var(--text-secondary)' }} className="mb-4 opacity-40" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد وصفات' : 'No prescriptions yet'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'ستظهر وصفاتك هنا' : 'Your prescriptions will appear here'}</p>
        </div>
      )}

      {!loading && !error && prescriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <FileText size={48} style={{ color: 'var(--text-secondary)' }} className="mb-4 opacity-40" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد وصفات' : 'No prescriptions yet'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'ستظهر وصفاتك هنا' : 'Your prescriptions will appear here'}</p>
        </div>
      )}

      {!loading && !error && prescriptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((rx) => (
            <PrescriptionCard key={rx.prescription_id || rx.id} rx={rx} isRtl={isRtl} locale={locale} onViewFull={setSelectedRx} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl border disabled:opacity-50 cursor-pointer hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
            <ChevronLeft size={18} style={{ color: 'var(--text-primary)' }} />
          </button>
          <span className="text-sm px-2" style={{ color: 'var(--text-secondary)' }}>{isRtl ? `${page} من ${totalPages}` : `${page} / ${totalPages}`}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-xl border disabled:opacity-50 cursor-pointer hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
            <ChevronRight size={18} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      )}

      {/* Print modal */}
      {selectedRx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRx(null)}>
          <style dangerouslySetInnerHTML={{ __html: `@media print { body * { visibility: hidden !important; } #printable-rx-card, #printable-rx-card * { visibility: visible !important; } #printable-rx-card { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; background: white !important; } .no-print { display: none !important; } }` }} />
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="no-print flex items-center justify-between p-4 border-b bg-gray-50">
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#1F2B6C] text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#151F52] transition">
                <Printer size={16} />{isRtl ? 'طباعة' : 'Print'}
              </button>
              <button onClick={() => setSelectedRx(null)} className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-500"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-100">
              <div id="printable-rx-card" className="bg-white text-black p-8 rounded-xl shadow-sm border border-gray-200 max-w-lg mx-auto font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center justify-between border-b-2 border-[#1F2B6C] pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1F2B6C]">{isRtl ? 'عيادة كلينك' : 'Clynk Clinic'}</h2>
                    <p className="text-xs text-gray-500">Clynk Health Platform</p>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-700 bg-gray-100 py-1.5 rounded-lg inline-block px-6">
                    {isRtl ? 'وصفة طبية' : 'Medical Prescription'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4 text-sm border-gray-100">
                  <div><p className="text-xs text-gray-400">{isRtl ? 'رقم' : 'No.'}</p><p className="font-semibold">#{selectedRx.prescription_id || selectedRx.id}</p></div>
                  <div><p className="text-xs text-gray-400">{isRtl ? 'التاريخ' : 'Date'}</p><p className="font-semibold">{formatDate(selectedRx.created_at, locale)}</p></div>
                  {selectedRx.patient_name && <div><p className="text-xs text-gray-400">{isRtl ? 'المريض' : 'Patient'}</p><p className="font-semibold">{selectedRx.patient_name}</p></div>}
                </div>
                <div className="space-y-4 text-sm">
                  {selectedRx.diagnosis && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">{isRtl ? 'التشخيص' : 'Diagnosis'}</h4>
                      <p className="bg-blue-50 p-2.5 rounded-lg">{selectedRx.diagnosis}</p>
                    </div>
                  )}
                  {selectedRx.medication_name && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">{isRtl ? 'الدواء' : 'Medication'}</h4>
                      <p className="bg-green-50 p-2.5 rounded-lg font-medium">{selectedRx.medication_name} {selectedRx.dose ? `— ${selectedRx.dose}` : ''}</p>
                    </div>
                  )}
                  {selectedRx.notes && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">{isRtl ? 'ملاحظات' : 'Notes'}</h4>
                      <p className="bg-amber-50 p-2.5 rounded-lg text-xs whitespace-pre-line">{selectedRx.notes}</p>
                    </div>
                  )}
                </div>
                <div className="mt-10 border-t border-gray-100 pt-6 flex justify-end">
                  <div className="text-center w-48">
                    <p className="text-xs text-gray-400">{isRtl ? 'توقيع الطبيب' : "Doctor's Signature"}</p>
                    <div className="h-10 my-2" />
                    <div className="border-b border-gray-300 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
