import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import img1 from "../assets/chosenDoc.webp";
import img2 from "../assets/chosenDoc2.webp";
import img3 from "../assets/chosenDoc3.webp";
const testimonials = [
{
    id: 1,
    name: "Amir Nabil",
    text: "testimonials.text1",
    img: img1,
},
{
    id: 2,
    name: "Karim Adel",
    text: "testimonials.text2",
    img: img2,
},
{
    id: 3,
    name: "Mohamed Saad",
    text: "testimonials.text3",
    img: img3,
},
];
export default function Commint() {
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
    <section ref={sectionRef} className="py-20 px-4 bg-white">
    <div className={`max-w-7xl mx-auto bg-[#f3f7fd] rounded-[40px] p-8 md:p-16 transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a4f] mb-3">{t("testimonials.title")}</h2>
        <p className="text-[#5c6b93]">{t("testimonials.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
            <div 
                key={item.id} 
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2"
            >
                <div className="flex items-center gap-4 mb-6">
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                <h4 className="font-bold text-[#0f1a4f]">{item.name}</h4>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed ">"{t(item.text)}"</p>
            </div>
            ))}
        </div>
        </div>
    </section>
);
}