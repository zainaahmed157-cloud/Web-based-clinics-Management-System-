import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";

export default function ResetPassword() {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const otp = location.state?.otp || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const formik = useFormik({
        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, t("register.passwordMin"))
                .required(t("register.passwordRequired")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], t("register.passwordMatch"))
                .required(t("register.confirmPasswordRequired")),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            setSuccess("");
            try {
                const { data } = await axiosInstance.post(
                    `/api/auth/reset-password/${otp}`,
                    {
                        email,
                        otp,
                        password: values.password,
                        confirm_password: values.confirm_password,
                    }
                );
                setSuccess(data.message || t("resetPassword.success"));
                setTimeout(() => {
                    navigate("/Login");
                }, 1500);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    t("resetPassword.failed")
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
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

                <div className="hidden md:flex justify-center items-center bg-[#EEF1FF]">
                    <img
                        src={register}
                        alt="register"
                        className="w-3/4"
                    />
                </div>
                <div className="p-8 md:p-12">
                    <div
                        className={`flex gap-2 mb-6 ${isEnglish ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        <img src={logo} className="w-8 h-8" alt="Logo" />
                        <h2 className="text-2xl font-bold text-indigo-900">
                            Medaura
                        </h2>
                    </div>

                    <div
                        className={`bg-gray-100 rounded-full p-1 flex ${isEnglish ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        <Link
                            to="/Login"
                            className="flex-1 text-center py-2 rounded-full bg-indigo-900 text-white"
                        >
                            {t("login.login")}
                        </Link>

                        <Link
                            to="/CreateAccount"
                            className="flex-1 text-center py-2 text-gray-500"
                        >
                            {t("login.signUp")}
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border mt-6 p-6">

                        <div
                            className={`mb-6 ${isEnglish ? "text-left" : "text-right"
                                }`}
                        >
                            <h2 className="text-3xl font-bold text-[#312c85]">
                                {t("resetPassword.title")}
                            </h2>

                            <p className="text-gray-500 mt-2">
                                {t("resetPassword.subtitle")}
                            </p>
                        </div>

                        <form
                            onSubmit={formik.handleSubmit}
                            className={isEnglish ? "text-left" : "text-right"}
                        >

                            <label className="block mb-2">
                                {t("resetPassword.newPassword")}
                            </label>

                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t("resetPassword.newPassword")}
                                    className={`w-full h-11 border rounded-lg outline-none ${isEnglish
                                            ? "pr-10 pl-4"
                                            : "pl-10 pr-4 text-right"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={`absolute top-3 text-gray-500 ${isEnglish ? "right-3" : "left-3"
                                        }`}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <div className="text-red-500 text-xs mb-3">
                                        {formik.errors.password}
                                    </div>
                                )}
                            <label className="block mb-2">
                                {t("resetPassword.confirmPassword")}
                            </label>
                            <div className="relative mb-4">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm_password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t(
                                        "resetPassword.confirmPassword"
                                    )}
                                    className={`w-full h-11 border rounded-lg outline-none ${isEnglish
                                            ? "pr-10 pl-4"
                                            : "pl-10 pr-4 text-right"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(!showConfirm)
                                    }
                                    className={`absolute top-3 text-gray-500 ${isEnglish ? "right-3" : "left-3"
                                        }`}
                                >
                                    {showConfirm ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>
                            {formik.touched.confirm_password &&
                                formik.errors.confirm_password && (
                                    <div className="text-red-500 text-xs mb-3">
                                        {formik.errors.confirm_password}
                                    </div>
                                )}
                            {error && (
                                <div className="text-red-500 mb-3">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-600 mb-3">
                                    {success}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#312c85] hover:bg-[#28226f] text-white py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? t("resetPassword.loading")
                                    : t("resetPassword.reset")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}