import { useState } from 'react';
import { Hospital, Download, X, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../api/axiosInstance';

export default function PatientReport({ reports, doctorName }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const rows = reports ?? [];
  const [selectedReport, setSelectedReport] = useState(null);
  const [fullPrescription, setFullPrescription] = useState(null);
  const [fetching, setFetching] = useState(false);

  const handleOpenReport = async (report) => {
    setSelectedReport(report);
    setFullPrescription(null);
    setFetching(true);
    try {
      const { data } = await axiosInstance.get('/prescriptions/my-prescriptions');
      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find((rx) => String(rx.prescription_id || rx.id) === String(report.id));
        if (found) setFullPrescription(found);
      }
    } catch {}
    finally { setFetching(false); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US');
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const displayDoctorName = fullPrescription?.doctor_name || doctorName || (isRtl ? 'الطبيب' : 'Doctor');

  return (
    <div className="h-auto rounded-2xl shadow-[var(--shadow-soft)] border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b mb-4 p-4" style={{ borderColor: 'var(--card-border)' }}>
        <button className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
          {isRtl ? 'عرض الكل' : 'Show All'}
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRtl ? 'تقرير المريض' : 'Patient Report'}
        </h1>
      </div>

      <div className="space-y-2.5 px-4 sm:px-5 py-2 pb-4">
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'لا توجد تقارير' : 'No reports'}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'ستظهر التقارير هنا' : 'Reports will appear here'}</p>
          </div>
        )}
        {rows.slice(0, 7).map((clinic) => (
          <div key={clinic.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--hover-bg)] transition-colors" style={{ background: 'var(--semi-card-bg)' }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Hospital size={18} className="text-blue-600" />
              </div>
              <div className="min-w-0 flex-1" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{clinic.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{clinic.description || (isRtl ? 'تقرير طبي' : 'Medical Report')}</p>
              </div>
            </div>
            <button onClick={() => handleOpenReport(clinic)} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer">
              <Download size={16} strokeWidth={1.5} className="text-blue-600" />
            </button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
          <style dangerouslySetInnerHTML={{ __html: `@media print { body * { visibility: hidden !important; } #printable-report-card, #printable-report-card * { visibility: visible !important; } #printable-report-card { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; background: white !important; } .no-print { display: none !important; } }` }} />
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 no-print">
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-[#151F52] text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
                  <Printer size={16} />{isRtl ? 'طباعة' : 'Print Report'}
                </button>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 rounded-lg hover:bg-gray-200 transition text-gray-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-100">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F2B6C] mb-4"></div>
                  <p className="text-sm">{isRtl ? 'جارٍ تحميل التقرير...' : 'Loading report...'}</p>
                </div>
              ) : (
                <div id="printable-report-card" className="bg-white text-black p-8 rounded-xl shadow-sm border border-gray-200 w-full font-sans max-w-lg mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between border-b-2 border-[#1F2B6C] pb-4 mb-6">
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <h2 className="text-lg font-bold text-[#1F2B6C]">{isRtl ? 'عيادة كلينك' : 'Clynk Clinic'}</h2>
                      <p className="text-xs text-gray-500">Clynk Health Platform</p>
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-base font-bold uppercase tracking-wider text-gray-700 bg-gray-100 py-1.5 rounded-lg inline-block px-6">
                      {isRtl ? 'تقرير طبي' : 'Medical Report'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 border-b border-gray-100 pb-4 text-sm">
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p className="text-xs text-gray-400">{isRtl ? 'رقم التقرير' : 'Report ID'}</p>
                      <p className="font-semibold text-gray-800">#{selectedReport.id}</p>
                    </div>
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p className="text-xs text-gray-400">{isRtl ? 'التاريخ' : 'Date'}</p>
                      <p className="font-semibold text-gray-800">{formatDate(fullPrescription?.created_at)}</p>
                    </div>
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p className="text-xs text-gray-400">{isRtl ? 'المريض' : 'Patient'}</p>
                      <p className="font-semibold text-gray-800">{selectedReport.name}</p>
                    </div>
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p className="text-xs text-gray-400">{isRtl ? 'الطبيب' : 'Doctor'}</p>
                      <p className="font-semibold text-gray-800">{displayDoctorName}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm">
                    {fullPrescription?.symptoms && (
                      <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{isRtl ? 'الأعراض' : 'Symptoms'}</h4>
                        <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{fullPrescription.symptoms}</p>
                      </div>
                    )}
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{isRtl ? 'التشخيص' : 'Diagnosis'}</h4>
                      <p className="text-gray-800 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/30">{fullPrescription?.diagnosis || selectedReport.description || '—'}</p>
                    </div>
                    {fullPrescription?.medication_name && (
                      <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{isRtl ? 'الدواء' : 'Medication'}</h4>
                        <div className="bg-green-50/35 p-3 rounded-lg border border-green-100/30">
                          <p className="font-bold text-green-900 text-sm">{fullPrescription.medication_name}</p>
                          {(fullPrescription.dose || fullPrescription.duration) && (
                            <p className="text-xs text-green-700 mt-1">{fullPrescription.dose} {fullPrescription.duration ? `— ${fullPrescription.duration}` : ''}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {fullPrescription?.notes && (
                      <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{isRtl ? 'ملاحظات' : 'Notes'}</h4>
                        <p className="text-xs text-gray-600 bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/30 whitespace-pre-line">{fullPrescription.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-10 border-t border-gray-100 pt-6 flex justify-end">
                    <div className="text-center w-56">
                      <p className="text-xs text-gray-400">{isRtl ? 'توقيع الطبيب' : "Doctor's Signature"}</p>
                      <div className="h-10 my-2 flex items-center justify-center">
                        <span className="font-serif italic text-blue-900 text-lg font-semibold">{displayDoctorName}</span>
                      </div>
                      <div className="border-b border-gray-300 w-full" />
                      <p className="text-xs font-semibold text-gray-700 mt-1">{displayDoctorName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
