import React from 'react'
import { useTranslation } from "react-i18next";
const About = () => {
const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
  return (
    <div dir={isEnglish ? "ltr" : "rtl"}  className="min-h-screen bg-white px-4 md:px-8 flex items-center mt-13 md:mt-20 mb-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div className="flex justify-center">
            <img
              src="https://medaura-pi.vercel.app/_next/image?url=%2Fimages%2Faboutus.png&w=3840&q=75"
              alt="About Medaura"
              className="w-full max-w-full md:max-w-md rounded-3xl object-cover"
            />
          </div>
          <div
  className={`text-center ${
    isEnglish ? "lg:text-left" : "lg:text-right"
  }`}
>
            <p className="text-[#001a6e] font-semibold sm:text-lg mb-2 ">
              {t("aboutPage.badge")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-2xl mb-2 inline-block text-[#111827] mb-6">
               {t("aboutPage.title")}
            </h1>
            <p className="text-[#111827] leading-8 mb-6">
             {t("aboutPage.description1")}
            </p>
            <p className="text-[#111827] leading-8 mb-8">
              {t("aboutPage.description2")}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#001a6e] font-medium bg-[#f7f9ff] ">
               {t("aboutPage.feature1")}
              </div>

              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#001a6e] font-medium bg-[#f7f9ff]">
                {t("aboutPage.feature2")}
              </div>

              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#001a6e] font-medium bg-[#f7f9ff]">
                {t("aboutPage.feature3")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;