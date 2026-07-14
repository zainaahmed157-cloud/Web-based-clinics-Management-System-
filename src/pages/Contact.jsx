import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div dir={isEnglish ? "ltr" : "rtl"} className="min-h-screen bg-slate-50/50 pt-32 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1d4ed8] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-100/60">
            {t('contactPage.getInTouch')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f1a4f] tracking-tight mb-4">
            {t('contactPage.title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('contactPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t('contactPage.callUs')}
                </h3>
                <p className="text-slate-500 mb-2 text-sm font-medium">
                  {t('contactPage.callUsDesc')}
                </p>
                <a href="tel:+201012345678" className="text-[#0f1a4f] font-bold text-lg hover:text-blue-600 transition-colors inline-block" dir="ltr">
                  +20 101 234 5678
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t('contactPage.emailUs')}
                </h3>
                <p className="text-slate-500 mb-2 text-sm font-medium">
                  {t('contactPage.emailUsDesc')}
                </p>
                <a href="mailto:support@medaura.com" className="text-[#0f1a4f] font-bold text-[15px] hover:text-emerald-600 transition-colors inline-block">
                  support@medaura.com
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t('contactPage.visitUs')}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {t('contactPage.visitUsDesc1')}
                  <br />
                  {t('contactPage.visitUsDesc2')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 h-full relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {t('contactPage.sendMessage')}
                </h2>
              </div>

              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50/50">
                    <Send className="w-10 h-10 ml-2" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                    {t('contactPage.messageSent')}
                  </h3>
                  <p className="text-slate-500 max-w-sm mb-8 font-medium leading-relaxed">
                    {t('contactPage.messageSentDesc')}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    {t('contactPage.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative group">
                      <label htmlFor="name" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
                        {t('contactPage.fullName')}
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-[15px] font-medium text-slate-800"
                        placeholder={t('contactPage.namePlaceholder')}
                      />
                    </div>
                    
                    <div className="space-y-2 relative group">
                      <label htmlFor="email" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
                        {t('contactPage.email')}
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-[15px] font-medium text-slate-800"
                        placeholder={t('contactPage.emailPlaceholder')}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <label htmlFor="subject" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
                      {t('contactPage.subject')}
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-[15px] font-medium text-slate-800"
                      placeholder={t('contactPage.subjectPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2 relative group">
                    <label htmlFor="message" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
                      {t('contactPage.message')}
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-[15px] font-medium text-slate-800 resize-none leading-relaxed"
                      placeholder={t('contactPage.messagePlaceholder')}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#0f1a4f] to-[#1e3a8a] hover:from-[#091136] hover:to-[#162f75] text-white font-bold py-4.5 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>{t('contactPage.sendBtn')}</span>
                        <Send className={`w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform ${isEnglish ? "" : "rotate-180 group-hover:-translate-x-0.5"}`} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Contact;