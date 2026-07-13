import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";
function Contact() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-[#FAFCFF] flex items-center justify-center px-4 mt-12"
    >
      <div className="w-full max-w-155 bg-white border border-[#D8E3FF] rounded-4xl shadow-[0_20px_60px_rgba(47,86,211,.12)] py-12 px-8 text-center">

        <div className="flex justify-center">
          <div className="w-22.5 h-22.5 rounded-full bg-[#EEF3FF] flex items-center justify-center">
            <div className="w-17.5 h-17.5 rounded-full bg-[#E5ECFF] flex items-center justify-center">
              <Stethoscope
                size={50}
                strokeWidth={2.5}
                className="text-slate-900"
              />
            </div>
          </div>
        </div>
        <h1 className="mt-8 text-[80px] md:text-[100px] font-black leading-none text-slate-800">
          404
        </h1>
        <p className="mt-4 text-b
        ase md:text-lg text-[#7A88B4] leading-8 max-w-md mx-auto">
          {t("contactDetails.title")}
        </p>
        <p className="mt-5 text-[20px] text-[#7A88B4] leading-9">
          {t("contactDetails.description")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-10 bg-[#1838a0] hover:bg-[#0e2369] text-white font-semibold rounded-xl px-8 py-3 transition-all duration-300 hover:scale-105"
        >
          {t("contactDetails.backHome")}
          <span>{isEnglish ? "→" : "←"}</span>
        </Link>
      </div>
    </div>
  );
}

export default Contact;