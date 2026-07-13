import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
export default function ForgetPassword() {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("forgetPassword.invalidEmail"))
                .required(t("forgetPassword.emailRequired")),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            setSuccess("");
            try {
                const { data } = await axiosInstance.post(
                    "/api/auth/forgot-password",
                    values
                );
                console.log(data);
                setSuccess(data.message ?? t("forgetPassword.success"));
                navigate("/VerifyOtp", {
                    state: {
                        email: values.email,
                    },
                });

            } catch (err) {
                console.log(err.response);
                setError(
                    err.response?.data?.message ||
                    t("forgetPassword.failed")
                );
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div
            dir={isEnglish ? "ltr" : "rtl"}
            className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
        >
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="bg-[#EEF1FF] hidden md:flex justify-center items-center order-1 md:order-2">
                    <img src={register} alt="register" className="w-3/4" />
                </div>
                <div className="p-8 md:p-12 order-2 md:order-1">
                    <div className={`flex gap-2 mb-6 ${isEnglish ? "flex-row" : "flex-row-reverse"
                        }`}>
                        <img src={logo} className="w-8 h-8" alt="Logo" />
                        <h2 className="text-2xl font-bold text-indigo-900">Medaura</h2>
                    </div>
                    <div className={`bg-gray-100 rounded-full p-1 flex ${isEnglish ? "flex-row" : "flex-row-reverse"
                        }`}>
                        <Link to="/login" className={`flex-1 text-center py-2 rounded-full ${isEnglish ? "bg-indigo-900 text-white" : "text-gray-500"
                            }`}>{t("forgetPassword.login")}</Link>
                        <Link to="/CreateAccount" className={`flex-1 text-center py-2 rounded-full ${isEnglish ? "text-gray-500" : "bg-indigo-900 text-white"
                            }`}>{t("forgetPassword.signUp")}</Link>
                    </div>
                    <div className=" mb-8 mt-5 bg-[#ffffff] p-4 rounded-lg shadow-md border-[#f4f4f4] border">
                        <div className={`mb-8 mt-5 ${isEnglish ? "text-left" : "text-right"}`}>
                            <h2 className="text-2xl font-bold text-[#312c85] mb-1">{t("forgetPassword.title")}</h2>
                            <p className="text-gray-500">{t("forgetPassword.subtitle")}</p>
                        </div>
                        <form onSubmit={formik.handleSubmit}
                            className={isEnglish ? "text-left" : "text-right"}>
                            <label className="block mb-1">{t("forgetPassword.email")}</label>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full h-10 border rounded-lg outline-none px-4
                            focus:ring-2 focus:ring-indigo-200
                            ${isEnglish ? "text-left" : "text-right"}
                            `}
                                placeholder={t("forgetPassword.emailPlaceholder")}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <span className="text-red-500 text-xs block mb-4">{formik.errors.email}</span>
                            )}
                            {error && (
                                <div className="mb-3 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-3 text-green-600 text-sm">
                                    {success}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#312c85] text-white py-3 rounded-xl mt-4 hover:bg-[#28226f] disabled:bg-[#7d78b8] disabled:cursor-not-allowed transition"
                            >
                                {loading ? t("forgetPassword.loading") : t("forgetPassword.send")}
                            </button>
                            <div className="text-center mt-4">
                                <Link to="/login" className="text-[#312c85] hover:text-[#443c99c7] transition">
                                    {t("forgetPassword.backToLogin")}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}