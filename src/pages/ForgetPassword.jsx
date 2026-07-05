import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../assets/Logo1.png";
import register from "../assets/register.webp";
import { useTranslation } from "react-i18next";
export default function ForgetPassword() {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");
    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("forgetPassword.invalidEmail"))
                .required(t("forgetPassword.emailRequired")),
        }),
        onSubmit: (values) => {
            console.log("Password reset for:", values.email);
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
                    <div className="flex  gap-2 mb-6" className={`flex  gap-2 mb-6 ${isEnglish ? "flex-row" : "flex-row-reverse"
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
                            <h2 className="text-2xl font-bold text-[#312c85]">{t("forgetPassword.title")}</h2>
                            <p className="text-gray-500">{t("forgetPassword.subtitle")}</p>
                        </div>

                        <form onSubmit={formik.handleSubmit}
                            className={isEnglish ? "text-left" : "text-right"}>
                            <label className="block mb-1">{t("forgetPassword.email")}</label>
                            <input
                                type="email"
                                name="email"
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

                            <button
                                type="submit"
                                className="w-full bg-[#312c85] text-white py-3 rounded-xl mt-4 hover:bg-[#28226f] transition"
                            >
                                {t("forgetPassword.send")}
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