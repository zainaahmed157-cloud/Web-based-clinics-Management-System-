import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUser, FaUserMd, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";

export default function CreateAccount() {
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      user_type: "patient",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      specialist: "",
      agree: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("register.nameRequired")),

      email: Yup.string()
        .email(t("register.invalidEmail"))
        .required(t("register.emailRequired")),

      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
          t("register.passwordStrong")
        )
        .required(t("register.passwordRequired")),

      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], t("register.passwordMatch"))
        .required(t("register.confirmPasswordRequired")),

      agree: Yup.boolean().oneOf([true], t("register.agreeRequired")),

      specialist: Yup.string().when("user_type", {
        is: "doctor",
        then: (schema) => schema.required(t("register.specializationRequired")),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      const payload = {
        email: values.email,
        password: values.password,
        user_type: values.user_type === "doctor" ? "doctor" : "patient",
        profile: {
          full_name: values.name,
          name: values.name,
          ...(values.user_type === "doctor" && { specialist: values.specialist }),
        },
      };

      try {
        const userData = await registerUser(payload);
        formik.resetForm();
        // Route by role returned from server
        if (userData?.user_type === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err.response?.data?.message || t("register.registerFailed"));
      } finally {
        setLoading(false);
      }
    },
  });

  const userTypes = [
    { label: t("register.patient"), val: "patient", icon: <FaUser /> },
    { label: t("register.doctor"), val: "doctor", icon: <FaUserMd /> },
  ];

  return (
    <div
      dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Illustration */}
        <div className="bg-[#EEF1FF] hidden md:flex justify-center items-center">
          <img src={register} alt="register" className="w-3/4" />
        </div>

        {/* Form */}
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
              className="px-6 py-2 text-gray-500 text-sm font-medium"
            >
              {t("register.login")}
            </Link>
            <Link
              to="/CreateAccount"
              className="px-6 py-2 rounded-full bg-indigo-900 text-white text-sm font-medium"
            >
              {t("register.signUp")}
            </Link>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {userTypes.map((item) => (
                <button
                  key={item.val}
                  type="button"
                  id={`role-${item.val}`}
                  onClick={() => {
                    setRole(item.val);
                    formik.setFieldValue("user_type", item.val);
                  }}
                  className={`border rounded-xl py-3 flex justify-center gap-2 items-center transition ${
                    role === item.val
                      ? "border-[#312c85] bg-indigo-50 text-[#312c85] font-semibold"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            {/* Full name */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {t("register.fullName")}
              </label>
              <input
                id="reg-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-10 border rounded-lg outline-none px-4 border-gray-300 focus:ring-2 focus:ring-indigo-200 transition"
                placeholder={t("register.fullName")}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-red-500 text-xs">{formik.errors.name}</span>
              )}
            </div>

            {/* Specialization — doctor only */}
            {role === "doctor" && (
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("register.specialization")}
                </label>
                <select
                  id="reg-specialist"
                  name="specialist"
                  value={formik.values.specialist}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full h-10 border rounded-lg outline-none px-4 border-gray-300 focus:ring-2 focus:ring-indigo-200 transition ${
                    isEnglish ? "" : "text-right"
                  }`}
                >
                  <option value="">{t("register.chooseSpecialization")}</option>
                  <option value="cardiology">{t("register.cardiology")}</option>
                  <option value="dermatology">{t("register.dermatology")}</option>
                  <option value="neurology">{t("register.neurology")}</option>
                  <option value="pediatrics">{t("register.pediatrics")}</option>
                  <option value="psychiatry">{t("register.psychiatry")}</option>
                  <option value="radiology">{t("register.radiology")}</option>
                  <option value="surgery">{t("register.surgery")}</option>
                </select>
                {formik.touched.specialist && formik.errors.specialist && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.specialist}
                  </span>
                )}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {t("register.email")}
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none px-4 border-gray-300 focus:ring-2 focus:ring-indigo-200 transition ${
                  isEnglish ? "" : "text-right"
                }`}
                placeholder={t("register.emailPlaceholder")}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 text-xs">{formik.errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {t("register.password")}
              </label>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-indigo-200 transition ${
                  isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
                placeholder={t("register.passwordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className={`absolute top-9 text-gray-500 ${
                  isEnglish ? "right-3" : "left-3"
                }`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 text-xs">{formik.errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {t("register.confirmPassword")}
              </label>
              <input
                id="reg-confirm-password"
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-10 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-indigo-200 transition ${
                  isEnglish ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
                placeholder={t("register.confirmPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className={`absolute top-9 text-gray-500 ${
                  isEnglish ? "right-3" : "left-3"
                }`}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.touched.confirm_password &&
                formik.errors.confirm_password && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.confirm_password}
                  </span>
                )}
            </div>

            {/* Agree */}
            <div className="flex items-center gap-2 mt-4">
              <input
                id="reg-agree"
                type="checkbox"
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
              />
              <span className="text-sm text-gray-600">{t("register.agree")}</span>
            </div>
            {formik.submitCount > 0 && formik.errors.agree && (
              <span className="text-red-500 text-xs block mt-1">
                {formik.errors.agree}
              </span>
            )}

            {/* Error banner */}
            {error && (
              <div className="mt-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#312c85] hover:bg-[#28226f] disabled:bg-[#6b68b4] disabled:cursor-not-allowed text-white py-3 rounded-xl transition font-semibold"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t("register.loading")}
                </>
              ) : (
                t("register.signUp")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}