import React, { useState } from "react";
import { Search, MapPin, Phone, Star } from "lucide-react";

import clinic1 from "../assets/clinic1.webp";

function Clinic() {
  const [search, setSearch] = useState("");

  const clinics = [
    {
      id: 1,
      name: "FAtma Ebrahim",
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
    {
      id: 3,
      name: "Smile Dental",
      city: "Cairo",
      phone: "01122334455",
      doctors: 3,
      rate: 4.8,
      image: clinic1,
    },
    {
      id: 4,
      name: "Care Clinic",
      city: "Alexandria",
      phone: "01255667788",
      doctors: 2,
      rate: 4.7,
      image: clinic1,
    },
  ];

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#f7f9fc] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-[#0B2A6F]">
          العيادات
        </h1>

        <p className="text-center text-gray-500 mt-4">
          أفضل العيادات حسب آراء وتجارب المستخدمين
        </p>

        <div className="relative max-w-4xl mx-auto mt-10">
          <input
            type="text"
            placeholder="Search clinics by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white py-4 pl-6 pr-14 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
          />

          <Search
            size={22}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-14">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-[30px] overflow-hidden shadow-md border hover:shadow-xl duration-300"
            >
              <div className="relative p-4">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="w-full h-72 object-cover rounded-3xl"
                />

                <div className="absolute top-7 right-7 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow">
                  <span className="font-semibold text-sm">
                    {clinic.rate}
                  </span>

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </div>
              </div>
                            <div className="px-6 pb-6">

                <h2 className="text-3xl font-bold text-center text-[#0B2A6F]">
                  {clinic.name}
                </h2>

                <div className="flex items-center justify-center gap-2 text-gray-500 mt-4">
                  <MapPin size={18} />
                  <span>{clinic.city}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 mt-2">
                  <Phone size={18} />
                  <span>{clinic.phone}</span>
                </div>

                <div className="flex justify-between items-center mt-6">

                  <p className="text-gray-600">
                    Doctors :
                    <span className="font-semibold ml-1">
                      {clinic.doctors}
                    </span>
                  </p>

                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star)=>(
                      <Star
                        key={star}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                </div>

                <button
                  className="
                  w-full
                  mt-8
                  py-3
                  rounded-xl
                  border-2
                  border-[#0B2A6F]
                  text-[#0B2A6F]
                  font-semibold
                  hover:bg-[#0B2A6F]
                  hover:text-white
                  duration-300
                  "
                >
                  عرض التفاصيل
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}

export default Clinic;