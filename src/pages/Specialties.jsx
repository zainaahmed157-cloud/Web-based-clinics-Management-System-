
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Eye,
  Ear,
  Scan,
  Droplets,
  Syringe,
  Baby,
  Smile,
  Sparkles,
  Search,
} from "lucide-react";
function Specialties() {
  const { t, i18n } = useTranslation();

  const isEnglish = i18n.language.startsWith("en");
const [search, setSearch] = useState("");
  const specialties = [
    {
      ar: "قلب وأوعية دموية",
      en: "Cardiology",
      doctors: 0,
      color: "bg-pink-600",
      border: "border-pink-600",
      icon: HeartPulse,
    },

    {
      ar: "طب الأعصاب",
      en: "Neurology",
      doctors: 0,
      color: "bg-purple-600",
      border: "border-purple-600",
      icon: Brain,
    },

    {
      ar: "طب العظام",
      en: "Orthopedics",
      doctors: 1,
      color: "bg-orange-500",
      border: "border-orange-500",
      icon: Bone,
    },

    {
      ar: "طب الرئة",
      en: "Pulmonology",
      doctors: 0,
      color: "bg-blue-500",
      border: "border-blue-500",
      icon: Stethoscope,
    },

    {
      ar: "طب الكلى",
      en: "Nephrology",
      doctors: 0,
      color: "bg-cyan-500",
      border: "border-cyan-500",
      icon: Droplets,
    },

    {
      ar: "طب الأورام",
      en: "Oncology",
      doctors: 0,
      color: "bg-red-500",
      border: "border-red-500",
      icon: Scan,
    },

    {
      ar: "طب الانف و الاذن والحنجرة",
      en: "ENT",
      doctors: 0,
      color: "bg-green-500",
      border: "border-green-500",
      icon: Ear,
    },

    {
      ar: "طب العين",
      en: "Ophthalmology",
      doctors: 0,
      color: "bg-indigo-500",
      border: "border-indigo-500",
      icon: Eye,
    },

    {
      ar: "طب النساء والولادة",
      en: "Obstetrics and Gynecology",
      doctors: 0,
      color: "bg-fuchsia-600",
      border: "border-fuchsia-600",
      icon: Syringe,
    },

    {
      ar: "طب الجلد",
      en: "Dermatology",
      doctors: 0,
      color: "bg-lime-500",
      border: "border-lime-500",
      icon: Sparkles,
    },

    {
      ar: "طب الأسنان",
      en: "Dentistry",
      doctors: 1,
      color: "bg-blue-600",
      border: "border-blue-600",
      icon: Smile,
    },

    {
      ar: "طب الأطفال",
      en: "Pediatrics",
      doctors: 0,
      color: "bg-yellow-500",
      border: "border-yellow-500",
      icon: Baby,
    },
  ];
const filteredSpecialties = specialties.filter((item) => {
  const text = isEnglish ? item.en : item.ar;

  return text.toLowerCase().includes(search.toLowerCase());
});
  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="
min-h-screen
bg-[#f7f9ff]
py-24
px-5
"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <span
            className="
    inline-flex
    items-center
    gap-2
    bg-blue-100
    text-[#1d2a6d]
    px-4
    py-2
    rounded-full
    text-xs
    font-medium
      "
          >
            <Stethoscope className="w-6 h-6" strokeWidth={2.5} />
            {t("specialtiesPage.badge")}
          </span>
          <h1
            className="
text-4xl
font-bold
text-blue-950
mt-6
"
          >
            {t("specialtiesPage.title")}
          </h1>

          <p
            className="
text-gray-400
mt-3
"
          >
            {t("specialtiesPage.subtitle")}
          </p>
<div className="flex items-center justify-center gap-4 mt-6 text-[#1d2a6d]">
  <div className="flex items-center gap-1">
    <span className="text-3xl font-bold">
      {specialties.length}
    </span>
    <span className="text-lg">
      {t("specialtiesPage.specialtiesCount")}
    </span>
  </div>

  <span className="text-gray-300 text-2xl">•</span>

  <div className="flex items-center gap-1">
    <span className="text-lg font-bold">
      +{specialties.filter((item) => item.doctors > 0).length}
    </span>
    <span className="text-lg">
      {t("specialtiesPage.availableDoctors")}
    </span>
  </div>
</div>

<div
  className="
    bg-white
    border-2
    border-[#1d2a6d]
    rounded-xl
    max-w-md
    mx-auto
    mt-8
    flex
    items-center
    px-4
    py-3
    focus-within:ring-2
    focus-within:ring-blue-300
  "
>
<input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder={t("specialtiesPage.search")}
  className="w-full outline-none bg-transparent text-sm"
/>
  <Search size={20} className="text-gray-400" />
</div>
<div className="flex items-center justify-between mt-10 mb-6">
  <h2 className="text-2xl font-bold text-[#0f1d63]">
    {t("specialtiesPage.sectionTitle")}
  </h2>
  <Link to="/Doctors" className="flex items-center gap-2 text-[#1d2a6d] hover:text-blue-700 font-medium transition">
    {t("specialtiesPage.viewAll")}
    <span>{isEnglish ? "→" : "←"}</span>
  </Link>
</div>
        </div>

        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-5
mt-10
"
> 
        {filteredSpecialties.map((item, index) => {
          {filteredSpecialties.length === 0 && (
  <p className="text-center text-gray-500 col-span-4">
    {t("specialtiesPage.noResults")}
  </p>
)}
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`
bg-white
rounded-2xl
shadow
p-5
text-center
pb-14
border-t-4
${item.border}
relative
overflow-hidden
group
hover:shadow-xl
hover:-translate-y-1
transition
duration-300
`}
              >
                <div
                  className={`
${item.color}
w-12
h-12
mx-auto
rounded-full
flex
items-center
justify-center
text-white
mb-4
group-hover:scale-110
transition
`}
                >
                  <Icon size={22} />
                </div>

              <h3 className="font-bold text-gray-800">
  {isEnglish ? item.en : item.ar}
</h3>
<p className="text-gray-400 text-xs mt-1">
  {isEnglish ? item.ar : item.en}
</p>
<span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs mt-4">
  {item.doctors} {t("specialtiesPage.doctor")}
</span>
<button
  className={`
    absolute
    bottom-4
    left-5
    right-5
    ${item.color}
    text-white
    rounded-full
    py-2
    text-sm
    font-semibold
    opacity-0
    translate-y-5
    group-hover:opacity-100
    group-hover:translate-y-0
    transition
    duration-300
  `}
>
  {t("specialtiesPage.button")}
</button>
              </div>
            );
          })}
          {filteredSpecialties.length === 0 && (
    <p className="col-span-4 text-center text-gray-500 text-lg py-10">
      {t("specialtiesPage.noResults")}
    </p>
  )}
        </div>
      </div>
      
    </div>
  );
}

export default Specialties;
