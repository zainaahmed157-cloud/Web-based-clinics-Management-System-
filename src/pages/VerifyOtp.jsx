import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";
import { useTranslation } from "react-i18next";

export default function VerifyOtp() {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    useEffect(() => {
        if (!email) {
            navigate("/ForgetPassword");
        }
    }, [email, navigate]);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const inputs = useRef([]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
            setError(t("verifyOtp.invalidCode"));
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data } = await axiosInstance.post(
                "/api/auth/verify-reset-otp",
                {
                    email,
                    otp: code,
                }
            );

            setSuccess(data.message || t("verifyOtp.success"));

            setTimeout(() => {
                navigate("/ResetPassword", {
                    state: {
                        email,
                        otp: code,
                    },
                });
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message || t("verifyOtp.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        try {
            await axiosInstance.post(
                "/api/auth/verify-reset-otp",
                {
                    email,
                }
            );

            setTimer(30);
            setSuccess(t("verifyOtp.resent"));
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                t("verifyOtp.failed")
            );
        }
    };
    return (
        <div
            dir={isEnglish ? "ltr" : "rtl"}
            className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
        >
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12">
                    <div
                        className={`flex gap-2 mb-6 ${isEnglish ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        <img src={logo} className="w-8 h-8" alt="" />
                        <h2 className="text-2xl font-bold text-indigo-900">
                            Medaura
                        </h2>
                    </div>
                    <div
                        className={`bg-gray-100 rounded-full p-1 flex ${isEnglish ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        <Link to="/login" className="flex-1 text-center py-2 rounded-full bg-indigo-900 text-white">
                            {t("login.login")}
                        </Link>
                        <Link to="/CreateAccount" className="flex-1 text-center py-2 text-gray-500">
                            {t("login.signUp")}
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-xl border mt-6 p-6">
                        <h2 className="text-3xl font-bold text-[#312c85] mb-2">
                            {t("verifyOtp.title")}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {t("verifyOtp.subtitle")}
                        </p>
                        <form onSubmit={verifyOtp}>
                            <label className="block mb-2">
                                {t("verifyOtp.email")}
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full h-11 border rounded-lg px-4 bg-gray-100 mb-8"
                            />
                            <div className="flex justify-center gap-3 mb-8">
                                {otp.map((item, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={1}
                                        value={item}
                                        onChange={(e) =>
                                            handleChange(e.target.value, index)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        className="w-14 h-14 border-2 border-indigo-400 rounded-xl text-center text-2xl font-bold outline-none focus:border-indigo-700"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mb-4 text-sm">
                                <span>
                                    {t("verifyOtp.didntReceive")}
                                </span>
                                <span className="text-red-500">
                                    {timer > 0 ? `00:${timer.toString().padStart(2, "0")}` : ""}
                                </span>
                            </div>
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
                                    ? t("verifyOtp.loading")
                                    : t("verifyOtp.verify")}
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <button
                                onClick={resendCode}
                                disabled={timer > 0}
                                className="text-[#312c85] hover:underline disabled:text-gray-400"
                            >
                                {t("verifyOtp.resend")}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex bg-[#EEF1FF] justify-center items-center">
                    <img
                        src={register}
                        alt=""
                        className="w-3/4"
                    />
                </div>
            </div>
        </div>
    );
}