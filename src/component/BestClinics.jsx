import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, MapPin, ArrowRight } from "lucide-react";
import img from "../assets/clinic1.webp";
import img2 from "../assets/1781499727799-516805496.webp";
const doctorsData = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    specialty: "consultantOrthopedics",
    fee: "200 EGP",
    exp: 5,
    image: img2,
  },
  {
    id: 2,
    name: "Ali Alshawadfi",
    specialty: "consultantDentistry",
    fee: "299 EGP",
    exp: 8,
    image: img,
  },
];
export default function BestClinics() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShow(true);
    }, { threshold: 0.2 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="p-4 md:p-10 flex justify-center">
      <div ref={sectionRef} className="w-full max-w-7xl bg-white p-8 md:p-12 rounded-4xl border border-[#d8e3ff]">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0f1a4f] mb-2"> {t("clinicBest.title")}</h2>
            <p className="text-[#5c6b93]">{t("clinicBest.subtitle")}</p>
          </div>
          <Link to="/clinics" className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all">
            {t("clinicBest.viewAll")}
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorsData.map((doc) => (
            <div
  key={doc.id}
  className={`group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden
  transition-all duration-500 ease-out
  hover:shadow-xl hover:-translate-y-2
  ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
>
              <div className="overflow-hidden rounded-t-3xl">
  <img
    src={doc.image}
    alt={doc.name}
    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
  />
</div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-[#0f1a4f]">{doc.name}</h3>
                  <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg text-sm">
                    <Star size={14} fill="currentColor" /> {doc.fee}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-sm mb-4">
                  <span className="flex items-center gap-1"><MapPin size={16} /> {doc.exp} {t("doctors.years")}</span>
                </div>
                <Link to={`/doctor/${doc.id}`} className="w-full block text-center py-2 bg-[#f3f7fd] text-[#162f80] rounded-xl font-bold hover:bg-[#162f80] hover:text-white transition-colors">
                  {t("clinicBest.viewProfile")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}