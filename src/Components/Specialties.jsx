import React, { useState } from "react";

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
  const [isEnglish, setIsEnglish] = useState(false);

  const content = {
    ar: {
      title: "اختر التخصص المناسب",

      subtitle: "احجز موعدك مع أفضل الأطباء في غضون دقائق",

      search: "ابحث عن تخصص...",

      specialties: "جميع التخصصات الطبية 🔗",

      doctor: "طبيب",

      available: "طبيب متاح",

      button: "عرض الأطباء",
    },

    en: {
      title: "Choose the right specialty",

      subtitle: "Book your appointment with the best doctors in minutes",

      search: "Search for specialty...",

      specialties: "Medical Specialties",

      doctor: "Doctor",

      available: "Available Doctors",

      button: "View Doctors",
    },
  };g

  const t = isEnglish ? content.en : content.ar;

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
      ar: "مخ وأعصاب",
      en: "Neurology",
      doctors: 0,
      color: "bg-purple-600",
      border: "border-purple-600",
      icon: Brain,
    },

    {
      ar: "عظام",
      en: "Orthopedics",
      doctors: 1,
      color: "bg-orange-500",
      border: "border-orange-500",
      icon: Bone,
    },

    {
      ar: "صدر وجهاز تنفسي",
      en: "Pulmonology",
      doctors: 0,
      color: "bg-blue-500",
      border: "border-blue-500",
      icon: Stethoscope,
    },

    {
      ar: "كلى",
      en: "Nephrology",
      doctors: 0,
      color: "bg-cyan-500",
      border: "border-cyan-500",
      icon: Droplets,
    },

    {
      ar: "أورام",
      en: "Oncology",
      doctors: 0,
      color: "bg-red-500",
      border: "border-red-500",
      icon: Scan,
    },

    {
      ar: "أنف وأذن وحنجرة",
      en: "ENT",
      doctors: 0,
      color: "bg-green-500",
      border: "border-green-500",
      icon: Ear,
    },

    {
      ar: "طب العيون",
      en: "Ophthalmology",
      doctors: 0,
      color: "bg-indigo-500",
      border: "border-indigo-500",
      icon: Eye,
    },

    {
      ar: "نساء وتوليد",
      en: "OB-GYN",
      doctors: 0,
      color: "bg-fuchsia-600",
      border: "border-fuchsia-600",
      icon: Syringe,
    },

    {
      ar: "جلدية",
      en: "Dermatology",
      doctors: 0,
      color: "bg-lime-500",
      border: "border-lime-500",
      icon: Sparkles,
    },

    {
      ar: "أسنان",
      en: "Dentistry",
      doctors: 1,
      color: "bg-blue-600",
      border: "border-blue-600",
      icon: Smile,
    },

    {
      ar: "أطفال وحديثي الولادة",
      en: "Pediatrics",
      doctors: 0,
      color: "bg-yellow-500",
      border: "border-yellow-500",
      icon: Baby,
    },
  ];

  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="
min-h-screen
bg-[#f7f9ff]
py-10
px-5
"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-5">
          <button
            onClick={() => setIsEnglish(!isEnglish)}
            className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
text-sm
"
          >
            {isEnglish ? "العربية" : "English"}
          </button>
        </div>

        {/* Header */}

        <div className="text-center">
          <span
            className="
bg-blue-100
text-blue-700
px-4
py-2
rounded-full
text-xs
"
          >
            {t.specialties}
          </span>

          <h1
            className="
text-4xl
font-bold
text-blue-950
mt-6
"
          >
            {t.title}
          </h1>

          <p
            className="
text-gray-400
mt-3
"
          >
            {t.subtitle}
          </p>

          <div
            className="
bg-white
shadow
rounded-xl
max-w-md
mx-auto
mt-8
flex
items-center
px-4
py-3
"
          >
            <input
              placeholder={t.search}
              className="
outline-none
w-full
text-sm
"
            />

            <Search size={20} />
          </div>
        </div>

        {/* Cards */}

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
          {specialties.map((item, index) => {
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
                {/* Icon */}

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

                <h3
                  className="
font-bold
text-gray-800
"
                >
                  {isEnglish ? item.en : item.ar}
                </h3>

                <p
                  className="
text-gray-400
text-xs
mt-1
"
                >
                  {item.en}
                </p>

                <span
                  className="

inline-block

bg-blue-50

text-blue-600


px-3

py-1


rounded-full


text-xs


mt-4


"
                >
                  {item.doctors} {t.doctor}
                </span>

                {/* Hover Button */}

                <button
                  className="


absolute


bottom-4


left-5


right-5



bg-pink-600


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

"
                >
                  {t.button}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Specialties;
