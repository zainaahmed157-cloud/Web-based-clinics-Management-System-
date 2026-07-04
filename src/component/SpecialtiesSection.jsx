import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { 
Brain, Bone, Scan, Ear, Eye, 
Heart, Stethoscope, Droplets, Smile, Baby, 
Droplet, Syringe, ArrowRight 
} from 'lucide-react'; 

const specialtiesData = [
{ id: 1, key:"neurology", count: 0, icon: Brain },
{ id: 2, key:"orthopedics", count: 1, icon: Bone },
{ id: 3, key:"oncology", count: 0, icon: Scan },
{ id: 4, key:"ent", count: 0, icon: Ear },
{ id: 5, key:"ophthalmology", count: 0, icon: Eye },
{ id: 6, key:"cardiology", count: 0, icon: Heart },
{ id: 7, key:"pulmonology", count: 0, icon: Stethoscope },
{ id: 8, key:"nephrology", count: 0, icon: Droplets },
{ id: 9, key:"dentistry", count: 1, icon: Smile },
{ id: 10, key:"pediatrics", count: 0, icon: Baby },
{ id: 11, key:"dermatology", count: 0, icon: Droplet },
{ id: 12, key:"gynecology", count: 0, icon: Syringe },
];

export default function SpecialtiesPanel() {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");
    const [showCards, setShowCards] = useState(false);
    const [show, setShow] = useState(false);
    const sectionRef = useRef(null);

useEffect(() => {
const observer = new IntersectionObserver(
    ([entry]) => {
    if (entry.isIntersecting) {
        setShow(true);
        setShowCards(true);
        observer.unobserve(entry.target);
    }
    },
    { threshold: 0.2 }
);
if (sectionRef.current) observer.observe(sectionRef.current);
return () => observer.disconnect();
}, []);
return (
    <div
dir={isEnglish ? "ltr" : "rtl"}
className="min-h-screen p-4 md:p-10 flex justify-center items-start"
>
    <div ref={sectionRef} className="w-full max-w-7xl bg-white p-8 md:p-12 rounded-4xl border border-[#d8e3ff] shadow-[0_10px_30px_rgba(0,0,0,0.02)] ">
        <div className={` text-center z-10 flex flex-col items-center transition-all duration-1000
    ${
    show
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8"
    }
`}
>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a4f] mb-3 text-center">
            {t("specialtiesPanel.title")}
        </h2>
        <p className="text-[15px] text-[#5c6b93] font-medium text-center">
            {t("specialtiesPanel.subtitle")}
        </p>
        </div>
        <div className={`w-full flex justify-start z-10 transition-all duration-1000 delay-200
    ${
    show
        ? "opacity-100 translate-x-0"
        : "opacity-0 -translate-x-6"
    }
`}
>
            <Link  to="/Specialties">
        <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-[#162f80] bg-white border border-slate-100 rounded-full shadow-xs hover:bg-[#edf3ff] hover:scale-95 mb-3 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group" >
            {t("specialtiesPanel.viewAll")}
            <ArrowRight className={`w-4 h-4 transition ${!isEnglish ? "rotate-180" : ""}`}/>
        </button>
        </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
        {specialtiesData.map((item) => {
            const IconComponent = item.icon;
            return (
        <div 
    key={item.id} 
    className={`flex flex-col items-center justify-center p-6 bg-[#f7f9ff] rounded-3xl border border-blue-50/80 cursor-pointer group 
    transition-all duration-500 ease-out 
    hover:transition-transform hover:duration-200 
    hover:scale-[1.03] 
    hover:-translate-y-2
    hover:border-blue-200
    hover:shadow-[0_8px_20px_rgba(235,242,255,0.6)]

    ${showCards 
    ? "opacity-100 translate-y-0 scale-100" 
    : "opacity-0 translate-y-12 rotate-1 scale-90"
    }
`}
  style={{ transitionDelay: `${item.id * 100}ms` }}
>
                <div className="w-16 h-16 flex items-center justify-center  text-[#1946cc] rounded-2xl mb-5  hover:bg-[#162f80] bg-[#e5edff]   hover:text-white transition-colors duration-300 ">
                <IconComponent size={26} strokeWidth={1.8} />
                </div>
                <h3 className="text-[#0f1a4f] font-bold text-base mb-1 text-center group-hover:text-blue-700 transition-colors duration-200">
                {t(`specialtiesPanel.${item.key}`)}
                </h3>
                <span className="text-[#5c6b93] text-xs font-medium tracking-wide">
        {item.count} {t("specialtiesPanel.doctors")}
        </span>
            </div>
            );
        })}
        </div>

    </div>
    </div>
);
}