import React, { useEffect, useRef, useState } from "react";
import { Search, UserCheck, CalendarDays } from 'lucide-react';
import { useTranslation } from "react-i18next";
export default function Structure() {
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
const [show, setShow] = useState(false);
const sectionRef = useRef(null);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShow(true);
        observer.unobserve(entry.target); 
      }
    },
    { threshold: 0.2 } 
  );
  
  if (sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
  const steps = [
    { icon: <Search size={24} />, title: t("structure.step1Title"), desc: t("structure.step1Desc") },
    { icon: <UserCheck size={24} />, title: t("structure.step2Title"), desc: t("structure.step2Desc") },
    { icon: <CalendarDays size={24} />, title: t("structure.step3Title"), desc: t("structure.step3Desc") }
  ];

  return (
    <div dir={isEnglish ? "ltr" : "rtl"} className="w-full p-4 md:p-10 flex justify-center items-center">
      <div 
      ref={sectionRef}
      className="bg-[#f3f7fd] rounded-4xl p-8 md:p-12 lg:mx-14 shadow-sm container">
        <div className={` text-center mb-10  transition-all  duration-1000
    ${
      show
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8"
    }
  `}
>
          <h2 className="text-3xl font-bold text-[#001a6e] mb-2">
      {t("structure.title")}
          </h2>
          <p className="text-slate-500">{t("structure.subtitle")}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
        <div 
  key={index}  
  className={`p-8 bg-white border border-slate-100 rounded-3xl shadow-sm cursor-pointer 
  transition-all duration-500 ease-out 
  hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:duration-200
  ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
  `} 
  style={{ transitionDelay: `${index * 180}ms` }}
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