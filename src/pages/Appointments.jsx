import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function Appointments() {
  const [date, setDate] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isEnglish = i18n.language.startsWith('en');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedKey, setExpandedKey] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [doctorProfiles, setDoctorProfiles] = useState({});
  const [staffProfiles, setStaffProfiles] = useState({});

  useEffect(() => {
    async function fetchBookings() {
      if (!isAuthenticated) {
         setLoading(false);
         return;
      }
      try {
        setLoading(true);
        setError('');
        const res = await axiosInstance.get('/api/book/my-bookings');
        let payload = res.data;
        let data = payload?.data || payload;
        let finalBookings = [];
        if (Array.isArray(data)) finalBookings = data;
        else if (Array.isArray(data?.data)) finalBookings = data.data;
        else if (Array.isArray(data?.bookings)) finalBookings = data.bookings;
        else if (Array.isArray(payload?.bookings)) finalBookings = payload.bookings;
        
        setBookings(finalBookings);
      } catch (err) {
        console.error('Fetch bookings error:', err);
        setError(isEnglish ? 'Failed to load bookings.' : 'فشل تحميل الحجوزات.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    if (bookings.length === 0) return;
    
    const docIds = [...new Set(bookings.map(b => b.doctor_id).filter(Boolean))];
    const staffIds = [...new Set(bookings.map(b => b.staff_id).filter(Boolean))];

    const missingDocIds = docIds.filter(id => !doctorProfiles[id]);
    const missingStaffIds = staffIds.filter(id => !staffProfiles[id]);

    if (missingDocIds.length === 0 && missingStaffIds.length === 0) return;

    async function loadProfiles() {
      try {
        const docPromises = missingDocIds.map(id => axiosInstance.get(`/api/doctors/${id}/profile`).then(res => {
            const data = res.data?.data?.doctor || res.data?.doctor || res.data?.data || res.data;
            return { type: 'doctor', id, name: data.full_name || data.name, specialty: data.specialist || data.specialty };
        }).catch(() => null));

        const staffPromises = missingStaffIds.map(id => axiosInstance.get(`/api/staff/${id}/profile`).then(res => {
            const data = res.data?.data?.staff || res.data?.staff || res.data?.data || res.data;
            return { type: 'staff', id, name: data.full_name || data.name, specialty: data.specialty || data.role_title };
        }).catch(() => null));

        const results = await Promise.all([...docPromises, ...staffPromises]);
        const newDocs = {};
        const newStaff = {};
        
        results.forEach(r => {
            if (!r) return;
            if (r.type === 'doctor') newDocs[r.id] = r;
            if (r.type === 'staff') newStaff[r.id] = r;
        });

        if (Object.keys(newDocs).length > 0) setDoctorProfiles(prev => ({...prev, ...newDocs}));
        if (Object.keys(newStaff).length > 0) setStaffProfiles(prev => ({...prev, ...newStaff}));
      } catch (err) {
        console.error('Error loading profiles', err);
      }
    }
    loadProfiles();
  }, [bookings, doctorProfiles, staffProfiles]);

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;
    setCancelError('');
    setCancelingId(bookingId);
    try {
        await axiosInstance.patch(`/api/book/${bookingId}/cancel`);
        setBookings(prev => prev.map(b => (b.id === bookingId || b.booking_id === bookingId || b._id === bookingId) ? { ...b, status: 'cancelled' } : b));
        const res = await axiosInstance.get('/api/book/my-bookings');
        let payload = res.data;
        let data = payload?.data || payload;
        let finalBookings = [];
        if (Array.isArray(data)) finalBookings = data;
        else if (Array.isArray(data?.data)) finalBookings = data.data;
        else if (Array.isArray(data?.bookings)) finalBookings = data.bookings;
        else if (Array.isArray(payload?.bookings)) finalBookings = payload.bookings;
        if (finalBookings.length > 0) setBookings(finalBookings);
    } catch (err) {
        setCancelError(err.response?.data?.message || err.response?.data?.error || (isEnglish ? 'Failed to cancel booking' : 'حدث خطأ أثناء إلغاء الحجز'));
    } finally {
        setCancelingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    if (!appliedDate) return bookings;
    return bookings.filter(b => b.booking_date?.startsWith(appliedDate));
  }, [bookings, appliedDate]);

  const STATUS_LABELS = {
    pending: isEnglish ? 'Pending' : 'قيد الانتظار',
    confirmed: isEnglish ? 'Confirmed' : 'مؤكد',
    completed: isEnglish ? 'Completed' : 'تم الكشف',
    cancelled: isEnglish ? 'Cancelled' : 'ملغي',
    canceled: isEnglish ? 'Cancelled' : 'ملغي',
    rejected: isEnglish ? 'Rejected' : 'مرفوض',
  };

  const isPastBooking = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    return d < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString(isEnglish ? 'en-US' : 'ar-EG', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  const formatTime = (dateStr, timeStr) => {
    if (!timeStr) return '—';
    const m = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (!m) return timeStr;
    const d = new Date();
    d.setHours(parseInt(m[1], 10), parseInt(m[2], 10), 0, 0);
    return d.toLocaleTimeString(isEnglish ? 'en-US' : 'ar-EG', { hour: 'numeric', minute: '2-digit' });
  };

  const DETAIL_LABELS_AR = {
    booking_date: "تاريخ الحجز",
    booking_from: "وقت البداية",
    booking_to: "وقت النهاية",
    booking_time: "وقت الحجز",
    status: "الحالة",
    patient_name: "اسم المريض",
    patient_phone: "رقم المريض",
    patient_id: "رقم المريض",
    doctor_name: "اسم الطبيب",
    doctor_id: "رقم الطبيب",
    doctor_specialty: "تخصص الطبيب",
    staff_name: "اسم الطبيب",
    staff_id: "رقم الطبيب",
    staff_specialty: "التخصص",
    specialist: "التخصص",
    specialty: "التخصص",
    clinic_id: "رقم العيادة",
    created_at: "تاريخ الإنشاء",
    updated_at: "تاريخ التحديث",
    prescription_access_status: "حالة الوصول للوصفة",
    prescription_access_responded_at: "تاريخ الرد على الوصول",
  };

  const DETAIL_LABELS_EN = {
    booking_date: "Booking Date",
    booking_from: "Start Time",
    booking_to: "End Time",
    booking_time: "Booking Time",
    status: "Status",
    patient_name: "Patient Name",
    patient_phone: "Patient Phone",
    patient_id: "Patient ID",
    doctor_name: "Doctor Name",
    doctor_id: "Doctor ID",
    doctor_specialty: "Doctor Specialty",
    staff_name: "Doctor Name",
    staff_id: "Doctor ID",
    staff_specialty: "Specialty",
    specialist: "Specialty",
    specialty: "Specialty",
    clinic_id: "Clinic ID",
    created_at: "Created At",
    updated_at: "Updated At",
    prescription_access_status: "Prescription Access Status",
    prescription_access_responded_at: "Prescription Responded At",
  };

  const getDetailLabel = (key) => {
    const dict = isEnglish ? DETAIL_LABELS_EN : DETAIL_LABELS_AR;
    return dict[key] || key.replace(/_/g, ' ');
  };

  const formatDetailValue = (key, value) => {
    if (key === 'status') {
       const lower = String(value).toLowerCase();
       return STATUS_LABELS[lower] || value;
    }
    if (['booking_date', 'created_at', 'updated_at', 'prescription_access_responded_at'].includes(key)) {
       return formatDate(value);
    }
    if (['booking_from', 'booking_to', 'booking_time'].includes(key)) {
       return formatTime(new Date().toISOString(), value);
    }
    return String(value);
  };

  if (!isAuthenticated && !loading) {
     return (
       <div className="min-h-[70vh] flex items-center justify-center pt-28 bg-white">
         <div className="max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
           <h1 className="text-2xl font-semibold text-slate-900 mb-3">{isEnglish ? 'Authentication Required' : 'أنت بحاجة لتسجيل الدخول'}</h1>
           <p className="text-slate-600">{isEnglish ? 'Please log in to view your appointments.' : 'يرجى تسجيل الدخول أولاً لعرض حجوزاتك القادمة وسجل زياراتك.'}</p>
         </div>
       </div>
     );
  }

  return (
    <main className="min-h-screen pb-16 pt-28 bg-white" dir={isEnglish ? 'ltr' : 'rtl'}>
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col gap-6 rounded-4xl border border-slate-200 bg-[#f8fafc] p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">{isEnglish ? 'My Bookings' : 'حجوزاتي'}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {isEnglish ? 'Upcoming Appointments & History' : 'المواعيد القادمة وسجل الزيارات'}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-600">
                {isEnglish ? 'Filter by Date' : 'تصفية بالتاريخ'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setAppliedDate(date)}
                disabled={!date}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${ 
                  date
                    ? 'bg-[#001A6E] text-white hover:bg-[#001250]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isEnglish ? 'Apply' : 'تطبيق'}
              </button>
              {(date || appliedDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setDate('');
                    setAppliedDate('');
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isEnglish ? 'Show All' : 'عرض الكل'}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title={isEnglish ? 'Total Bookings' : 'إجمالي الحجوزات'} value={bookings.length} />
            <StatCard title={isEnglish ? 'Today\'s Bookings' : 'حجوزات اليوم'} value={bookings.filter((b) => b.booking_date?.startsWith(new Date().toISOString().slice(0, 10))).length} />
            <StatCard title={isEnglish ? 'Currently Showing' : 'المعروضة الآن'} value={filteredBookings.length} />
          </div>
        </div>

        <div className="mt-10">
          {loading && (
            <p className="text-center text-base font-semibold text-slate-600">
              {isEnglish ? 'Loading bookings...' : 'جارٍ تحميل الحجوزات...'}
            </p>
          )}

          {cancelError && (
            <p className="text-center text-base font-semibold text-red-600 mb-6">
              {cancelError}
            </p>
          )}

          {!loading && error && (
            <p className="text-center text-base font-semibold text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              {isEnglish ? 'No matching bookings found.' : 'لا توجد حجوزات مطابقة للتاريخ المحدد.'}
            </div>
          )}

          <div className="grid gap-4">
            {filteredBookings.map((booking, index) => {
              const bookingId = booking.booking_id || booking.id || booking._id;
              const bookingKey = `booking-${bookingId}-${index}`;
              const isPast = isPastBooking(booking.booking_date);
              const normalizedStatus = (booking.status || '').toLowerCase();
              const isCancelled = ['cancelled', 'canceled', 'rejected'].includes(normalizedStatus);
              const isCompleted = normalizedStatus === 'completed';
              const isCancellable = !isPast && !isCancelled && !isCompleted;
              
              const statusLabel = isPast ? (isEnglish ? 'Completed' : 'تم الكشف') : (STATUS_LABELS[normalizedStatus] || booking.status || 'Upcoming');
              
              let statusClass = 'text-slate-500';
              if (isPast) statusClass = 'text-red-600'; // Medaura colors past as red
              else if (isCancelled) statusClass = 'text-slate-500';
              else if (normalizedStatus === 'pending') statusClass = 'text-amber-600';
              else statusClass = 'text-emerald-600';

              const isExpanded = expandedKey === bookingKey;
              
              const docProfile = booking.doctor_id ? doctorProfiles[booking.doctor_id] : null;
              const stfProfile = booking.staff_id ? staffProfiles[booking.staff_id] : null;
              
              const profName = booking.doctor_name || booking.staff_name || docProfile?.name || stfProfile?.name || (booking.doctor_id ? `Doctor #${booking.doctor_id}` : '—');
              const profSpec = booking.doctor_specialty || booking.staff_specialty || booking.specialist || booking.specialty || docProfile?.specialty || stfProfile?.specialty || '';
              
              const titleLine = [profName, profSpec].filter(Boolean).join(' - ');

              return (
                <article key={bookingKey} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${statusClass}`}>{statusLabel}</p>
                      <h2 className="mt-2 text-base font-semibold text-slate-900">{titleLine || '—'}</h2>
                    </div>

                    <div className="flex flex-col items-start gap-1 text-sm text-slate-600 sm:items-end">
                      <span className="font-medium text-slate-800">
                        {formatDate(booking.booking_date)}
                      </span>
                      <span className="font-medium text-[#001A6E]">
                        {formatTime(booking.booking_date, booking.booking_from)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      {isCancellable && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(bookingId)}
                          disabled={cancelingId === bookingId}
                          className="self-start sm:self-auto rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancelingId === bookingId ? (isEnglish ? 'Canceling...' : 'جارٍ الإلغاء...') : (isEnglish ? 'Cancel Booking' : 'إلغاء الحجز')}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedKey(isExpanded ? null : bookingKey)}
                        className="self-start sm:self-auto rounded-xl bg-[#001A6E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#001250]"
                      >
                        {isExpanded ? (isEnglish ? 'Hide Details' : 'إخفاء التفاصيل') : (isEnglish ? 'View Details' : 'عرض التفاصيل')}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 pt-4">
                      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(booking).map(([key, value]) => {
                          if (['id', '_id', 'booking_id', 'prescription', 'patient_photo'].includes(key)) return null;
                          if (value === null || value === undefined || value === '') return null;
                          if (typeof value === 'object') return null;
                          
                          let label = getDetailLabel(key);
                          return (
                            <div key={key}>
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {label}
                              </dt>
                              <dd className="mt-1 text-sm font-medium text-slate-700 break-words">
                                {formatDetailValue(key, value)}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}