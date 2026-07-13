import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

function formatDateOnly(value) {
  if (!value) return '';
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

function unwrapArray(payload) {
  const data = payload?.data || payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.prescriptions)) return data.prescriptions;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.prescriptions)) return payload.prescriptions;
  return [];
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();
  const isEnglish = i18n.language.startsWith("en");

  const navItems = [
  { id: "profile", label: t("ProfileDetail.navProfile") },
  { id: "history", label: t("ProfileDetail.navHistory") },
  { id: "prescriptions", label: t("ProfileDetail.navPrescriptions") },
  { id: "followup", label: t("ProfileDetail.navFollowup") },
];

  // Profile state
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', date_of_birth: '', gender: '' });
  const [saveState, setSaveState] = useState('idle');
  const [formError, setFormError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoState, setPhotoState] = useState('idle');
  const [photoError, setPhotoError] = useState(null);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [localBookings, setLocalBookings] = useState([]);
  const [accessRespondLoading, setAccessRespondLoading] = useState(null);

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Navigation
  const [activeSection, setActiveSection] = useState('profile');

  // ─── Fetch Profile ───
  useEffect(() => {
    if (!isAuthenticated) { setProfileLoading(false); return; }
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get('/api/user/me');
        const data = res.data?.data || res.data?.user || res.data;
        setProfileData(data);
        const profile = data?.profile || data;
        setForm({
          full_name: profile?.full_name || data?.name || '',
          email: data?.email || profile?.email || '',
          phone: profile?.phone || '',
          date_of_birth: formatDateOnly(profile?.date_of_birth || ''),
          gender: profile?.gender || '',
        });
        setPhotoPreview(data?.photo || '');
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [isAuthenticated]);

  // ─── Fetch Bookings ───
  useEffect(() => {
    if (!isAuthenticated) { setBookingsLoading(false); return; }
    async function fetchBookings() {
      try {
        const res = await axiosInstance.get('/api/book/my-bookings');
        const list = unwrapArray(res.data);
        setBookings(list);
        setLocalBookings(list);
      } catch (err) {
        console.error('Bookings fetch error:', err);
      } finally {
        setBookingsLoading(false);
      }
    }
    fetchBookings();
  }, [isAuthenticated]);

  // ─── Fetch Prescriptions ───
  useEffect(() => {
    if (!isAuthenticated) { setPrescriptionsLoading(false); return; }
    async function fetchPrescriptions() {
      try {
        const res = await axiosInstance.get('/api/prescriptions/my-prescriptions');
        const list = unwrapArray(res.data);
        setPrescriptions(list);
      } catch (err) {
        console.error('Prescriptions fetch error:', err);
      } finally {
        setPrescriptionsLoading(false);
      }
    }
    fetchPrescriptions();
  }, [isAuthenticated]);

  // ─── Counts ───
  const bookingCount = bookings.length;
  const prescriptionCount = prescriptions.length;

  // ─── Profile Save ───
  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormError(null);
    setSaveState('idle');
  };

  const handleSave = async () => {
    setSaveState('saving');
    setFormError(null);
    try {
      await axiosInstance.patch('/api/user/me', {
        full_name: form.full_name || null,
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
      });
      setSaveState('success');
    } catch (err) {
      setSaveState('error');
      setFormError(
  err.response?.data?.error ||
  err.response?.data?.message ||
  t("ProfileDetail.changePasswordFail")
);
    }
  };

  // ─── Photo Upload ───
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoState('idle');
    setPhotoError(null);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setPhotoState('uploading');
    setPhotoError(null);
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      await axiosInstance.patch('/api/user/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotoState('success');
      setPhotoFile(null);
    } catch (err) {
      setPhotoState('error');
      setPhotoError(
  err.response?.data?.error ||
  err.response?.data?.message ||
  t("ProfileDetail.changePasswordFail")
);
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // ─── Prescription Access ───
  const handleRespondAccess = async (bookingId, action) => {
    setAccessRespondLoading(bookingId);
    try {
      await axiosInstance.patch(`/api/prescriptions/bookings/${bookingId}/access`, { action });
      setLocalBookings(prev =>
        prev.map(b =>
          (b.booking_id === bookingId || b.id === bookingId || b._id === bookingId)
            ? { ...b, prescription_access_status: action === 'accept' ? 'accepted' : 'rejected' }
            : b
        )
      );
    } catch (err) {
      alert(
  err.response?.data?.error ||
  t("ProfileDetail.generalError")
);
    } finally {
      setAccessRespondLoading(null);
    }
  };

  // ─── Change Password ───
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({
  type: "error",
  text: t("ProfileDetail.alertFillFields"),
});
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({
  type: "error",
  text: t("ProfileDetail.alertMinLength"),
});
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({
  type: "error",
  text: t("ProfileDetail.alertMatchError"),
});
      return;
    }

    try {
      setPasswordUpdating(true);
      await axiosInstance.patch('/api/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordMsg({
  type: "success",
  text: t("ProfileDetail.successMsg"),
});
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error',  text:
  err.response?.data?.error ||
  err.response?.data?.message ||
  t("ProfileDetail.changePasswordFail") });
    } finally {
      setPasswordUpdating(false);
    }
  };

  // ─── Loading / Auth guards ───
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-md border border-slate-200">
         {t("ProfileDetail.checkingAccount")}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28 px-4" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">{t("ProfileDetail.needLoginTitle")}</h1>
          <p className="text-slate-600">{t("ProfileDetail.needLoginDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 w-full min-w-0 overflow-x-hidden" dir={isEnglish ? 'ltr' : 'rtl'}>
      <div className="space-y-6">

        {/* ── Hero / Summary Bar ── */}
        <div className="rounded-4xl border border-slate-200 bg-[#f8fafc] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">{t("ProfileDetail.welcome")}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {form.full_name || user?.name || t("ProfileDetail.defaultUser")}
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl">{t("ProfileDetail.summaryDesc")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.visits")}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{bookingCount}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.prescriptions")}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{prescriptionCount}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.lastUpdate")}</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">
                  {profileData?.updated_at
                    ? new Date(profileData.updated_at).toLocaleDateString(isEnglish ? 'en-US' : 'ar-EG')
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar + Content ── */}
        <div className="grid gap-6 xl:grid-cols-[280px_1fr] w-full min-w-0">

          {/* Sidebar */}
          <aside className="space-y-5 w-full min-w-0">
            {/* Patient Info Card */}
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm w-full overflow-hidden">
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img src={photoPreview} alt={form.full_name || t("ProfileDetail.patient")} className="h-16 w-16 rounded-3xl object-cover border border-slate-200" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#001A6E] text-white text-2xl font-semibold">
                    {form.full_name ? form.full_name.charAt(0) : (isEnglish ? 'P' : 'م')}
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">{t("ProfileDetail.patientName")}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{form.full_name || t("ProfileDetail.notAvailable")}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.email")}</p>
                  <p className="mt-2 text-sm text-slate-900 break-all">{form.email || t("ProfileDetail.notAvailable")}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.phone")}</p>
                  <p className="mt-2 text-sm text-slate-900">{form.phone ||t("ProfileDetail.notAvailable")}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.dob")}</p>
                  <p className="mt-2 text-sm text-slate-900">{formatDateOnly(form.date_of_birth) || t("ProfileDetail.notAvailable")}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">{t("ProfileDetail.gender")}</p>
                  <p className="mt-2 text-sm text-slate-900">
                  {form.gender === "male"
  ? t("ProfileDetail.genderMale")
  : form.gender === "female"
  ? t("ProfileDetail.genderFemale")
  : t("ProfileDetail.genderUnspecified")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm w-full overflow-hidden">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("ProfileDetail.quickMenu")}</h3>
              <nav className="flex flex-row overflow-x-auto gap-2 xl:flex-col pb-2 xl:pb-0">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`whitespace-nowrap rounded-2xl px-4 py-3 text-start transition ${
                      activeSection === item.id
                        ? 'bg-[#001A6E] text-white'
                        : 'text-slate-700 hover:bg-slate-100 bg-slate-50 xl:bg-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              {t("ProfileDetail.logout")}
            </button>
          </aside>

          {/* ── Main Content ── */}
          <main className="space-y-6 w-full min-w-0">

            {/* ── Profile Edit Section ── */}
            <section id="profile" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm w-full overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t("ProfileDetail.updateProfile")}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("ProfileDetail.profileSubtitle")}</h2>
                </div>
                <div className="inline-flex gap-3">
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{bookingCount} {t("ProfileDetail.visits")}</div>
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{prescriptionCount} {t("ProfileDetail.prescriptions")}</div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.profilePhoto")}</label>
                  <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {photoPreview ? (
                        <img src={photoPreview} alt={form.full_name || t("ProfileDetail.patient")} className="h-16 w-16 rounded-2xl object-cover border border-slate-200" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">{t("ProfileDetail.noPhoto")}</div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{t("ProfileDetail.chooseNewPhoto")}</p>
                        <p className="text-xs text-slate-500">{t("ProfileDetail.photoRequirements")}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <label className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                        {t("ProfileDetail.changePhoto")}
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={handlePhotoUpload}
                        disabled={!photoFile || photoState === 'uploading'}
                        className="inline-flex items-center justify-center rounded-3xl bg-[#001A6E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00307e] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {photoState === 'uploading' ? t("ProfileDetail.savingPhoto") : t("ProfileDetail.savePhoto")}
                      </button>
                    </div>
                  </div>
                  {photoError && <p className="mt-3 text-sm text-red-700">{photoError}</p>}
                  {photoState === 'success' && <p className="mt-3 text-sm text-emerald-700">{t("ProfileDetail.photoSuccess")}</p>}
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.fullNameLabel")}</label>
                  <input value={form.full_name} onChange={e => handleFieldChange('full_name', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.phone")}</label>
                  <input value={form.phone} onChange={e => handleFieldChange('phone', e.target.value)} placeholder={t("ProfileDetail.phonePlaceholder")}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.dob")}</label>
                  <input type="date" value={form.date_of_birth} onChange={e => handleFieldChange('date_of_birth', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.gender")}</label>
                  <select value={form.gender} onChange={e => handleFieldChange('gender', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10">
                    <option value="">{t("ProfileDetail.genderUnspecified")}</option>
            <option value="male">{t("ProfileDetail.genderMale")}</option>
            <option value="female">{t("ProfileDetail.genderFemale")}</option>
                  </select>
                </div>
              </div>

              {formError && <p className="mt-4 text-sm text-red-700">{formError}</p>}
              {saveState === 'success' && <p className="mt-4 text-sm text-emerald-700">{t("ProfileDetail.changesSuccess")}</p>}

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={handleSave} disabled={saveState === 'saving'}
                  className="inline-flex items-center justify-center rounded-3xl bg-[#001A6E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00307e] disabled:cursor-not-allowed disabled:opacity-60">
                  {saveState === "saving"
  ? t("ProfileDetail.savingChanges")
  : t("ProfileDetail.saveChanges")}
                </button>
                <button type="button"
                  onClick={() => {
                    const profile = profileData?.profile || profileData;
                    setForm({
                      full_name: profile?.full_name || profileData?.name || '',
                      email: profileData?.email || '',
                      phone: profile?.phone || '',
                      date_of_birth: formatDateOnly(profile?.date_of_birth || ''),
                      gender: profile?.gender || '',
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  {t("ProfileDetail.reset")}
                </button>
              </div>
            </section>

            {/* ── Change Password Section ── */}
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500">{t("ProfileDetail.changePasswordTitle")}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("ProfileDetail.changePasswordSubtitle")}</h2>
              </div>

              <form onSubmit={handleChangePassword} className="mt-6 space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.currentPasswordLabel")}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                     placeholder={t("ProfileDetail.currentPasswordLabel")}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className={`absolute ${isEnglish ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001A6E] cursor-pointer`}>
                      {showCurrentPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.newPasswordLabel")}</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder={t("ProfileDetail.newPasswordLabel")}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute ${isEnglish ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001A6E] cursor-pointer`}>
                      {showNewPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t("ProfileDetail.confirmPasswordLabel")}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                     placeholder={t("ProfileDetail.confirmPasswordLabel")}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute ${isEnglish ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001A6E] cursor-pointer`}>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {passwordMsg && (
                  <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {passwordMsg.text}
                  </p>
                )}

                <div className="pt-2 flex justify-start">
                  <button type="submit" disabled={passwordUpdating}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#001A6E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00307e] disabled:cursor-not-allowed disabled:opacity-60">
                    {passwordUpdating ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        {t("ProfileDetail.updatePasswordBtn")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* ── Visit History Section ── */}
            <section id="history" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t("ProfileDetail.historyTitle")}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("ProfileDetail.historySubtitle")}</h2>
                </div>
                <p className="text-sm text-slate-500">
                  {t("ProfileDetail.historyCount").replace('{count}', bookingCount.toString())}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {bookingsLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">{t("ProfileDetail.loadingHistory")}</div>
                ) : localBookings.length ? (
                  localBookings.map((booking, index) => {
                    const bookingId = booking.booking_id || booking.id || booking._id;
                   const doctorName =
  booking.doctor_name ||
  booking.staff_name ||
  (booking.doctor_id
    ? `${t("ProfileDetail.doctor")} #${booking.doctor_id}`
    : "—");
                    const bookingDate = formatDateOnly(booking.booking_date);
                    const accessStatus = booking.prescription_access_status;
                    const isPending = accessStatus === 'pending';

                    return (
                      <div key={`${bookingId || 'booking'}-${bookingDate}-${index}`}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm text-slate-500">{t("ProfileDetail.doctor")}</p>
                              <p className="mt-1 text-base font-semibold text-slate-900">{doctorName}</p>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            <p className="text-base font-semibold text-slate-900">{bookingDate || '—'}</p>
                            <p className="mt-1 text-sm text-slate-600">{t("ProfileDetail.time")}: {booking.booking_from || '—'}</p>
                          </div>
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                            {t(`ProfileDetail.bookingStatus.${booking.status}`)}
                          </span>
                        </div>

                        {/* Prescription Access Banners */}
                        {isPending && bookingId && (
                          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                            <div className="flex items-start gap-3 flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-2 text-amber-800">
                                <span>⏳</span>
                                <p className="text-sm font-medium">{t("ProfileDetail.pendingAccess")}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleRespondAccess(bookingId, 'accept')} disabled={accessRespondLoading === bookingId}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60">
                                  ✓ {t("ProfileDetail.accept")}
                                </button>
                                <button onClick={() => handleRespondAccess(bookingId, 'reject')} disabled={accessRespondLoading === bookingId}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-60">
                                  ✕ {t("ProfileDetail.reject")}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {accessStatus === 'accepted' && bookingId && (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-4 mt-2">
                            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                              <span>✓</span>
                              <span>{t("ProfileDetail.acceptedAccess")}</span>
                            </div>
                            <button onClick={() => handleRespondAccess(bookingId, 'reject')} disabled={accessRespondLoading === bookingId}
                              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-60">
                              {t("ProfileDetail.revokeAccess")}
                            </button>
                          </div>
                        )}

                        {accessStatus === 'rejected' && bookingId && (
                          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl p-4 mt-2">
                            <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                              <span>✕</span>
                              <span>{t("ProfileDetail.rejectedAccess")}</span>
                            </div>
                            <button onClick={() => handleRespondAccess(bookingId, 'accept')} disabled={accessRespondLoading === bookingId}
                              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60">
                              {t("ProfileDetail.allowAccess")}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">{t("ProfileDetail.noHistory")}</div>
                )}
              </div>
            </section>

            {/* ── Prescriptions Section ── */}
            <section id="prescriptions" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t("ProfileDetail.prescriptionsTitle")}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("ProfileDetail.prescriptionsSubtitle")}</h2>
                </div>
                <p className="text-sm text-slate-500">
                  {t("ProfileDetail.prescriptionsCount").replace('{count}', prescriptionCount.toString())}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {prescriptionsLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">{t("ProfileDetail.loadingPrescriptions")}</div>
                ) : prescriptions.length ? (
                  prescriptions.map((prescription, index) => (
                    <div key={`${prescription.prescription_id || prescription.id || 'rx'}-${index}`}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-3 cursor-pointer hover:border-[#001A6E]/30 transition"
                      onClick={() => setSelectedPrescription(prescription)}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{prescription.created_at?.split('T')[0] || t("ProfileDetail.noDate")}</span>
                        <span className="font-bold text-slate-900">
                          {t("ProfileDetail.prescriptionNumber").replace('{id}', (prescription.prescription_id || prescription.id || 0).toString())}
                        </span>
                      </div>
                      {prescription.provider_name && (
                        <p className="text-sm text-slate-600">{t("ProfileDetail.doctor")}: <span className="font-medium text-slate-900">{prescription.provider_name}</span></p>
                      )}
                      {prescription.diagnosis && (
                        <div className="rounded-2xl bg-blue-50 px-4 py-2.5">
                          <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 mb-1">🩺 {t("ProfileDetail.diagnosis")}</p>
                          <p className="text-sm text-blue-900">{prescription.diagnosis}</p>
                        </div>
                      )}
                      {prescription.medication_name && (
                        <div className="rounded-2xl bg-green-50 px-4 py-2.5">
                          <p className="text-xs font-semibold text-green-700 flex items-center gap-1 mb-1">💊 {t("ProfileDetail.medication")}</p>
                          <p className="text-sm text-green-900">
                            {prescription.medication_name}
                            {prescription.dose && <span className="text-green-600"> — {prescription.dose}</span>}
                            {prescription.duration && <span className="text-green-600"> — {t("ProfileDetail.forDuration").replace('{duration}', prescription.duration)}</span>}
                          </p>
                        </div>
                      )}
                      {prescription.test_name && (
                        <div className="rounded-2xl bg-purple-50 px-4 py-2.5">
                          <p className="text-xs font-semibold text-purple-700 flex items-center gap-1 mb-1">🧪 {t("ProfileDetail.tests")}</p>
                          <p className="text-sm text-purple-900">
                            {prescription.test_name}
                            {prescription.test_result && <span className="text-purple-600"> — {prescription.test_result}</span>}
                          </p>
                        </div>
                      )}
                      {prescription.notes && (
                        <div className="rounded-2xl bg-amber-50 px-4 py-2.5">
                          <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-1">📝 {t("ProfileDetail.notes")}</p>
                          <p className="text-sm text-amber-900">{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">{t("ProfileDetail.noPrescriptions")}</div>
                )}
              </div>
            </section>

            {/* ── Follow-up Section ── */}
            <section id="followup" className="rounded-4xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t("ProfileDetail.followupTitle")}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("ProfileDetail.followupSubtitle")}</h2>
                </div>
                <p className="text-sm text-slate-500">{t("ProfileDetail.followupDesc")}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{t("ProfileDetail.recommendationsTitle")}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{t("ProfileDetail.recommendationsText")}</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{t("ProfileDetail.tipsTitle")}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{t("ProfileDetail.tipsText")}</p>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>

    {/* ── Prescription Detail Modal ── */}
    {selectedPrescription && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedPrescription(null)}>
        <div className="bg-white rounded-4xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4"
          dir={isEnglish ? 'ltr' : 'rtl'}
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedPrescription(null)} className="p-2 rounded-2xl hover:bg-slate-100 transition">✕</button>
            <div className={isEnglish ? 'text-left' : 'text-right'}>
              <p className="text-sm text-slate-500">{t("ProfileDetail.prescriptionDetails")}</p>
              <h3 className="font-bold text-xl text-slate-900">
                {t("ProfileDetail.prescriptionNumber").replace('{id}', (selectedPrescription.prescription_id || selectedPrescription.id || 0).toString())}
              </h3>
            </div>
          </div>

          <div className="border-t border-slate-200" />

          <div className="space-y-3">
            {selectedPrescription.provider_name && (
              <div>
                <p className="text-xs text-slate-500">{t("ProfileDetail.doctor")}</p>
                <p className="font-semibold text-slate-900">{selectedPrescription.provider_name}</p>
                {selectedPrescription.provider_specialty && <p className="text-sm text-slate-500">{selectedPrescription.provider_specialty}</p>}
              </div>
            )}
            <p className="text-xs text-slate-400">{selectedPrescription.created_at?.split('T')[0]}</p>

            {selectedPrescription.symptoms && (
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-600 mb-1">{t("ProfileDetail.symptoms")}</p>
                <p className="text-sm text-slate-900">{selectedPrescription.symptoms}</p>
              </div>
            )}
            {selectedPrescription.diagnosis && (
              <div className="rounded-3xl bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-600 mb-1">{t("ProfileDetail.diagnosis")}</p>
                <p className="text-sm text-blue-900">{selectedPrescription.diagnosis}</p>
              </div>
            )}
            {selectedPrescription.medication_name && (
              <div className="rounded-3xl bg-green-50 p-4">
                <p className="text-xs font-semibold text-green-700 mb-1">{t("ProfileDetail.medication")}</p>
                <p className="text-sm text-green-900">
                  {selectedPrescription.medication_name}
                  {selectedPrescription.dose && <span className="text-green-600"> — {selectedPrescription.dose}</span>}
                  {selectedPrescription.duration && <span className="text-green-600"> — {t("ProfileDetail.forDuration").replace('{duration}', selectedPrescription.duration)}</span>}
                </p>
              </div>
            )}
            {selectedPrescription.test_name && (
              <div className="rounded-3xl bg-purple-50 p-4">
                <p className="text-xs font-semibold text-purple-700 mb-1">{t("ProfileDetail.tests")}</p>
                <p className="text-sm text-purple-900">
                  {selectedPrescription.test_name}
                  {selectedPrescription.test_result && <span className="text-purple-600"> — {selectedPrescription.test_result}</span>}
                </p>
              </div>
            )}
            {selectedPrescription.notes && (
              <div className="rounded-3xl bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">{t("ProfileDetail.notes")}</p>
                <p className="text-sm text-amber-900">{selectedPrescription.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
