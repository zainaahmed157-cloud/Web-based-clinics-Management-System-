import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaUser, FaHospital, FaUserMd, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";
import { useTranslation } from "react-i18next";

export default function CreateAccount() {
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const formik = useFormik({
    initialValues: { role: "patient", name: "", email: "", password: "", confirmPassword: "", specialization: "", clinic: "", agree: false },
    validationSchema: Yup.object({
      name: Yup.string().required(t("register.nameRequired")),

      email: Yup.string()
        .email(t("register.invalidEmail"))
        .required(t("register.emailRequired")),

      password: Yup.string()
        .min(6, t("register.passwordMin"))
        .required(t("register.passwordRequired")),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("register.passwordMatch"))
        .required(t("register.confirmPasswordRequired")),

      agree: Yup.boolean()
        .oneOf([true], t("register.agreeRequired")),
    }),
    onSubmit: async (values) => { console.log(values); }
  });

  const roles = [
    { label: t("register.patient"), val: "patient", icon: <FaUser /> },
    { label: t("register.joinClinic"), val: "joinClinic", icon: <FaHospital /> },
    { label: t("register.doctor"), val: "doctor", icon: <FaUserMd /> },
    { label: t("register.clinic"), val: "clinic", icon: <FaHospital /> },
  ];

  return (
    <div dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#EEF1FF] hidden md:flex justify-center items-center">
          <img src={register} alt="register" className="w-3/4" />
        </div>
        <div className="p-8 md:p-12 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} className="w-8 h-8" alt="Logo" />
            <h2 className="text-2xl font-bold text-indigo-900">Medaura</h2>
          </div>
          <div className={`bg-gray-100 rounded-full p-1 flex ${isEnglish ? "flex-row" : "flex-row-reverse"
            }`}>
            <Link to="/login" className="px-6 py-2 rounded-full bg-indigo-900 text-white">{t("register.login")}</Link>
            <Link to="/CreateAccount" className="px-6 py-2 text-gray-500">{t("register.signUp")}</Link>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-6 mt-5">
              {roles.map((item) => (
                <button key={item.val} type="button" onClick={() => { setRole(item.val); formik.setFieldValue("role", item.val); }}
                  className={`border rounded-xl py-3 flex justify-center gap-2 items-center transition ${role === item.val ? "border-[#312c85] bg-indigo-50 text-[#312c85]" : "border-gray-300"}`}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <label className="block mb-1">
                {role === "clinic"
                  ? t("register.clinicName")
                  : t("register.fullName")}
              </label>
              <input
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none
${isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"}`}
                placeholder={role === "clinic" ? t("register.clinicName") : t("register.fullName")}
              />
              {formik.touched.name && formik.errors.name && <span className="text-red-500 text-xs">{formik.errors.name}</span>}
            </div>
            {role === "joinClinic" && (
              <>
                <label className="block mb-1">{t("register.selectClinic")}</label>
                <select name="clinic" onChange={formik.handleChange} className={`w-full h-10 border rounded-lg outline-none mb-4
${isEnglish ? "px-4" : "text-right px-4"}`}>
                  <option>{t("register.chooseClinic")}</option>
                  <option value="clinic1">Clinic 1</option>
                  <option value="clinic2">Clinic 2</option>
                  <option value="clinic3">Clinic 3</option>
                </select>
              </>
            )}

            {(role === "doctor" || role === "joinClinic") && (
              <>
                <label className="block mb-1">{t("register.specialization")}</label>
                <select name="specialization" onChange={formik.handleChange} className={`w-full h-10 border rounded-lg outline-none mb-4
${isEnglish ? "px-4" : "text-right px-4"}`}>
                  <option>{t("register.chooseSpecialization")}</option>
                  <option value="cardiology">{t("register.cardiology")}</option>
                  <option value="dermatology">{t("register.dermatology")}</option>
                  <option value="neurology">{t("register.neurology")}</option>
                  <option value="pediatrics">{t("register.pediatrics")}</option>
                  <option value="psychiatry">{t("register.psychiatry")}</option>
                  <option value="radiology">{t("register.radiology")}</option>
                  <option value="surgery">{t("register.surgery")}</option>
                </select>
              </>
            )}
            <div className="mb-4">
              <label className="block mb-1">{t("register.email")}</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none
${isEnglish ? "px-4" : "text-right px-4"}`}
                placeholder={t("register.emailPlaceholder")}
              />
              {formik.touched.email && formik.errors.email && <span className="text-red-500 text-xs">{formik.errors.email}</span>}
            </div>
            <div className="relative mb-4">
              <label className="block mb-1">{t("register.password")}</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none
${isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"}`}
                placeholder={t("register.passwordPlaceholder")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-9 text-gray-500 ${isEnglish ? "right-3" : "left-3"
                }`}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.touched.password && formik.errors.password && <span className="text-red-500 text-xs">{formik.errors.password}</span>}
            </div>
            <div className="relative mb-4">
              <label className="block mb-1">{t("register.confirmPassword")}</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none
${isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"}`}
                placeholder={t("register.confirmPasswordPlaceholder")}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={`absolute top-9 text-gray-500 ${isEnglish ? "right-3" : "left-3"
                }`}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className="text-red-500 text-xs">{formik.errors.confirmPassword}</span>}
            </div>
            <div className="flex  items-center gap-2 mt-5">
              <input type="checkbox" name="agree" checked={formik.values.agree} onChange={formik.handleChange} className={`flex items-center gap-2  ${isEnglish ? "" : "flex-row-reverse justify-end"
                }`} />
              <span>{t("register.agree")}</span>
            </div>
            {formik.errors.agree && <span className="text-red-500 text-sm">{formik.errors.agree}</span>}
            <button type="submit" className="w-full mt-6 bg-[#312c85] hover:bg-[#28226f] text-white py-3 rounded-xl transition">
              {t("register.signUp")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}