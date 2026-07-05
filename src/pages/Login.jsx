import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
export default function Login() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("login.invalidEmail"))
        .required(t("login.emailRequired")),

      password: Yup.string()
        .min(6, t("login.passwordMin"))
        .required(t("login.passwordRequired")),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/login",
          values
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-gray-50 flex justify-center items-center p-4"
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-indigo-50 hidden md:flex justify-center items-center p-8 order-1 md:order-2">
          <img src={register} className="w-3/4 object-contain" alt="Registration Illustration" />
        </div>
        <div className="p-8 md:p-12 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} className="w-8 h-8" alt="Logo" />
            <h2 className="text-2xl font-bold text-indigo-900">Medaura</h2>
          </div>
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Link to="/login" className="px-6 py-2 rounded-full bg-indigo-900 text-white">{t("login.login")}</Link>
            <Link to="/CreateAccount" className="px-6 py-2 text-gray-500">{t("login.signUp")}</Link>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block text-gray-700">{t("login.email")}</label>
              <input
                type="email"
                name="email"
                placeholder={t("login.emailPlaceholder")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg px-4 outline-none transition focus:ring-2 focus:ring-indigo-200
                ${formik.errors.email && formik.touched.email ? "border-red-500" : "border-gray-300"}`}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="text-red-500 text-xs mt-1 block">{formik.errors.email}</span>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="text-sm font-medium mb-1 block text-gray-700">{t("login.password")}</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none transition
${isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"}
focus:ring-2 focus:ring-indigo-200
${formik.errors.password && formik.touched.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                className={`absolute top-9 text-gray-400 hover:text-indigo-900 ${isEnglish ? "right-3" : "left-3"
                  }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.errors.password && formik.touched.password && (
                <span className="text-red-500 text-xs mt-1 block">{formik.errors.password}</span>
              )}
            </div>
            <div className="flex justify-between items-center mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={formik.handleChange}
                  className={`flex justify-between items-center  text-sm ${isEnglish ? "flex-row" : "flex-row-reverse"
                    }`}
                />
                {t("login.rememberMe")}
              </label>
              <Link to="/forgetPassword" className="text-indigo-900 hover:underline">
                {t("login.forgotPassword")}
              </Link>
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-white font-semibold transition-colors duration-300"
            >
              {t("login.login")}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            {t("login.noAccount")}{" "}
            <Link
              to="/CreateAccount"
              className="text-indigo-900 hover:underline font-medium"
            >
              {t("login.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}