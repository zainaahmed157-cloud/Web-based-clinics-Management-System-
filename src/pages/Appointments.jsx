import React from 'react'
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
  const appointments = [];

  return (
    <div dir={isEnglish ? "ltr" : "rtl"} className="max-w-7xl mx-auto px-6 py-10 mt-20">
      <div className="bg-[#f8fafc] border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
          <div>
            <p className="text-slate-400 text-sm mb-1">
              {t("appointmentsPage.badge")}
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              {t("appointmentsPage.title")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {t("appointmentsPage.filter")}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 px-5 rounded-full border border-slate-300 bg-[#ffffff] outline-none"
            />
            <button className="h-14 px-8 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition">
              {t("appointmentsPage.apply")}
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title={t("appointmentsPage.total")}
            value="0"
          />
          <StatCard
           title={t("appointmentsPage.today")}
            value="0"
          />
          <StatCard
            title={t("appointmentsPage.current")}
            value="0"
          />
        </div>
      </div>
      <div className="mt-8 bg-[#ffffff] border border-dashed border-slate-300 rounded-[32px] min-h-[260px] flex items-center justify-center">
        {appointments.length === 0 && (
          <p className="text-slate-500 text-xl">
           {t("appointmentsPage.empty")}
          </p>
        )}
      </div>

    </div>
  );
}