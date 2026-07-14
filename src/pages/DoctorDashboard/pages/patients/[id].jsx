import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Calendar,
  Clock,
  Loader2,
  Plus,
  X,
  CheckCircle,
  FileText,
  Stethoscope,
  Pill,
  FlaskConical,
  StickyNote
} from 'lucide-react';
import axiosInstance from '../../../../api/axiosInstance';

function formatDate(value, isRtl) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const bookingId = id;

  const [booking, setBooking] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [accessStatus, setAccessStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Prescription modal
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    symptoms: '',
    diagnosis: '',
    medication_name: '',
    dose: '',
    duration: '',
    test_name: '',
    test_result: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const loadData = useCallback(async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch bookings list to find this specific booking details
      const bookingsRes = await axiosInstance.get('/api/book/my-bookings');
      const bookingsData = bookingsRes.data;

      if ((bookingsRes.status === 200 || bookingsData.status === 'success') && (bookingsData.bookings || bookingsData.data)) {
        const list = bookingsData.bookings || bookingsData.data;
        const found = list.find((b) => String(b.booking_id) === String(bookingId));

        if (found) {
          setBooking(found);
          setAccessStatus(found.prescription_access_status ?? null);
        } else {
          setError(isRtl ? 'لم يتم العثور على الحجز' : 'Booking not found');
        }
      }

      // Fetch prescriptions and filter for this booking
      const rxRes = await axiosInstance.get('/api/prescriptions/my-prescriptions');
      const rxData = rxRes.data;

      if (rxRes.status === 200 || rxData.status === 'success') {
        const rxList = rxData.prescriptions || rxData.data || [];
        const filteredRx = rxList.filter((rx) => String(rx.booking_id) === String(bookingId));
        setPrescriptions(filteredRx);
      }
    } catch (err) {
      setError(isRtl ? 'حدث خطأ أثناء تحميل البيانات' : 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId, isRtl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (nextStatus) => {
    if (!bookingId) return;
    setStatusUpdating(true);
    try {
      const response = await axiosInstance.patch(`/api/book/${bookingId}/status`, { status: nextStatus });
      if (response.data.status === 'success' || response.data.success !== false) {
        setBooking((prev) => (prev ? { ...prev, status: nextStatus } : null));
      } else {
        alert(response.data.error || (isRtl ? 'فشل تحديث حالة الحجز' : 'Failed to update booking status'));
      }
    } catch (err) {
      alert(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRequestAccess = async () => {
    setActionLoading(true);
    try {
      const response = await axiosInstance.post(`/api/prescriptions/bookings/${bookingId}/request-access`);
      if (response.data.status === 'success' || response.data.success !== false) {
        setAccessStatus('pending');
      } else {
        alert(response.data.error || (isRtl ? 'حدث خطأ أثناء طلب الصلاحية' : 'Failed to request access'));
      }
    } catch (err) {
      alert(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePrescription = async () => {
    const { symptoms, diagnosis, medication_name, notes, test_name } = form;
    if (!symptoms && !diagnosis && !medication_name && !notes && !test_name) {
      setFormError(isRtl ? 'يرجى إدخال الأعراض أو التشخيص أو الدواء أو الفحوصات على الأقل' : 'Please fill at least one clinical field.');
      return;
    }
    if ((form.dose || form.duration) && !medication_name) {
      setFormError(isRtl ? 'اسم الدواء مطلوب عند إدخال الجرعة أو مدة العلاج' : 'Medication name is required for dose/duration.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        symptoms: form.symptoms || null,
        diagnosis: form.diagnosis || null,
        medication_name: form.medication_name || null,
        dose: form.dose || null,
        duration: form.duration || null,
        test_name: form.test_name || null,
        test_result: form.test_result || null,
        notes: form.notes || null,
      };

      const response = await axiosInstance.post(`/api/prescriptions/bookings/${bookingId}`, payload);
      if (response.data.status === 'success' || response.data.success !== false) {
        setBooking((prev) => (prev ? { ...prev, status: 'completed' } : null));
        setFormSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess(false);
          loadData();
        }, 1500);
      } else {
        setFormError(response.data.error || (isRtl ? 'فشل إنشاء الروشتة' : 'Failed to create prescription'));
      }
    } catch (err) {
      setFormError(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <div className="text-center text-slate-500">
          <Loader2 size={40} className="animate-spin mx-auto mb-3 opacity-40 text-[#1F2B6C]" />
          <p className="text-sm font-semibold">{isRtl ? 'جارٍ تحميل بيانات الحجز...' : 'Loading booking details...'}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6 text-center max-w-md mx-auto py-20">
        <p className="text-red-500 font-semibold mb-4">{error || (isRtl ? 'الحجز غير موجود' : 'Booking not found')}</p>
        <button
          onClick={() => navigate('/doctor-dashboard/patients')}
          className="px-6 py-2.5 rounded-xl bg-[#1F2B6C] text-white hover:bg-[#162056] font-medium transition cursor-pointer"
        >
          {isRtl ? 'رجوع' : 'Go Back'}
        </button>
      </div>
    );
  }

  const isConfirmed = booking.status === 'confirmed';

  return (
    <div className="space-y-6 px-1 py-2 sm:px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => navigate('/doctor-dashboard/patients')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-semibold cursor-pointer w-fit"
      >
        {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        <span>{isRtl ? 'رجوع إلى قائمة المرضى' : 'Back to Patient List'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Booking info + Prescriptions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Booking Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="text-start">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{isRtl ? 'تفاصيل الحجز' : 'Booking Details'}</p>
                <h2 className="text-2xl font-bold text-[#1F2B6C] mt-1">
                  {isRtl ? 'حجز' : 'Appointment'} #{booking.booking_id}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus('confirmed')}
                      disabled={statusUpdating}
                      className="px-4 py-2 text-xs rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition disabled:opacity-60 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      {statusUpdating && <Loader2 size={12} className="animate-spin" />}
                      {isRtl ? 'تأكيد الدفع' : 'Confirm Payment'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={statusUpdating}
                      className="px-4 py-2 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition disabled:opacity-60 font-semibold cursor-pointer"
                    >
                      {isRtl ? 'رفض' : 'Reject'}
                    </button>
                  </>
                )}

                {booking.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      disabled={statusUpdating}
                      className="px-4 py-2 text-xs rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition disabled:opacity-60 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      {statusUpdating && <Loader2 size={12} className="animate-spin" />}
                      {isRtl ? 'إكمال الكشف' : 'Complete Visit'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('cancelled')}
                      disabled={statusUpdating}
                      className="px-4 py-2 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition disabled:opacity-60 font-semibold cursor-pointer"
                    >
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                  </>
                )}

                <span
                  className={`px-3 py-1.5 text-xs rounded-full font-bold uppercase ${
                    booking.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status === 'completed'
                    ? (isRtl ? 'مكتمل' : 'Completed')
                    : booking.status === 'confirmed'
                      ? (isRtl ? 'مؤكد' : 'Confirmed')
                      : booking.status === 'pending'
                        ? (isRtl ? 'قيد الانتظار' : 'Pending')
                        : booking.status === 'cancelled'
                          ? (isRtl ? 'ملغي' : 'Cancelled')
                          : booking.status === 'rejected'
                            ? (isRtl ? 'مرفوض' : 'Rejected')
                            : booking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-start">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <p className="text-xs text-slate-500 font-semibold">{isRtl ? 'تاريخ الحجز' : 'Booking Date'}</p>
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {formatDate(booking.booking_date, isRtl)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-start">
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <p className="text-xs text-slate-500 font-semibold">{isRtl ? 'وقت الحجز' : 'Booking Time'}</p>
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {booking.booking_from} — {booking.booking_to || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Prescriptions Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* Actions */}
                {isConfirmed && accessStatus === 'accepted' && prescriptions.length === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-[#1F2B6C] text-white hover:bg-[#162056] font-semibold transition cursor-pointer"
                  >
                    <Plus size={14} />
                    {isRtl ? 'كتابة روشتة' : 'Create Prescription'}
                  </button>
                )}
                {isConfirmed && (!accessStatus || accessStatus === 'rejected') && (
                  <button
                    onClick={handleRequestAccess}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-60 font-semibold cursor-pointer"
                  >
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                    {isRtl ? 'طلب صلاحية الروشتة' : 'Request Prescription Access'}
                  </button>
                )}
                {accessStatus === 'pending' && (
                  <span className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                    <Clock size={14} />
                    {isRtl ? 'في انتظار موافقة المريض' : 'Awaiting Patient Approval'}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                {isRtl ? 'الروشتات الطبية' : 'Prescriptions'}
              </h3>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText size={48} className="mx-auto mb-3 opacity-30 text-[#1F2B6C]" />
                <p className="font-semibold">{isRtl ? 'لا توجد روشتة طبية لهذا الحجز' : 'No prescription for this visit yet.'}</p>
                {isConfirmed && accessStatus === 'accepted' && (
                  <p className="text-xs mt-1 opacity-80">{isRtl ? 'بإمكانك كتابة الروشتة للمريض الآن.' : 'You can write a prescription now.'}</p>
                )}
                {isConfirmed && (!accessStatus || accessStatus === 'rejected') && (
                  <p className="text-xs mt-1 opacity-80">{isRtl ? 'يجب طلب الصلاحية من المريض لكتابة الروشتة.' : 'You must request patient access first.'}</p>
                )}
                {accessStatus === 'pending' && (
                  <p className="text-xs mt-1 opacity-80">{isRtl ? 'بانتظار قبول المريض لطلب الصلاحية.' : 'Waiting for patient approval to edit.'}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div key={rx.prescription_id || rx.id} className="rounded-2xl border border-slate-200 p-5 space-y-4 text-start">
                    <div className="flex items-center justify-between border-b pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {formatDate(rx.created_at || rx.visit_date, isRtl)}
                      </span>
                      <span className="font-bold text-[#1F2B6C] text-sm">
                        #{rx.prescription_id || rx.id}
                      </span>
                    </div>

                    {rx.symptoms && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1">{isRtl ? 'الأعراض' : 'Symptoms'}</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{rx.symptoms}</p>
                      </div>
                    )}
                    {rx.diagnosis && (
                      <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100/30">
                        <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                          <Stethoscope size={12} /> {isRtl ? 'التشخيص' : 'Diagnosis'}
                        </p>
                        <p className="text-sm text-blue-900 font-semibold">{rx.diagnosis}</p>
                      </div>
                    )}
                    {rx.medication_name && (
                      <div className="rounded-xl bg-green-50/55 p-3 border border-green-100/30">
                        <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1">
                          <Pill size={12} /> {isRtl ? 'الدواء الموصوف' : 'Prescribed Medication'}
                        </p>
                        <p className="text-sm text-green-900 font-bold">
                          {rx.medication_name}
                          {rx.dose && <span className="text-green-700 font-medium"> — {rx.dose}</span>}
                          {rx.duration && <span className="text-green-700 font-medium"> — {rx.duration}</span>}
                        </p>
                      </div>
                    )}
                    {rx.test_name && (
                      <div className="rounded-xl bg-purple-50/50 p-3 border border-purple-100/30">
                        <p className="text-xs font-bold text-purple-700 mb-1 flex items-center gap-1">
                          <FlaskConical size={12} /> {isRtl ? 'الفحوصات المطلوبة' : 'Requested Tests'}
                        </p>
                        <p className="text-sm text-purple-900 font-semibold">
                          {rx.test_name}
                          {rx.test_result && <span className="text-purple-600 font-medium"> — {rx.test_result}</span>}
                        </p>
                      </div>
                    )}
                    {rx.notes && (
                      <div className="rounded-xl bg-amber-50/40 p-3 border border-amber-100/30">
                        <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                          <StickyNote size={12} /> {isRtl ? 'ملاحظات وتوجيهات' : 'Medical Notes'}
                        </p>
                        <p className="text-sm text-amber-900 whitespace-pre-line">{rx.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Patient Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 h-fit text-center">
          <div>
            <div className="w-20 h-20 rounded-3xl bg-[#1F2B6C] text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-sm">
              {booking.patient_name?.charAt(0) || 'P'}
            </div>
            <h3 className="font-bold text-xl text-slate-800">{booking.patient_name}</h3>
          </div>

          <div className="border-t pt-4 space-y-3">
            {booking.patient_phone && (
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-start">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <div className="text-end">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{booking.patient_phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-start">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div className="text-end">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'صلاحية الروشتة' : 'Prescription Access'}</p>
                <p
                  className={`text-sm font-bold mt-0.5 ${
                    accessStatus === 'accepted'
                      ? 'text-green-600'
                      : accessStatus === 'pending'
                        ? 'text-amber-600'
                        : accessStatus === 'rejected'
                          ? 'text-red-600'
                          : 'text-slate-400'
                  }`}
                >
                  {accessStatus === 'accepted'
                    ? (isRtl ? 'مسموح' : 'Granted')
                    : accessStatus === 'pending'
                      ? (isRtl ? 'قيد الانتظار' : 'Pending')
                      : accessStatus === 'rejected'
                        ? (isRtl ? 'مرفوض' : 'Declined')
                        : (isRtl ? 'لم يُطلب بعد' : 'Not Requested')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Prescription Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-slate-50">
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-200 transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="text-end">
                <h3 className="font-bold text-xl text-slate-800">
                  {isRtl ? 'كتابة روشتة طبية' : 'Create Prescription'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {booking.patient_name}
                </p>
              </div>
            </div>

            {formSuccess ? (
              <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
                <CheckCircle size={56} className="text-green-500 animate-bounce" />
                <p className="text-xl font-bold text-slate-800">
                  {isRtl ? 'تم إنشاء الروشتة بنجاح' : 'Prescription Created Successfully'}
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {['symptoms', 'diagnosis'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-start">
                      {field === 'symptoms' ? (isRtl ? 'الأعراض والشكوى' : 'Symptoms & Chief Complaint') : (isRtl ? 'التشخيص الطبي' : 'Clinical Diagnosis')}
                    </label>
                    <textarea
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C] resize-none"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['medication_name', 'dose', 'duration'].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-start">
                        {field === 'medication_name'
                          ? (isRtl ? 'اسم الدواء' : 'Medication Name')
                          : field === 'dose'
                            ? (isRtl ? 'الجرعة' : 'Dosage')
                            : (isRtl ? 'مدة العلاج' : 'Duration')}
                      </label>
                      <input
                        type="text"
                        value={form[field]}
                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['test_name', 'test_result'].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-start">
                        {field === 'test_name' ? (isRtl ? 'اسم التحليل/الفحص' : 'Required Test Name') : (isRtl ? 'نتيجة الفحص' : 'Test Result')}
                      </label>
                      <input
                        type="text"
                        value={form[field]}
                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C]"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-start">
                    {isRtl ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2B6C] resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-sm font-semibold text-red-500 text-start">{formError}</p>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleCreatePrescription}
                    disabled={formSubmitting}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#1F2B6C] text-white hover:bg-[#162056] transition disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                  >
                    {formSubmitting ? (
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
    </div>
  );
}
