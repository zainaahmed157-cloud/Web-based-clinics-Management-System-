import React from 'react';
import { Search, UserCheck, CalendarDays } from 'lucide-react';
import { useTranslation } from "react-i18next";
export default function Structure() {
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
  const steps = [
    { icon: <Search size={24} />, title: t("structure.step1Title"), desc: t("structure.step1Desc") },
    { icon: <UserCheck size={24} />, title: t("structure.step2Title"), desc: t("structure.step2Desc") },
    { icon: <CalendarDays size={24} />, title: t("structure.step3Title"), desc: t("structure.step3Desc") }
  ];

  return (
    <div dir={isEnglish ? "ltr" : "rtl"} className="w-full p-4 md:p-10 flex justify-center items-center">
      <div className="bg-[#f3f7fd] rounded-4xl p-8 md:p-12 lg:mx-14 shadow-sm container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#001a6e] mb-2">
      {t("structure.title")}
          </h2>
          <p className="text-slate-500">{t("structure.subtitle")}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
            >
              <p className="text-[10px] font-bold text-[#4a6cf7] tracking-widest mb-3">{t("structure.step")} {index + 1}</p>
              <div className="w-12 h-12 flex items-center justify-center bg-[#f0f4ff] text-[#4a6cf7] rounded-xl mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}