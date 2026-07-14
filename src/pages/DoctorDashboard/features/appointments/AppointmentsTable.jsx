import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  X,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/axiosInstance';

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  const lower = status.toLowerCase();
  if (lower === 'pending' || lower === 'upcoming') return 'bg-purple-100 text-purple-600';
  if (lower === 'completed') return 'bg-green-100 text-green-600';
  if (lower === 'confirmed' || lower === 'approved') return 'bg-blue-100 text-blue-600';
  if (lower === 'cancelled' || lower === 'rejected') return 'bg-red-100 text-red-600';
  return 'bg-gray-100 text-gray-600';
};

export default function AppointmentsTable({ appointments: initialAppointments }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(initialAppointments ?? []);
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const pageSize = 5;

  // Prescription modal state
  const [prescriptionModal, setPrescriptionModal] = useState({
    open: false,
    bookingId: null,
    patientName: "",
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    symptoms: "",
    diagnosis: "",
    medication_name: "",
    dose: "",
    duration: "",
    test_name: "",
    test_result: "",
    notes: "",
  });

  const [prescriptionSubmitting, setPrescriptionSubmitting] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  useEffect(() => {
    if (initialAppointments !== undefined) {
      setAppointments(initialAppointments);
    }
  }, [initialAppointments]);

  const totalPages = Math.max(1, Math.ceil(appointments.length / pageSize));
  const paginated = useMemo(() => appointments.slice((page - 1) * pageSize, page * pageSize), [appointments, page]);

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getStatusTranslated = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower === 'pending') return isRtl ? 'قيد الانتظار' : 'Pending';
    if (lower === 'upcoming') return isRtl ? 'قريباً' : 'Upcoming';
    if (lower === 'completed') return isRtl ? 'مكتمل' : 'Completed';
    if (lower === 'confirmed' || lower === 'approved') return isRtl ? 'مؤكد' : 'Confirmed';
    if (lower === 'cancelled') return isRtl ? 'ملغي' : 'Cancelled';
    if (lower === 'rejected') return isRtl ? 'مرفوض' : 'Rejected';
    return status;
  };

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    setActionLoading(bookingId);
    setMenuOpenId(null);
    try {
      const response = await axiosInstance.patch(`/api/book/${bookingId}/status`, { status: nextStatus });
      if (response.data.status === 'success' || response.data.success !== false) {
        setAppointments((prev) =>
          prev.map((b) => (String(b.booking_id) === String(bookingId) ? { ...b, status: nextStatus } : b))
        );
      } else {
        alert(response.data.error || (isRtl ? "فشل تحديث حالة الحجز" : "Failed to update booking status"));
      }
    } catch (err) {
      alert(isRtl ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmPayment = async (bookingId) => {
    setActionLoading(bookingId);
    setMenuOpenId(null);
    try {
      const isStaff = user?.user_type === 'staff' || user?.role === 'staff';
      const endpoint = isStaff
        ? `/api/payments/staff/bookings/${bookingId}/confirm`
        : `/api/payments/doctor/bookings/${bookingId}/confirm`;

      const response = await axiosInstance.post(endpoint);
      if (response.data.status === 'success' || response.data.success !== false) {
        setAppointments((prev) =>
          prev.map((b) => (String(b.booking_id) === String(bookingId) ? { ...b, status: "confirmed" } : b))
        );
      } else {
        alert(response.data.error || (isRtl ? "فشل تأكيد الدفع" : "Failed to confirm payment"));
      }
    } catch (err) {
      alert(isRtl ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestAccess = async (bookingId) => {
    setActionLoading(bookingId);
    setMenuOpenId(null);
    try {
      const response = await axiosInstance.post(`/api/prescriptions/bookings/${bookingId}/request-access`);
      if (response.data.status === 'success' || response.data.success !== false) {
        setAppointments((prev) =>
          prev.map((b) => (String(b.booking_id) === String(bookingId) ? { ...b, prescription_access_status: "pending" } : b))
        );
      } else {
        alert(response.data.error || (isRtl ? "حدث خطأ أثناء طلب الصلاحية" : "Failed to request access"));
      }
    } catch (err) {
      alert(isRtl ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setActionLoading(null);
    }
  };

  const openPrescriptionModal = (bookingId, patientName) => {
    setMenuOpenId(null);
    setPrescriptionModal({ open: true, bookingId, patientName });
    setPrescriptionForm({
      symptoms: "",
      diagnosis: "",
      medication_name: "",
      dose: "",
      duration: "",
      test_name: "",
      test_result: "",
      notes: "",
    });
    setPrescriptionError(null);
    setPrescriptionSuccess(false);
  };

  const handleCreatePrescription = async () => {
    if (!prescriptionModal.bookingId) return;

    const { symptoms, diagnosis, medication_name, notes, test_name } = prescriptionForm;

    if (!symptoms && !diagnosis && !medication_name && !notes && !test_name) {
      setPrescriptionError(isRtl ? "يرجى إدخال الأعراض أو التشخيص أو الدواء أو الفحوصات على الأقل" : "Please fill at least one clinical field.");
      return;
    }

    if ((prescriptionForm.dose || prescriptionForm.duration) && !medication_name) {
      setPrescriptionError(isRtl ? "اسم الدواء مطلوب عند إدخال الجرعة أو مدة العلاج" : "Medication name is required.");
      return;
    }

    setPrescriptionSubmitting(true);
    setPrescriptionError(null);

    try {
      const payload = {
        symptoms: prescriptionForm.symptoms || null,
        diagnosis: prescriptionForm.diagnosis || null,
        medication_name: prescriptionForm.medication_name || null,
        dose: prescriptionForm.dose || null,
        duration: prescriptionForm.duration || null,
        test_name: prescriptionForm.test_name || null,
        test_result: prescriptionForm.test_result || null,
        notes: prescriptionForm.notes || null,
      };

      const response = await axiosInstance.post(`/api/prescriptions/bookings/${prescriptionModal.bookingId}`, payload);
      if (response.data.status === 'success' || response.data.success !== false) {
        setAppointments((prev) =>
          prev.map((b) => (String(b.booking_id) === String(prescriptionModal.bookingId) ? { ...b, status: "completed" } : b))
        );
        setPrescriptionSuccess(true);
        setTimeout(() => {
          setPrescriptionModal({ open: false, bookingId: null, patientName: "" });
          setPrescriptionSuccess(false);
        }, 1500);
      } else {
        setPrescriptionError(response.data.error || (isRtl ? "فشل إنشاء الروشتة" : "Failed to create prescription"));
      }
    } catch (err) {
      setPrescriptionError(isRtl ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setPrescriptionSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl p-4 shadow-[var(--shadow-soft)] border w-full" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-3 text-start">
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
                  {paginated.map((item, index) => {
                    const isOpen = menuOpenId === item.booking_id;
                    const canConfirm = item.status === 'pending';
                    const canComplete = item.status === 'confirmed';
                    const needRequest = item.status === 'confirmed' && (!item.prescription_access_status || item.prescription_access_status === 'rejected');
                    const canPrescribe = item.status === 'confirmed' && item.prescription_access_status === 'accepted';

                    return (
                      <tr key={index} className="border-t hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
                        <td className="px-3 py-2 relative" style={{ color: 'var(--text-secondary)' }}>
                          <button onClick={() => setMenuOpenId(isOpen ? null : item.booking_id)} className="p-1 rounded hover:bg-[var(--hover-bg)] cursor-pointer">
                            {actionLoading === item.booking_id ? (
                              <Loader2 size={16} className="animate-spin text-[#1f2b6c]" />
                            ) : (
                              <MoreVertical size={18} />
                            )}
                          </button>

                          {/* Actions Dropdown */}
                          {isOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                              <div className={`absolute z-20 mt-1 w-44 rounded-xl border bg-white py-1 shadow-lg text-start ${isRtl ? 'right-2' : 'left-2'}`} style={{ borderColor: 'var(--card-border)' }}>
                                <button
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    navigate(`/doctor-dashboard/patients/${item.booking_id}`);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                  <FileText size={14} />
                                  {isRtl ? 'عرض التفاصيل' : 'View Details'}
                                </button>

                                {canConfirm && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmPayment(item.booking_id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 cursor-pointer"
                                    >
                                      <CheckCircle size={14} />
                                      {isRtl ? 'تأكيد الدفع' : 'Confirm Payment'}
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(item.booking_id, 'rejected')}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                    >
                                      <X size={14} />
                                      {isRtl ? 'رفض الحجز' : 'Reject Booking'}
                                    </button>
                                  </>
                                )}

                                {canComplete && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateStatus(item.booking_id, 'completed')}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 cursor-pointer"
                                    >
                                      <CheckCircle size={14} />
                                      {isRtl ? 'إكمال الكشف' : 'Complete Visit'}
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(item.booking_id, 'cancelled')}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                    >
                                      <X size={14} />
                                      {isRtl ? 'إلغاء الحجز' : 'Cancel Booking'}
                                    </button>
                                  </>
                                )}

                                {needRequest && (
                                  <button
                                    onClick={() => handleRequestAccess(item.booking_id)}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
                                  >
                                    <Clock size={14} />
                                    {isRtl ? 'طلب صلاحية الروشتة' : 'Request Access'}
                                  </button>
                                )}

                                {canPrescribe && (
                                  <button
                                    onClick={() => openPrescriptionModal(item.booking_id, item.name)}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 cursor-pointer"
                                  >
                                    <Plus size={14} />
                                    {isRtl ? 'كتابة روشتة' : 'Create Prescription'}
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-500" style={{ color: 'var(--text-secondary)' }}>{item.date}</td>
                        <td className="px-3 py-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {getStatusTranslated(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500" style={{ color: 'var(--text-secondary)' }}>{item.doctor}</td>
                        <td className="px-3 py-2 text-slate-500" style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                        <td className="px-3 py-2 font-bold text-slate-800" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                        <td className="px-3 py-2 text-slate-500" style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between text-start">
          <div className="flex flex-wrap items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="cursor-pointer text-lg flex items-center justify-center border rounded-md p-1 hover:bg-[var(--semi-card-bg)] transition" style={{ borderColor: 'var(--input-border)' }}>
              {isRtl ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
            </button>
            {getPages().map((p, i) => (
              <button key={i} onClick={() => typeof p === 'number' && setPage(p)} disabled={p === '...'}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer transition ${p === page ? 'text-white' : p === '...' ? 'cursor-default text-gray-400' : 'border hover:bg-[var(--semi-card-bg)]'}`}
                style={{ borderColor: 'var(--input-border)', background: p === page ? '#1f2b6c' : undefined }}>
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

      {/* Prescription Modal */}
      {prescriptionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-y-auto shadow-2xl max-h-[90vh] border flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-slate-50">
              <button
                onClick={() => setPrescriptionModal({ open: false, bookingId: null, patientName: "" })}
                className="p-2 rounded-lg hover:bg-slate-200 transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="text-end">
                <h3 className="font-bold text-xl text-slate-800">
                  {isRtl ? 'كتابة روشتة طبية' : 'Create Prescription'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {prescriptionModal.patientName}
                </p>
              </div>
            </div>

            {prescriptionSuccess ? (
              <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
                <CheckCircle size={56} className="text-green-500 animate-bounce" />
                <p className="text-xl font-bold text-slate-800">
                  {isRtl ? 'تم إنشاء الروشتة بنجاح' : 'Prescription Created Successfully'}
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4 text-start">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'الأعراض والشكوى' : 'Symptoms & Chief Complaint'}
                  </label>
                  <textarea
                    value={prescriptionForm.symptoms}
                    onChange={(e) => setPrescriptionForm((f) => ({ ...f, symptoms: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'التشخيص الطبي' : 'Clinical Diagnosis'}
                  </label>
                  <textarea
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm((f) => ({ ...f, diagnosis: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isRtl ? 'اسم الدواء' : 'Medication Name'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.medication_name}
                      onChange={(e) => setPrescriptionForm((f) => ({ ...f, medication_name: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isRtl ? 'الجرعة' : 'Dosage'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.dose}
                      onChange={(e) => setPrescriptionForm((f) => ({ ...f, dose: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isRtl ? 'مدة العلاج' : 'Duration'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.duration}
                      onChange={(e) => setPrescriptionForm((f) => ({ ...f, duration: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isRtl ? 'اسم التحليل/الفحص' : 'Required Test Name'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.test_name}
                      onChange={(e) => setPrescriptionForm((f) => ({ ...f, test_name: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isRtl ? 'نتيجة الفحص' : 'Test Result'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.test_result}
                      onChange={(e) => setPrescriptionForm((f) => ({ ...f, test_result: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C] resize-none"
                  />
                </div>

                {prescriptionError && (
                  <p className="text-sm font-semibold text-red-500">{prescriptionError}</p>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setPrescriptionModal({ open: false, bookingId: null, patientName: "" })}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleCreatePrescription}
                    disabled={prescriptionSubmitting}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#1F2B6C] text-white hover:bg-[#162056] transition disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                  >
                    {prescriptionSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" />{isRtl ? 'جارٍ الحفظ...' : 'Saving...'}</>
                    ) : (
                      isRtl ? 'حفظ الروشتة' : 'Save Prescription'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
