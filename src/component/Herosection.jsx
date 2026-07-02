import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users, Stethoscope, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
export default function Herosection() {
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
const fullText = t("hero.typing");
useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
    if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
    } else {
        clearInterval(interval);
    }
    }, 25);
    return () => clearInterval(interval);
}, []);

return (
    <section
dir={isEnglish ? "ltr" : "rtl"}
className="relative flex flex-col items-center justify-center min-h-screen bg-white p-4 md:p-8 lg:p-12 font-sans"
><style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
        @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        }
        .animate-float {
        animation: float 4s ease-in-out infinite;
        }
    `}</style>
<div className="font-cairo container max-w-7xl flex flex-col gap-12 w-full bg-[#f3f7fd] rounded-4xl p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full"><div className="w-full lg:w-1/2 flex flex-col items-start z-10">
            <span className="px-4 py-2.5 text-[16px] font-medium text-[#2563eb] rounded-full bg-white border border-slate-100 shadow-xs mb-6">
            {t("hero.badge")}
            </span>
            <p className="text-[17px] leading-relaxed text-[#0f1a4f] mb-6 max-w-xl min-h-18 after:content-['|'] after:animate-pulse after:text-[#2563eb] after:ml-0.5 font-bold">
            {t("hero.typing")}
            </p>
            <h1 className="text-4xl md:text-[44px] lg:text-[48px] font-bold text-[#0f1a4f] leading-tight mb-2">
            {t("hero.title1")}
            </h1>
            <h2 className="text-4xl md:text-[44px] lg:text-[48px] font-bold text-[#2563eb] leading-tight mb-6">
            {t("hero.title2")}
            </h2>
            <p className="text-[16px] text-[#5c6b93] font-medium mb-8 max-w-lg">
            {t("hero.description")}
            </p>        
            <div className="flex flex-row items-center gap-4 w-full">
                <Link to="/Doctors">
            <button type="button" className="px-8 py-3.5 font-bold active:scale-95 transition text-sm text-white rounded-full bg-[#162f80] hover:bg-[#2a5be1] shadow-sm">
                {t("hero.bookNow")}
            </button>
            </Link>
        <Link 
            to="/Specialties" 
            className="inline-block px-6 py-3.5 font-bold active:scale-95 transition text-sm text-[#162f80] rounded-full bg-transparent border-2 border-[#162f80] hover:bg-[#2563eb]/5 text-center ">
            {t("hero.explore")}
                </Link>
            </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10">
            <div className="animate-float w-full max-w-110 bg-[#f3f7fd] p-4 rounded-[40px]">
            <div className="relative w-full aspect-4/5 rounded-4xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <img 
                className="w-full h-full object-cover object-center" 
                src="src/assets/landing.webp" 
                alt="Doctor representation" 
                />
            </div>
            </div>
        </div>
        </div>
        <div className="w-full bg-[#ffff] border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs z-10 mt-4">
        <div className="flex items-center gap-4 w-full bg-[#f3f7fd] p-4 rounded-2xl border border-slate-50 shadow-xs hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#edf3ff] flex items-center justify-center text-[#162f80] group-hover:bg-[#2c4ebd] group-hover:text-white transition-colors duration-300">
            <Users className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
            <h4 className="text-xl font-bold text-[#0f1a4f]">+12</h4>
            <p className="text-xs text-[#5c6b93] font-medium">{t("hero.happyPatients")}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 w-full bg-[#f3f7fd] p-4 rounded-2xl border border-slate-50 shadow-xs hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#edf3ff] flex items-center justify-center text-[#162f80] group-hover:bg-[#2c4ebd] group-hover:text-white transition-colors duration-300">
            <Stethoscope className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
            <h4 className="text-xl font-bold text-[#0f1a4f]">+2</h4>
            <p className="text-xs text-[#5c6b93] font-medium">{t("hero.licensedDoctors")}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 w-full bg-[#f3f7fd] p-4 rounded-2xl border border-slate-50 shadow-xs hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-[#edf3ff] flex items-center justify-center text-[#162f80] group-hover:bg-[#2c4ebd] group-hover:text-white transition-colors duration-300">
            <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
            <h4 className="text-xl font-bold text-[#0f1a4f]">24/7</h4>
            <p className="text-xs text-[#5c6b93] font-medium">{t("hero.alwaysAvailable")}</p>
        </div>
        </div>
        </div>
        </div>
    </section>
);
}