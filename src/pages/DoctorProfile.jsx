import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Star, Clock, MapPin, ArrowLeft, ArrowRight, ShieldCheck, Mail, Phone, CalendarCheck, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import DatePicker from '../components/DatePicker';

function getWhatsAppUrl(phone) {
  if (!phone) return "#";
  let cleaned = String(phone).replace(/[^\d+]/g, "");
  if (!cleaned) return "#";
  if (cleaned.startsWith("+20")) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith("20")) {
    // already prefix
  } else {
    if (cleaned.startsWith("0")) {
      cleaned = "20" + cleaned.substring(1);
    } else {
      cleaned = "20" + cleaned;
    }
  }
  return `https://wa.me/${cleaned}`;
}

function formatWorkDays(workDaysStr, isEnglish) {
  if (!workDaysStr) return "";
  const daysMapEn = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    tues: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    thur: "Thursday",
    fri: "Friday",
    sat: "Saturday"
  };
  const daysMapAr = {
    sun: "الأحد",
    mon: "الإثنين",
    tue: "الثلاثاء",
    tues: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    thur: "الخميس",
    fri: "الجمعة",
    sat: "السبت"
  };
  const mapToUse = isEnglish ? daysMapEn : daysMapAr;
  return workDaysStr
    .toLowerCase()
    .split(",")
    .map(d => d.trim())
    .map(d => mapToUse[d] || d)
    .join(isEnglish ? ", " : "، ");
}

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const isEnglish = i18n.language.startsWith('en');

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Rating states
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError('');
        let response;
        let docData;
        try {
           response = await axiosInstance.get(`/api/doctors/${id}/profile`);
           const payload = response.data;
           docData = payload.data?.doctor || payload.doctor || payload.data || payload;
        } catch (err1) {
           try {
             response = await axiosInstance.get(`/api/doctors/${id}`);
             const payload = response.data;
             docData = payload.data?.doctor || payload.doctor || payload.data || payload;
           } catch (err2) {
             response = await axiosInstance.get(`/api/doctors`);
             const list = response.data?.data?.doctors || response.data?.doctors || response.data?.data || response.data || [];
             docData = list.find(d => d.id === id || d._id === id);
             if (!docData) throw new Error("Doctor not found in list");
           }
        }
        
        setDoctor(docData);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError(isEnglish ? "Failed to load doctor profile." : "فشل تحميل الملف الشخصي للطبيب.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, isEnglish]);

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) {
        setTimeSlots([]);
        return;
      }
      try {
        setSlotsLoading(true);
        const res = await axiosInstance.get(`/api/book/slots?doctor_id=${id}&booking_date=${selectedDate}`);
        const slots = res.data?.slots || res.data?.data?.slots || res.data || [];
        setTimeSlots(Array.isArray(slots) ? slots : []);
      } catch (err) {
        console.error("Failed to fetch slots", err);
        setTimeSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate, id]);

  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.full_name || doctor?.name || 'Doctor')}&background=E0E7FF&color=1E3A8A&size=256`;
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
        navigate('/Login');
        return;
    }
    if (!selectedDate || !selectedTime) {
        setBookingError(isEnglish ? "Please select a date and time." : "يرجى اختيار التاريخ والوقت.");
        return;
    }
    try {
        setBookingLoading(true);
        setBookingError('');
        setBookingSuccess('');
        
        await axiosInstance.post("/api/book", {
            doctor_id: id,
            booking_date: selectedDate,
            booking_from: selectedTime
        });

        setBookingSuccess(isEnglish ? "Appointment booked successfully!" : "تم حجز الموعد بنجاح!");
        setSelectedDate('');
        setSelectedTime('');
    } catch (err) {
        console.error("Booking Error:", err.response?.data);
        const backendMsg = err.response?.data?.message || err.response?.data?.error;
        const defaultMsg = isEnglish ? "Failed to book appointment. Please try again." : "فشل حجز الموعد. يرجى المحاولة مرة أخرى.";
        setBookingError(backendMsg ? `${defaultMsg} (${backendMsg})` : defaultMsg);
    } finally {
        setBookingLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
        navigate('/Login');
        return;
    }
    if (ratingValue < 1 || ratingValue > 5) {
        setRatingError(isEnglish ? "Please select a star rating." : "يرجى تحديد عدد النجوم.");
        return;
    }

    try {
        setRatingLoading(true);
        setRatingError('');
        setRatingSuccess('');

        await axiosInstance.post(`/api/ratings/doctor/${id}`, {
            rating: ratingValue,
            comment: ratingComment.trim() || undefined
        });

        setRatingSuccess(isEnglish ? "Thank you! Your rating has been submitted successfully." : "شكراً لك! تم إرسال تقييمك بنجاح.");
        setRatingValue(0);
        setRatingComment('');
    } catch (err) {
        console.error("Rating Error:", err.response?.data);
        const backendMsg = err.response?.data?.message || err.response?.data?.error;
        const defaultMsg = isEnglish ? "Failed to submit rating. Please try again." : "فشل إرسال التقييم. يرجى المحاولة مرة أخرى.";
        setRatingError(backendMsg ? `${defaultMsg} (${backendMsg})` : defaultMsg);
    } finally {
        setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-800 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 font-semibold">{isEnglish ? "Loading profile..." : "جاري تحميل الملف الشخصي..."}</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          <p className="text-lg text-slate-800 font-semibold mb-4">{error || (isEnglish ? "Doctor not found." : "الطبيب غير موجود.")}</p>
          <Link to="/Doctors" className="inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
            {isEnglish ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {isEnglish ? "Back to Doctors" : "العودة إلى الأطباء"}
          </Link>
        </div>
      </div>
    );
  }

  const rating = Number(doctor.average_rating || doctor.rating || 0);

  return (
    <main dir={isEnglish ? "ltr" : "rtl"} className="min-h-screen bg-white pb-16 pt-28 font-sans">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Back link */}
        <Link to="/Doctors" className="flex items-center gap-2 text-[#001A6E] font-bold mb-8 hover:opacity-80 transition-opacity w-fit">
          {isEnglish ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          {isEnglish ? "Back to Doctors" : "العودة إلى الأطباء"}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
           {/* Left Section */}
           <section className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                 <div className="w-40 h-40 relative rounded-3xl overflow-hidden shadow-md shrink-0 bg-gray-50">
                    <img 
                      src={doctor.photo || doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name || doctor.name || 'Doctor')}&background=E0E7FF&color=1E3A8A&size=256`}
                      alt={doctor.full_name || doctor.name}
                      onError={handleImageError}
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute ${isEnglish ? 'left-0' : 'right-0'} top-0 flex h-6 items-center gap-1 bg-[#001a8d] px-2 text-xs font-bold text-white`}>
                      {rating.toFixed(1)}
                      <span className="text-[10px] text-[#ffd84d]">★</span>
                    </div>
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                       <h1 className="text-2xl font-bold text-[#001A6E]">{doctor.full_name || doctor.name}</h1>
                       {doctor.work_days && (
                          <span className="text-xs font-semibold text-[#001A6E] bg-blue-50 px-3 py-1 rounded-full">
                            {formatWorkDays(doctor.work_days, isEnglish)}
                          </span>
                       )}
                    </div>
                    <p className="text-gray-500 font-medium">{doctor.specialist || doctor.specialty}</p>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-500">{rating.toFixed(1)}</span>
                      {doctor.total_ratings && <span className="text-xs text-gray-400">({doctor.total_ratings})</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-400 mb-1">{isEnglish ? "Session Fee" : "سعر الكشف"}</p>
                          <p className="font-bold text-[#001A6E]">{doctor.consultation_price || "-"} {isEnglish ? "EGP" : "ج.م"}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-400 mb-1">{isEnglish ? "City" : "المدينة"}</p>
                          <p className="font-bold text-[#001A6E]">{doctor.location || "-"}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <section>
                 <h2 className="text-xl font-bold text-[#001A6E] mb-4">{isEnglish ? "About Doctor" : "نبذة عن الطبيب"}</h2>
                 <p className="text-gray-500 leading-relaxed text-sm">
                   {doctor.bio || (isEnglish ? "An experienced medical professional dedicated to providing top-quality patient care." : "طبيب متخصص ذو خبرة واسعة في تقديم رعاية طبية متميزة للمرضى.")}
                 </p>
              </section>

              <section>
                 <h2 className="text-xl font-bold text-[#001A6E] mb-4">{isEnglish ? "Clinic Location" : "موقع العيادة"}</h2>
                 <div className="relative h-72 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <iframe 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(doctor.location || 'Egypt')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                 </div>
              </section>
           </section>

           {/* Right Section */}
           <aside className="lg:sticky lg:top-32 h-fit space-y-8">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                 <h2 className="text-xl font-bold text-[#001A6E] mb-6">{isEnglish ? "Book Now" : "احجز الان"}</h2>
                 
                 {bookingSuccess && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">{bookingSuccess}</div>}
                 {bookingError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{bookingError}</div>}

                   <div className="flex flex-col gap-3">
                    <button onClick={() => setShowDatePicker(true)} className="w-full flex items-center justify-start gap-2 text-sm text-gray-500 border border-gray-100 px-4 rounded-xl hover:bg-gray-50 transition-colors bg-white h-12 text-left">
                        <CalendarCheck className="w-4 h-4 text-[#001A6E] shrink-0" />
                        <span>{selectedDate || (isEnglish ? "Select Date" : "اختر التاريخ")}</span>
                    </button>
                    {showDatePicker && (
                        <DatePicker 
                           selectedDate={selectedDate} 
                           allowedDays={doctor.work_days} 
                           onSelect={(date) => {setSelectedDate(date); setSelectedTime("");}} 
                           onClose={() => setShowDatePicker(false)} 
                        />
                    )}
                    {selectedDate && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           {slotsLoading ? (
                               <p className="text-xs text-gray-400 py-2 col-span-2 text-center">{isEnglish ? "Loading available times..." : "جاري تحميل المواعيد..."}</p>
                           ) : timeSlots.length === 0 ? (
                               <p className="text-xs text-gray-400 py-2 col-span-2 text-center">{isEnglish ? "No available times for this date." : "لا توجد مواعيد متاحة لهذا اليوم."}</p>
                           ) : (
                               timeSlots.map((slot, idx) => {
                                   const timeValue = typeof slot === 'object' ? slot.from : slot;
                                   
                                   let displayLabel = timeValue;
                                   if (timeValue) {
                                       let [hours, minutes] = timeValue.split(':');
                                       hours = parseInt(hours, 10);
                                       const modifier = hours >= 12 ? 'PM' : 'AM';
                                       if (hours === 0) hours = 12;
                                       if (hours > 12) hours -= 12;
                                       displayLabel = `${modifier} ${hours.toString().padStart(2, '0')}:${minutes}`;
                                   }

                                   return (
                                       <button 
                                          key={idx} 
                                          onClick={() => setSelectedTime(timeValue)} 
                                          className={`py-2 text-xs font-bold rounded-lg border transition-colors ${selectedTime === timeValue ? 'bg-[#001A6E] border-[#001A6E] text-white' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                       >
                                          {displayLabel}
                                       </button>
                                   )
                               })
                           )}
                        </div>
                    )}
                 </div>

                 <button onClick={handleBook} disabled={bookingLoading} className="mt-6 w-full bg-[#001A6E] text-white py-4 rounded-2xl font-bold hover:bg-[#001250] transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-70 flex justify-center items-center">
                    {bookingLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEnglish ? "Book Now" : "احجز الان")}
                 </button>

                 {doctor.phone && (
                    <a href={getWhatsAppUrl(doctor.phone)} target="_blank" rel="noreferrer" className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer text-center">
                       <MessageSquare className="w-5 h-5" />
                       <span>{isEnglish ? "Contact via WhatsApp" : "تواصل عبر واتساب"}</span>
                    </a>
                 )}

                 {(doctor.work_from || doctor.work_to) && (
                    <p className="mt-4 text-xs text-gray-400 text-center">
                       {isEnglish ? "Working Hours:" : "مواعيد العمل:"} {doctor.work_from || ""} - {doctor.work_to || ""}
                    </p>
                 )}
              </div>
           </aside>
        </div>

        {/* Ratings Section */}
        <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#001A6E] mb-4">
              {isEnglish ? "Patient Reviews" : "تقييمات المرضى"}
            </h2>
            <div className="flex flex-col items-center">
              <div className="mb-3 flex justify-center text-yellow-400">
                <Star className="h-7 w-7 fill-yellow-400" />
              </div>
              <p className="text-4xl font-extrabold text-[#001A6E]">
                {rating.toFixed(1)}
              </p>
              <p className="font-bold text-lg text-gray-800">
                {isEnglish ? "Overall Rating" : "التقييم العام"}
              </p>
              <p className="text-gray-400 text-sm">
                {doctor.total_ratings ? (isEnglish ? `From ${doctor.total_ratings} visitors` : `من ${doctor.total_ratings} زوار`) : (isEnglish ? "From visitors" : "من الزوار")}
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400">
            {isEnglish ? "No reviews available yet." : "لا توجد تقييمات حتى الآن."}
          </p>

          <div className="mt-10 border-t border-[#e6ecf6] pt-8 text-center">
            <h3 className="text-lg font-bold text-[#001A6E] mb-4">
              {isEnglish ? "Rate Doctor" : "قيم الطبيب"}
            </h3>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
              {ratingError && <div className="w-full text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{ratingError}</div>}
              {ratingSuccess && <div className="w-full text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">{ratingSuccess}</div>}

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRatingValue(value)} className="transition-transform hover:scale-110">
                    <Star className={`h-6 w-6 ${value <= ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-[#d7deef]'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                  value={ratingComment} 
                  onChange={(e) => setRatingComment(e.target.value)} 
                  placeholder={isEnglish ? "Write your comment here..." : "اكتب تعليقك هنا..."} 
                  rows={3} 
                  className="w-full rounded-2xl border border-[#dce5f6] px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#001A6E]" 
              />
              <button 
                  onClick={handleSubmitRating} 
                  disabled={ratingLoading} 
                  className="rounded-2xl bg-[#001A6E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition-colors hover:bg-[#162f80] disabled:opacity-70 flex justify-center items-center"
              >
                  {ratingLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEnglish ? "Submit Rating" : "إرسال التقييم")}
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
