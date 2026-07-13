import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";

export default function Login() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
      setLoading(true);
      setError("");
      try {
        const userData = await login(values.email, values.password);
        // Route by role
        if (userData?.user_type === "doctor") {
          navigate("/doctor-dashboard");
        } else if (userData?.user_type === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err.response?.data?.message || t("login.loginFailed"));
      } finally {
        setLoading(false);
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

          {/* Tab switcher */}
          <div
            className={`bg-gray-100 rounded-full p-1 flex mb-6 ${
              isEnglish ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <Link
              to="/Login"
              className="px-6 py-2 rounded-full bg-indigo-900 text-white text-sm font-medium"
            >
              {t("login.login")}
            </Link>
            <Link
              to="/CreateAccount"
              className="px-6 py-2 text-gray-500 text-sm font-medium"
            >
              {t("login.signUp")}
            </Link>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block text-gray-700">
                {t("login.email")}
              </label>
              <input
                type="email"
                name="email"
                id="login-email"
                placeholder={t("login.emailPlaceholder")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none transition px-4
                  focus:ring-2 focus:ring-indigo-200
                  ${isEnglish ? "text-left" : "text-right"}
                  ${
                    formik.errors.email && formik.touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="text-red-500 text-xs mt-1 block">
                  {formik.errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="text-sm font-medium mb-1 block text-gray-700">
                {t("login.password")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="login-password"
                placeholder={t("login.passwordPlaceholder")}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none transition
                  focus:ring-2 focus:ring-indigo-200
                  ${isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"}
                  ${
                    formik.errors.password && formik.touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                id="login-toggle-password"
                className={`absolute top-9 text-gray-400 hover:text-indigo-900 ${
                  isEnglish ? "right-3" : "left-3"
                }`}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.errors.password && formik.touched.password && (
                <span className="text-red-500 text-xs mt-1 block">
                  {formik.errors.password}
                </span>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6 text-sm">
              <Link
                to="/ForgetPassword"
                className="text-indigo-900 hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-indigo-900 hover:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-300"
            >
              {loading ? t("login.loading") : t("login.login")}
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