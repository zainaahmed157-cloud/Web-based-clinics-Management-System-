import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Stethoscope, Star, Clock, MapPin, BadgeCheck, X } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function doctorsDetailsFilterSection() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const [searchParams] = useSearchParams();
  const specialistQuery = searchParams.get('specialist');

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [specialty, setSpecialty] = useState(t("doctorsDetails.allSpecialties"));
  const [price, setPrice] = useState(t("doctorsDetails.allPrices"));
  const [gender, setGender] = useState(t("doctorsDetails.all"));
  const [sortBy, setSortBy] = useState(t("doctorsDetails.topRated"));
  const [searchQuery, setSearchQuery] = useState('');
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };
  
  useEffect(() => {
    if (specialistQuery) {
       const validKeys = ["neurology", "orthopedics", "oncology", "ent", "ophthalmology", "cardiology", "pulmonology", "nephrology", "dentistry", "pediatrics", "dermatology", "obgyn"];
       if (validKeys.includes(specialistQuery.toLowerCase())) {
           setSpecialty(t(`doctorsDetails.${specialistQuery.toLowerCase()}`));
       } else {
           setSpecialty(t("doctorsDetails.allSpecialties"));
       }
    } else {
       setSpecialty(t("doctorsDetails.allSpecialties"));
    }
    setPrice(t("doctorsDetails.allPrices"));
    setGender(t("doctorsDetails.all"));
    setSortBy(t("doctorsDetails.topRated"));
  }, [i18n.language, specialistQuery]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/doctors');
        const payload = response.data;
        const list = Array.isArray(payload) 
          ? payload 
          : Array.isArray(payload.data) 
            ? payload.data 
            : payload.data?.doctors || payload.doctors || [];
            
        setDoctors(list.map((doc) => ({
          ...doc,
          id: doc.id ?? doc.doctor_id,
        })));
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const specialties = [
    t("doctorsDetails.allSpecialties"),
    t("doctorsDetails.neurology"),
    t("doctorsDetails.orthopedics"),
    t("doctorsDetails.oncology"),
    t("doctorsDetails.ent"),
    t("doctorsDetails.ophthalmology"),
    t("doctorsDetails.cardiology"),
    t("doctorsDetails.pulmonology"),
    t("doctorsDetails.nephrology"),
    t("doctorsDetails.dentistry"),
    t("doctorsDetails.pediatrics"),
    t("doctorsDetails.dermatology"),
    t("doctorsDetails.obgyn"),
  ];

  const prices = [
    t("doctorsDetails.allPrices"),
    t("doctorsDetails.under200"),
    t("doctorsDetails.200to500"),
    t("doctorsDetails.500to1000"),
    t("doctorsDetails.over1000"),
  ];

  const genders = [
    t("doctorsDetails.all"),
    t("doctorsDetails.male"),
    t("doctorsDetails.female"),
  ];

  const sortOptions = [
    t("doctorsDetails.topRated"),
    t("doctorsDetails.priceLowHigh"),
    t("doctorsDetails.priceHighLow"),
    t("doctorsDetails.alphabetical"),
  ];

  // Filtering Logic
  const filteredDoctors = doctors.filter(doc => {
     // Specialty filter
     if (specialty !== t("doctorsDetails.allSpecialties")) {
        const specName = (doc.specialist || doc.specialty || "").toLowerCase();
        if (!specName) return false;
        
        // Find if the doctor's specialty matches the selected one (English or Arabic)
        const specialtyTokens = {
            [t("doctorsDetails.neurology")]: ["مخ واعصاب", "neurology", "الأعصاب", "أعصاب"],
            [t("doctorsDetails.orthopedics")]: ["عظام", "orthopedics", "العظام"],
            [t("doctorsDetails.oncology")]: ["الأورام", "oncology", "أورام"],
            [t("doctorsDetails.ent")]: ["طب الأذن والأنف والحنجرة", "ent", "أنف وأذن", "الأنف والأذن والحنجرة"],
            [t("doctorsDetails.ophthalmology")]: ["طب العيون", "ophthalmology", "العيون", "عيون"],
            [t("doctorsDetails.cardiology")]: ["قلب و اوعية دموية", "cardiology", "القلب", "قلب"],
            [t("doctorsDetails.pulmonology")]: ["صدر و جهاز تنفسي", "pulmonology", "الرئة", "صدر"],
            [t("doctorsDetails.nephrology")]: ["كلى", "nephrology", "الكلى", "باطنة وكلى"],
            [t("doctorsDetails.dentistry")]: ["اسنان", "dentistry", "الأسنان", "أسنان"],
            [t("doctorsDetails.pediatrics")]: ["اطفال و حديثي الولادة", "pediatrics", "الأطفال", "أطفال"],
            [t("doctorsDetails.dermatology")]: ["جلدية", "dermatology", "الجلدية"],
            [t("doctorsDetails.obgyn")]: ["نسا و توليد", "obgyn", "ob-gyn", "النساء والتوليد", "نساء وتوليد"],
        };

        const tokens = specialtyTokens[specialty] || [specialty.toLowerCase()];
        const isMatch = tokens.some(token => specName.includes(token.toLowerCase()));
        if (!isMatch) return false;
     }

     // Price filter
     if (price !== t("doctorsDetails.allPrices")) {
         const dPrice = parseFloat(doc.consultation_price) || 0;
         if (price === t("doctorsDetails.under200") && dPrice >= 200) return false;
         if (price === t("doctorsDetails.200to500") && (dPrice < 200 || dPrice > 500)) return false;
         if (price === t("doctorsDetails.500to1000") && (dPrice < 500 || dPrice > 1000)) return false;
         if (price === t("doctorsDetails.over1000") && dPrice <= 1000) return false;
     }

     // Gender filter
     if (gender !== t("doctorsDetails.all")) {
        const isMaleFilter = gender === t("doctorsDetails.male");
        const docGender = (doc.gender || "").toLowerCase();
        if (isMaleFilter && docGender !== "male" && docGender !== "ذكر") return false;
        if (!isMaleFilter && docGender !== "female" && docGender !== "أنثى") return false;
     }

     // Search filter
     if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (doc.full_name || doc.name || "").toLowerCase();
        const spec = (doc.specialist || doc.specialty || "").toLowerCase();
        if (!name.includes(q) && !spec.includes(q)) return false;
     }

     return true;
  }).sort((a, b) => {
      const ra = Number(a.average_rating || a.rating || 0);
      const rb = Number(b.average_rating || b.rating || 0);
      const pa = Number(a.consultation_price || 0);
      const pb = Number(b.consultation_price || 0);

      if (sortBy === t("doctorsDetails.topRated")) return rb - ra;
      if (sortBy === t("doctorsDetails.priceLowHigh")) return pa - pb;
      if (sortBy === t("doctorsDetails.priceHighLow")) return pb - pa;
      if (sortBy === t("doctorsDetails.alphabetical")) {
          return (a.full_name || a.name || "").localeCompare(b.full_name || b.name || "");
      }
      return 0;
  });

  // Handle broken images
  const handleImageError = (e, docName) => {
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(docName || 'Doctor')}&background=E0E7FF&color=1E3A8A&size=256`;
  };

  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="bg-slate-50/40 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased select-none mt-12"
    >
      <div className="max-w-6xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1d4ed8] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-100/60">
          {t("doctorsDetails.badge")}
        </div>
        <h1 className="text-4xl font-bold text-[#1e293b] tracking-tight mb-2">
          {t("doctorsDetails.title")}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {t("doctorsDetails.subtitle")}
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4 relative">
        <div className="relative">
          <div
            className={`absolute inset-y-0 flex items-center pointer-events-none ${isEnglish ? "left-0 pl-4" : "right-0 pr-4"
              }`}
          >
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={t("doctorsDetails.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full py-3.5 bg-white border border-slate-200/80 rounded-2xl
shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20
focus:border-blue-500 text-sm transition-all text-slate-600
placeholder-slate-400
${isEnglish ? "pl-12 pr-4 text-left" : "pr-12 pl-4 text-right"}`} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button className="flex items-center justify-center p-2.5 text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('specialty')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'specialty' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-blue-900 font-semibold">⚕️</span>
              <span>{specialty}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'specialty' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'specialty' && (
              <div className={`absolute mt-2 ${isEnglish ? "left-0" : "right-0"
                } w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1`}>
                {specialties.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setSpecialty(item); setActiveDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-xs transition-colors ${isEnglish ? "text-left" : "text-right"
                      } ${item === specialty
                        ? "bg-[#0f172a] text-white font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                      }`} >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('price')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'price' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-blue-900 font-bold text-[10px]">EGP</span>
              <span>{price === t("doctorsDetails.allPrices")
                ? t("doctorsDetails.consultationPrice")
                : price}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'price' && (
              <div className={`absolute mt-2 ${isEnglish ? "left-0" : "right-0"
                } w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1`}>
                {prices.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setPrice(item); setActiveDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-xs transition-colors ${isEnglish ? "text-left" : "text-right"
                      } ${item === price
                        ? "bg-[#0f172a] text-white font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                      }`}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('gender')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'gender' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-slate-500 font-bold text-[11px]">👤</span>
              <span>{gender === t("doctorsDetails.all")
                ? t("doctorsDetails.gender")
                : gender}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'gender' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'gender' && (
              <div className={`absolute mt-2 ${isEnglish ? "left-0" : "right-0"
                } w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1`}>
                {genders.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setGender(item); setActiveDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-xs transition-colors ${isEnglish ? "text-left" : "text-right"
                      } ${item === gender
                        ? "bg-[#0f172a] text-white font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                      }`}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('sortBy')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'sortBy' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-slate-500 font-bold text-[11px]">⇅</span>
              <span>{t("doctorsDetails.sortBy")}: {sortBy}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'sortBy' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'sortBy' && (
              <div className={`absolute mt-2 ${isEnglish ? "left-0" : "right-0"
                } w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1`}>
                {sortOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setSortBy(item); setActiveDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-xs transition-colors ${isEnglish ? "text-left" : "text-right"
                      } ${item === sortBy
                        ? "bg-[#0f172a] text-white font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                      }`}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      <div className={`max-w-4xl mx-auto mt-6 flex justify-between items-center text-[11px] text-slate-400 px-1 font-medium ${isEnglish ? "" : "flex-row-reverse"}`}>
        <span>{t("doctorsDetails.showing")} <strong className="text-slate-700">{filteredDoctors.length}</strong> {t("doctorsDetails.doctors")}</span>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pb-20">
         {loading ? (
             <div className="text-center py-20 text-slate-500 font-medium text-lg">
                 {isEnglish ? "Loading doctors..." : "جاري تحميل الأطباء..."}
             </div>
         ) : filteredDoctors.length === 0 ? (
             <div className="text-center py-20 text-slate-500 font-medium text-lg">
                 {isEnglish ? "No doctors found." : "لا يوجد أطباء."}
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredDoctors.map((doc, idx) => {
                     const rating = doc.average_rating || doc.rating || 0;
                     return (
                         <article key={doc.id || idx} className="group flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden relative">
                             <div className="h-1 w-full bg-gradient-to-r from-blue-700 to-blue-400" />
                             <div className="p-5 flex flex-col flex-1">
                                 <div className={`flex items-start gap-4 ${isEnglish ? "text-left" : "text-right flex-row-reverse"}`}>
                                     <div className="relative shrink-0 w-[76px] h-[76px] rounded-xl overflow-hidden bg-slate-50 ring-2 ring-slate-100">
                                         <img src={doc.photo || doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.full_name || doc.name || 'Doctor')}&background=E0E7FF&color=1E3A8A&size=256`} alt={doc.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => handleImageError(e, doc.full_name || doc.name)} />
                                         <div className="absolute -bottom-2 -left-2 flex items-center gap-0.5 rounded-full bg-blue-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                                             <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                             <span>{Number(rating).toFixed(1)}</span>
                                         </div>
                                     </div>
                                     <div className="min-w-0 flex-1">
                                         <h2 className="text-[15px] font-bold text-slate-900 line-clamp-1">{doc.full_name || doc.name}</h2>
                                         <div className={`mt-1 flex items-center gap-1.5 ${isEnglish ? "justify-start" : "justify-end"}`}>
                                             <Stethoscope className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                                             <span className="text-[12px] font-semibold text-blue-700 line-clamp-1">{doc.specialist || doc.specialty}</span>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <div className="my-4 h-px bg-slate-100 w-full" />
                                 
                                 <div className="grid grid-cols-2 gap-3 mb-4">
                                     <div className={`flex flex-col rounded-xl bg-slate-50 p-3 ${isEnglish ? "items-start" : "items-end text-right"}`}>
                                         <span className="text-[11px] font-medium text-slate-400">{isEnglish ? "Session Fee" : "سعر الكشف"}</span>
                                         <span className="mt-1 text-[14px] font-bold text-blue-900">{doc.consultation_price} EGP</span>
                                     </div>
                                     <div className={`flex flex-col rounded-xl bg-slate-50 p-3 ${isEnglish ? "items-start" : "items-end text-right"}`}>
                                         <span className="text-[11px] font-medium text-slate-400">{isEnglish ? "Working Hours" : "مواعيد العمل"}</span>
                                         <div className="flex items-center gap-1 mt-1">
                                             <Clock className="h-3 w-3 text-blue-900" />
                                             <span className="text-[13px] font-bold text-blue-900">{doc.work_from} - {doc.work_to}</span>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {doc.location && (
                                     <div className={`mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ${isEnglish ? "justify-start" : "justify-end text-right"}`}>
                                         <MapPin className="h-3.5 w-3.5 text-blue-900 shrink-0" />
                                         <span className="text-[12px] font-medium text-slate-600 line-clamp-1">{doc.location}</span>
                                     </div>
                                 )}
                                 
                                 <div className="mt-auto">
                                     <Link to={`/doctors/${doc.id}`} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 text-[13px] font-semibold text-white shadow hover:bg-blue-800 transition-colors">
                                         {isEnglish ? "View Profile" : "عرض الملف الشخصي"}
                                         <BadgeCheck className="h-4 w-4" />
                                     </Link>
                                 </div>
                             </div>
                         </article>
                     );
                 })}
             </div>
         )}
      </div>
    </div>
  );
}