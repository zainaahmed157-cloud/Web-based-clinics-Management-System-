import React, { useState } from "react";
import { Search, MapPin, Phone, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import clinic1 from "../assets/clinic1.webp";

function Clinic() {
  const [search, setSearch] = useState("");
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const clinics = [
    {
      id: 1,
      name: "Fatma Ebrahim",
      city: "Obour",
      phone: "015501208344",
      doctors: 1,
      rate: 4.9,
      image: clinic1,
    },
    {
      id: 2,
      name: "Medura",
      city: "Obour",
      phone: "01018743096",
      doctors: 1,
      rate: 4.9,
      image: clinic1,
    },

  ];

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-[#f7f9fc] py-16 mt-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-[#0B2A6F] text-center">
          {t("clinicsPage.title")}
        </h1>

        <p className=" text-gray-500 mt-4 text-center">
          {t("clinicsPage.subtitle")}
        </p>

        <div className="relative max-w-4xl mx-auto mt-10">
          <input
            type="text"
            placeholder={t("clinicsPage.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-full border border-gray-300 bg-white py-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 ${isEnglish
                ? "pl-6 pr-14 text-left"
                : "pr-6 pl-14 text-right"
              }`} />

          <Search
            size={22}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isEnglish ? "right-5" : "left-5"
              }`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-5">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-[28px] border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-4"
            >
              <div className="relative">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="w-full h-80 object-cover rounded-3xl"
                />

                <div className={`absolute top-4 ${isEnglish ? "right-7" : "left-7"
                  } bg-white rounded-full px-4 py-2 flex items-center gap-1 shadow`}>
                  <span className="font-semibold text-sm">
                    {clinic.rate}
                  </span>

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </div>
              </div>
              <div className="pt-4">

                <h2 className="mt-2 text-2xl font-bold  text-[#0B2A6F]">
                  {clinic.name}
                </h2>

                <div className="flex justify-center items-center gap-2 mt-2 text-gray-500">
                  <MapPin size={17} className="text-[#8E9BB7]" />
                  <span>{clinic.city}</span>
                </div>

                <div className="flex justify-center  gap-2 mt-3 text-gray-500">
                  <Phone size={17} className="text-[#8E9BB7]" />
                  <span>{clinic.phone}</span>
                </div>

                <div className="flex justify-between items-center mt-7 text-sm">

                  <p className="text-gray-600">
                    {t("clinicsPage.doctors")} :
                    <span className={`font-semibold ${isEnglish ? "ml-1" : "mr-1"
                      }`}>
                      {clinic.doctors}
                    </span>
                  </p>

                  <div className="flex items-center gap-1">

                    <span className="text-gray-400">
                      (0)
                    </span>

                    <span className="font-semibold">
                      {clinic.rate}
                    </span>

                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        className={
                          index < Math.round(clinic.rate)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}

                  </div>
                </div>

                <button
                  className="
w-full
mt-8
py-3
rounded-2xl
border
border-gray-300
text-[#0B2A6F]
font-bold
hover:bg-[#0B2A6F]
hover:text-white
transition-all
duration-300
"
                >
                  {t("clinicsPage.details")}
                </button>

              </div>

            </div>

          ))}
          {filteredClinics.length === 0 && (
            <p className="col-span-2  text-gray-500 text-lg">
              {t("clinicsPage.noResults")}
            </p>
          )}
        </div>

      </div>

    </section>

  );
}

export default Clinic;