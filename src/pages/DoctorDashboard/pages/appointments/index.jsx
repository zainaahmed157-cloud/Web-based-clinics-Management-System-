import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  X,
  FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/axiosInstance';

const COLORS = ['#1f2b6c', '#10b981', '#f59e0b'];

const statusColors = {
  completed: "bg-green-100 text-green-600",
  confirmed: "bg-blue-100 text-blue-600",
  approved: "bg-blue-100 text-blue-600",
  pending: "bg-amber-100 text-amber-600",
  cancelled: "bg-red-100 text-red-600",
  rejected: "bg-red-100 text-red-600",
};

export default function AppointmentsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Pagination for appointments table
  const [page, setPage] = useState(1);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/api/doctors/dashboard'),
        axiosInstance.get('/api/book/my-bookings'),
      ]);
      const dashData = dashRes.data;
      const bookingsData = bookingsRes.data;

      if (dashData.status === 'success' || dashData.success) {
        setDashboardData(dashData.dashboard || dashData.data);
      }
      const bList = bookingsData.bookings || bookingsData.data;
      if ((bookingsData.status === 'success' || bookingsData.success) && Array.isArray(bList)) {
        setBookings(bList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;

  const pieData = [
    { name: isRtl ? 'مكتملة' : 'Completed', value: completed },
    { name: isRtl ? 'مؤكدة' : 'Confirmed', value: confirmed },
    { name: isRtl ? 'قيد الانتظار' : 'Pending', value: pending },
  ].filter((d) => d.value > 0);

  const todayAppointments = dashboardData?.todayAppointments || [];

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    setActionLoading(bookingId);
    try {
      const response = await axiosInstance.patch(`/api/book/${bookingId}/status`, { status: nextStatus });
      if (response.data.status === 'success' || response.data.success !== false) {
        setBookings((prev) =>
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
    try {
      const isStaff = user?.user_type === 'staff' || user?.role === 'staff';
      const endpoint = isStaff
        ? `/api/payments/staff/bookings/${bookingId}/confirm`
        : `/api/payments/doctor/bookings/${bookingId}/confirm`;

      const response = await axiosInstance.post(endpoint);
      if (response.data.status === 'success' || response.data.success !== false) {
        setBookings((prev) =>
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
    try {
      const response = await axiosInstance.post(`/api/prescriptions/bookings/${bookingId}/request-access`);
      if (response.data.status === 'success' || response.data.success !== false) {
        setBookings((prev) =>
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
        setBookings((prev) =>
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

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
  const paginatedBookings = bookings.slice((page - 1) * pageSize, page * pageSize);

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getStatusLabel = (status) => {
    if (status === "completed") return isRtl ? "مكتملة" : "Completed";
    if (status === "confirmed" || status === "approved") return isRtl ? "مؤكدة" : "Confirmed";
    if (status === "pending") return isRtl ? "قيد الانتظار" : "Pending";
    if (status === "cancelled" || status === "rejected") return isRtl ? "ملغاة" : "Cancelled";
    return status;
  };

  const getAccessLabel = (status) => {
    if (status === "accepted") return isRtl ? "مسموح" : "Allowed";
    if (status === "pending") return isRtl ? "قيد الانتظار" : "Pending";
    if (status === "rejected") return isRtl ? "مرفوض" : "Rejected";
    return "—";
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-start">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'المواعيد' : 'Appointments'}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'نظرة شاملة على مواعيدك' : 'A complete overview of your appointments'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'مواعيد اليوم' : "Today's", value: todayAppointments.length, icon: <Calendar size={18} className="text-white" />, bg: 'bg-[#1f2b6c]' },
          { label: isRtl ? 'مكتملة' : 'Completed', value: completed, icon: <CheckCircle size={18} className="text-white" />, bg: 'bg-emerald-600' },
          { label: isRtl ? 'مؤكدة' : 'Confirmed', value: confirmed, icon: <Clock size={18} className="text-white" />, bg: 'bg-amber-500' },
          { label: isRtl ? 'قيد الانتظار' : 'Pending', value: pending, icon: <Users size={18} className="text-white" />, bg: 'bg-purple-600' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-4 flex items-center gap-3 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div className="text-start">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border p-4 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold mb-4 text-start" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'المواعيد الأسبوعية' : 'Weekly Appointments'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.weeklyPatients || []}>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
                <Bar dataKey="new" fill="#1f2b6c" radius={[6, 6, 6, 6]} barSize={12} />
                <Bar dataKey="exixiting" fill="#D7DCF4" radius={[6, 6, 6, 6]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border p-4 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold mb-4 text-start" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'توزيع الحالات' : 'Case Distribution'}</h3>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد بيانات' : 'No data'}</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', background: 'var(--card-bg)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Appointments Registry / Table */}
      <div className="rounded-2xl border shadow-[var(--shadow-soft)] overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-4 border-b text-start" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'سجل المواعيد والحجوزات' : "Appointments Registry"}</h3>
        </div>
        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد مواعيد حالياً' : 'No appointments yet'}</div>
          ) : (
            <table className="w-full min-w-[900px] text-xs sm:text-sm text-center">
              <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3">{isRtl ? 'اسم المريض' : 'Patient Name'}</th>
                  <th className="px-4 py-3">{isRtl ? 'الوقت' : 'Time'}</th>
                  <th className="px-4 py-3">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3">{isRtl ? 'صلاحية الروشتة' : 'Prescription Access'}</th>
                  <th className="px-4 py-3">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((p) => (
                  <tr key={p.booking_id} className="border-t hover:bg-[var(--hover-bg)]" style={{ borderColor: 'var(--card-border)' }}>
                    <td className="px-4 py-3 font-semibold text-slate-800" style={{ color: 'var(--text-primary)' }}>
                      {p.patient_name || "Unknown"}
                      {p.patient_phone && <p className="text-[10px] text-slate-400 mt-0.5">{p.patient_phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{p.booking_from} — {p.booking_to || '—'}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.booking_date ? new Date(p.booking_date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>
                        {getStatusLabel(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.prescription_access_status === 'accepted' ? 'bg-green-50 text-green-600' :
                        p.prescription_access_status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        p.prescription_access_status === 'rejected' ? 'bg-red-50 text-red-600' : 'text-slate-400'
                      }`}>
                        {getAccessLabel(p.prescription_access_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirmPayment(p.booking_id)}
                              disabled={actionLoading === p.booking_id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition border border-green-200 disabled:opacity-60 cursor-pointer font-semibold"
                            >
                              {actionLoading === p.booking_id && <Loader2 size={10} className="animate-spin" />}
                              <span>{isRtl ? "تأكيد الدفع" : "Confirm Payment"}</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p.booking_id, "rejected")}
                              disabled={actionLoading === p.booking_id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition border border-red-200 disabled:opacity-60 cursor-pointer font-semibold"
                            >
                              <span>{isRtl ? "رفض" : "Reject"}</span>
                            </button>
                          </>
                        )}

                        {p.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(p.booking_id, "completed")}
                              disabled={actionLoading === p.booking_id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition border border-teal-200 disabled:opacity-60 cursor-pointer font-semibold"
                            >
                              {actionLoading === p.booking_id && <Loader2 size={10} className="animate-spin" />}
                              <span>{isRtl ? "إكمال الكشف" : "Complete Visit"}</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p.booking_id, "cancelled")}
                              disabled={actionLoading === p.booking_id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition border border-red-200 disabled:opacity-60 cursor-pointer font-semibold"
                            >
                              <span>{isRtl ? "إلغاء" : "Cancel"}</span>
                            </button>
                          </>
                        )}

                        {p.status === "confirmed" &&
                          (!p.prescription_access_status || p.prescription_access_status === "rejected") && (
                            <button
                              onClick={() => handleRequestAccess(p.booking_id)}
                              disabled={actionLoading === p.booking_id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition border border-amber-200 disabled:opacity-60 cursor-pointer font-semibold"
                            >
                              {actionLoading === p.booking_id ? <Loader2 size={10} className="animate-spin" /> : <Clock size={10} />}
                              <span>{isRtl ? "طلب الصلاحية" : "Request Access"}</span>
                            </button>
                          )}

                        {p.status === "confirmed" &&
                          p.prescription_access_status === "accepted" && (
                            <button
                              onClick={() => openPrescriptionModal(p.booking_id, p.patient_name)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition border border-green-200 cursor-pointer font-semibold"
                            >
                              <Plus size={10} />
                              <span>{isRtl ? "روشتة" : "Prescribe"}</span>
                            </button>
                          )}

                        <button
                          onClick={() => navigate(`/doctor-dashboard/patients/${p.booking_id}`)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer font-semibold"
                        >
                          <FileText size={10} />
                          <span>{isRtl ? "التفاصيل" : "Details"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--card-border)' }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
              {isRtl ? 'السابق' : 'Previous'}
            </button>
            <div className="flex items-center gap-2">
              {getPages().map((pn) => (
                <button
                  key={pn}
                  onClick={() => setPage(pn)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition"
                  style={{
                    borderColor: 'var(--card-border)',
                    background: pn === page ? '#1f2b6c' : 'transparent',
                    color: pn === page ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {pn}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
              {isRtl ? 'التالي' : 'Next'}
            </button>
          </div>
        )}
      </div>

      {/* Prescription Form Modal */}
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
    </div>
  );
}
