import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axiosInstance from '../api/axiosInstance';

export default function MostBookedDoctors() {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const sectionRef = useRef(null);
    const [doctorsData, setDoctorsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await axiosInstance.get('/api/doctors');
                const payload = response.data;
                const list = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.data?.doctors || payload.doctors || [];
                const sortedList = list.sort((a, b) => Number(b.average_rating || b.rating || 0) - Number(a.average_rating || a.rating || 0));
                setDoctorsData(sortedList.slice(0, 8).map(doc => ({ ...doc, id: doc.id ?? doc.doctor_id })));
            } catch (err) {
                console.error("Error fetching most booked doctors:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDoctors();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setShow(true);
        }, { threshold: 0.2 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="p-4 md:p-10 flex justify-center">
            <div ref={sectionRef} className="w-full max-w-7xl bg-white p-8 md:p-12 rounded-[40px] border border-[#d8e3ff]">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold text-[#0f1a4f]">{t("doctorsDetails.title")}</h3>
                    <p className="text-[#5c6b93] mt-3 text-sm">{t("doctorsDetails.subtitle")}</p>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-3">
                        <button className="doctor-prev w-12 h-12 rounded-full border border-[#d8e3ff] flex items-center justify-center hover:bg-[#162f80] hover:text-white transition">
                            <ChevronLeft size={22} />
                        </button>
                        <button className="doctor-next w-12 h-12 rounded-full border border-[#d8e3ff] flex items-center justify-center hover:bg-[#162f80] hover:text-white transition">
                            <ChevronRight size={22} />
                        </button>
                    </div>
                     <Link to="/Doctors" className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all">
                                {t("doctorsDetails.viewAll")}
                              </Link>
                </div>
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: ".doctor-prev",
                        nextEl: ".doctor-next",
                    }}
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                >
                    {loading ? (
                        <div className="py-20 text-center text-slate-500 font-medium">Loading doctors...</div>
                    ) : doctorsData.map((doc) => (
                        <SwiperSlide key={doc.id}>
                            <div className={`group bg-white p-4 rounded-3xl border border-[#d8e3ff] shadow-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl  mb-6 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <div className="overflow-hidden rounded-2xl mb-4">
                                    <img src={doc.photo || doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.full_name || doc.name || 'Doctor')}&background=E0E7FF&color=1E3A8A&size=256`} alt={doc.full_name || doc.name} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <h3 className="font-bold text-[#0f1a4f]">{doc.full_name || doc.name}</h3>
                                <p className="text-sm text-[#5c6b93] mb-3 line-clamp-1">{doc.specialist || doc.specialty}</p>
                                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 w-fit px-2 py-1 rounded-lg text-xs font-bold mb-4">
                                    <Star size={12} fill="currentColor" /> {Number(doc.average_rating || doc.rating || 0).toFixed(1)}
                                </div>
                                <div className="bg-[#f3f7fd] p-4 rounded-2xl flex justify-between text-sm mb-4">
                                    <div>
                                        <p className="text-[#5c6b93] text-xs">{t("doctorsDetails.sessionFee")}</p>
                                        <p className="font-bold text-[#0f1a4f]">{doc.consultation_price || doc.fee} EGP</p>
                                    </div>
                                    <div>
                                        <p className="text-[#5c6b93] text-xs">{t("doctorsDetails.experience")}</p>
                                        <p className="font-bold text-[#0f1a4f]">{doc.experience || doc.exp || 0} {t("doctorsDetails.years")}</p>
                                    </div>
                                </div>
                                <Link to={`/doctors/${doc.id}`} className="block w-full py-3 bg-[#162f80] text-white text-center rounded-xl font-bold hover:bg-[#2563eb] transition-colors">
                                    {t("doctorsDetails.viewProfile")}
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}