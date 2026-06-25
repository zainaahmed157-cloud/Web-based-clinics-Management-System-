import React from 'react'

import { useState } from "react";

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[150px]">
      <p className="text-slate-400 text-lg text-right">
        {title}
      </p>

      <div className="flex justify-center items-center h-20">
        <h2 className="text-5xl font-bold text-slate-900">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default function Appointments() {
  const [date, setDate] = useState("");

  const appointments = [];

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-6 py-10">

      <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 shadow-sm">

        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">

          <div>
            <p className="text-slate-400 text-sm mb-1">
              حجوزات
            </p>

            <h1 className="text-4xl font-bold text-slate-900">
              المواعيد القادمة وسجل الزيارات
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              تصفية بالتاريخ
            </span>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 px-5 rounded-full border border-slate-300 bg-white outline-none"
            />

            <button className="h-14 px-8 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition">
              تطبيق
            </button>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <StatCard
            title="إجمالي الحجوزات"
            value="0"
          />

          <StatCard
            title="حجوزات اليوم"
            value="0"
          />

          <StatCard
            title="المعروضة الآن"
            value="0"
          />

        </div>

      </div>

      <div className="mt-8 bg-white border border-dashed border-slate-300 rounded-[32px] min-h-[260px] flex items-center justify-center">
        {appointments.length === 0 && (
          <p className="text-slate-500 text-xl">
            لا توجد حجوزات مطابقة للتاريخ المحدد.
          </p>
        )}
      </div>

    </div>
  );
}