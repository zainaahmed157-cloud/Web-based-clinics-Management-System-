import { useState } from 'react';
import {
  BadgeCheck, Mail, MapPin, Pencil, Phone, Star, User,
  Clock, Stethoscope, Calendar, DollarSign, FileText,
  Lock, Eye, EyeOff, Camera, Save, Loader, X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../api/axiosInstance';

const WORK_DAYS = [
  { value: 'sun', labelEn: 'Sunday', labelAr: 'الأحد' },
  { value: 'mon', labelEn: 'Monday', labelAr: 'الاثنين' },
  { value: 'tue', labelEn: 'Tuesday', labelAr: 'الثلاثاء' },
  { value: 'wed', labelEn: 'Wednesday', labelAr: 'الأربعاء' },
  { value: 'thu', labelEn: 'Thursday', labelAr: 'الخميس' },
  { value: 'fri', labelEn: 'Friday', labelAr: 'الجمعة' },
  { value: 'sat', labelEn: 'Saturday', labelAr: 'السبت' },
];

const SPECIALTIES = [
  { value: 'مخ واعصاب', labelEn: 'Neurology', labelAr: 'مخ واعصاب' },
  { value: 'عظام', labelEn: 'Orthopedics', labelAr: 'عظام' },
  { value: 'الأورام', labelEn: 'Oncology', labelAr: 'الأورام' },
  { value: 'طب الأذن والأنف والحنجرة', labelEn: 'ENT', labelAr: 'طب الأذن والأنف والحنجرة' },
  { value: 'طب العيون', labelEn: 'Ophthalmology', labelAr: 'طب العيون' },
  { value: 'قلب و اوعية دموية', labelEn: 'Cardiology', labelAr: 'قلب و اوعية دموية' },
  { value: 'صدر و جهاز تنفسي', labelEn: 'Pulmonology', labelAr: 'صدر و جهاز تنفسي' },
  { value: 'كلى', labelEn: 'Nephrology', labelAr: 'كلى' },
  { value: 'اسنان', labelEn: 'Dentistry', labelAr: 'اسنان' },
  { value: 'اطفال و حديثي الولادة', labelEn: 'Pediatrics', labelAr: 'اطفال و حديثي الولادة' },
  { value: 'جلدية', labelEn: 'Dermatology', labelAr: 'جلدية' },
  { value: 'نسا و توليد', labelEn: 'Gynecology', labelAr: 'نسا و توليد' },
];

function valueOrDash(v) {
  return v === undefined || v === null || v === '' ? '—' : String(v);
}

function formatWorkDays(workDays, isRtl) {
  if (!workDays) return '—';
  return workDays.split(',').map((d) => {
    const found = WORK_DAYS.find((w) => w.value === d.trim());
    return found ? (isRtl ? found.labelAr : found.labelEn) : d.trim();
  }).join(' · ');
}

function formatTimeToAmPm(value, isRtl) {
  if (!value) return '—';
  const [hourText, minuteText] = value.split(':');
  const hour = Number(hourText);
  if (!isFinite(hour) || !minuteText) return value;
  const period = hour >= 12 ? (isRtl ? 'م' : 'PM') : (isRtl ? 'ص' : 'AM');
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minuteText.padStart(2, '0')} ${period}`;
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  const colors = {
    gold:  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
    green: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)' },
    blue:  { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)' },
  };
  return (
    <div className="rounded-2xl p-5 flex flex-col items-center gap-2 transition hover:-translate-y-1 hover:shadow-xl"
      style={{ background: colors[accent].bg, border: `1px solid ${colors[accent].border}` }}>
      <div className="opacity-90">{icon}</div>
      <div className="text-2xl font-bold font-['Tajawal',sans-serif]" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-xs text-center font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

// ── Info Row ───────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, isRtl }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl border border-transparent hover:bg-[#f8fafc] hover:border-[#e8edf3] transition mb-1.5 last:mb-0">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1" style={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
        <div className="text-sm font-semibold truncate font-['Tajawal',sans-serif]" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(13,148,136,0.09)', border: '1px solid rgba(13,148,136,0.2)', color: '#0d9488' }}>
        {icon}
      </div>
    </div>
  );
}

// ── Edit Profile Modal ─────────────────────────────────────────────────────
function EditProfileModal({ initialData, onClose, onSuccess }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialData.photo || '');
  const [licenceFile, setLicenceFile] = useState(null);
  const [licenceFileName, setLicenceFileName] = useState('');
  const [form, setForm] = useState({ ...initialData });

  const selectedDays = form.work_days ? form.work_days.split(',').map((d) => d.trim()).filter(Boolean) : [];

  const toggleDay = (day) => {
    const next = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day];
    setForm((p) => ({ ...p, work_days: next.join(',') }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError(null); setSuccess(false);
    try {
      const body = new FormData();
      const fields = ['full_name','phone','gender','bio','work_from','work_to','work_days','location','consultation_price','years_of_experience'];
      fields.forEach((k) => body.append(k, form[k] ?? ''));
      if (photoFile) body.append('photo', photoFile);
      if (licenceFile) body.append('licence', licenceFile);

      const { data } = await axiosInstance.patch('/api/user/me', body);
      setSuccess(true);
      const updatedProfile = data?.data?.profile || data?.profile || form;
      onSuccess?.({ ...updatedProfile, photo: photoPreview });
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-0 sm:p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-h-[100dvh] w-full max-w-4xl overflow-y-auto border shadow-lg sm:max-h-[92vh] sm:rounded-2xl"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b p-4 sm:p-6 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <button type="button" onClick={onClose} className="transition hover:opacity-70 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
            {isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:space-y-6 sm:p-6">
          {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">{isRtl ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully'}</div>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{error}</div>}

          {/* Photo + basic fields */}
          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <div className="flex flex-col items-center gap-3 rounded-lg border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--semi-card-bg)' }}>
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera style={{ color: 'var(--text-secondary)' }} size={32} />
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                <Camera size={16} />
                {isRtl ? 'الصورة' : 'Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: 'full_name', label: isRtl ? 'الاسم الكامل' : 'Full Name', type: 'text', required: true },
                { key: 'phone', label: isRtl ? 'الهاتف' : 'Phone', type: 'tel' },
                { key: 'years_of_experience', label: isRtl ? 'سنوات الخبرة' : 'Years of Experience', type: 'number' },
                { key: 'consultation_price', label: isRtl ? 'سعر الاستشارة' : 'Consultation Price', type: 'number', required: true },
              ].map(({ key, label, type, required }) => (
                <label key={key} className="block text-start">
                  <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
                  <input type={type} value={form[key] || ''} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    required={required} min={type === 'number' ? 0 : undefined}
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
                </label>
              ))}

              <label className="block text-start">
                <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الجنس' : 'Gender'}</span>
                <select value={form.gender || ''} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                  <option value="">{isRtl ? 'غير محدد' : 'Not specified'}</option>
                  <option value="male">{isRtl ? 'ذكر' : 'Male'}</option>
                  <option value="female">{isRtl ? 'أنثى' : 'Female'}</option>
                </select>
              </label>

              <label className="block text-start">
                <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'التخصص' : 'Specialty'}</span>
                <select value={form.specialist || ''} disabled
                  className="w-full rounded-lg border px-4 py-2 cursor-not-allowed opacity-60"
                  style={{ borderColor: 'var(--card-border)', background: 'var(--semi-card-bg)', color: 'var(--text-primary)' }}>
                  <option value="">{isRtl ? 'اختر التخصص' : 'Choose specialty'}</option>
                  {SPECIALTIES.map((s) => <option key={s.value} value={s.value}>{isRtl ? s.labelAr : s.labelEn}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Bio */}
          <label className="block text-start">
            <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'نبذة' : 'Bio'}</span>
            <textarea value={form.bio || ''} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4}
              className="min-h-28 w-full resize-y rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
          </label>

          {/* Work days */}
          <div className="text-start">
            <label className="mb-3 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'أيام العمل' : 'Work Days'}</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {WORK_DAYS.map((day) => (
                <button key={day.value} type="button" onClick={() => toggleDay(day.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer ${selectedDays.includes(day.value) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                  style={!selectedDays.includes(day.value) ? { background: 'var(--semi-card-bg)', color: 'var(--text-primary)' } : {}}>
                  {isRtl ? day.labelAr : day.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Work hours */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'work_from', label: isRtl ? 'من' : 'Work From' },
              { key: 'work_to', label: isRtl ? 'إلى' : 'Work To' },
            ].map(({ key, label }) => (
              <label key={key} className="block text-start">
                <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
                <input type="time" value={form[key] || ''} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  required className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
              </label>
            ))}
          </div>

          {/* Location */}
          <label className="block text-start">
            <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الموقع' : 'Location'}</span>
            <input type="text" value={form.location || ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder={isRtl ? 'أدخل العنوان...' : 'Enter your address...'}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
          </label>

          {/* Licence upload */}
          <div className="rounded-xl border p-4 text-start" style={{ borderColor: 'var(--card-border)', background: 'var(--semi-card-bg)' }}>
            <span className="mb-1 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'ترخيص مزاولة المهنة' : 'Professional Licence'}</span>
            <p className="mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'يمكنك رفع صورة أو ملف PDF' : 'Upload an image or PDF file'}</p>
            <label className="inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm transition hover:border-blue-400 hover:bg-blue-50"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
              <FileText size={18} className="text-blue-500 shrink-0" />
              <span className="max-w-[65vw] truncate sm:max-w-xs">{licenceFileName || (isRtl ? 'اختر ملفاً' : 'Choose file')}</span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLicenceFile(f); setLicenceFileName(f.name); } }} className="hidden" />
            </label>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:gap-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 rounded-lg border px-4 py-3 font-semibold transition hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50 cursor-pointer">
              {loading ? <><Loader size={20} className="animate-spin" />{isRtl ? 'جارٍ الحفظ...' : 'Saving...'}</> : <><Save size={20} />{isRtl ? 'حفظ التغييرات' : 'Save Changes'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Settings Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, login } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileOverride, setProfileOverride] = useState(null);

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwUpdating, setPwUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const profileData = {
    ...((user?.profile) || {}),
    photo: user?.photo || user?.profile?.photo || null,
    ...(profileOverride || {}),
  };

  const fullName = profileData.full_name || user?.full_name || '';
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('');
  const avatarSrc = profileData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Dr')}&background=0d9488&color=fff`;

  const handleEditSuccess = (updated) => {
    setProfileOverride((prev) => ({ ...(prev || profileData), ...updated }));
    if (login && user) login({ ...user, profile: { ...user.profile, ...updated }, photo: updated.photo || user.photo });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess(false);
    if (!currentPw || !newPw || !confirmPw) { setPwError(isRtl ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'); return; }
    if (newPw.length < 8) { setPwError(isRtl ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError(isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); return; }
    try {
      setPwUpdating(true);
      await axiosInstance.patch('/api/user/change-password', { current_password: currentPw, new_password: newPw, confirm_password: confirmPw });
      setPwSuccess(true); setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwError(err.response?.data?.message || err.message);
    } finally {
      setPwUpdating(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap');
        .ds-avatar-ring { position:relative; flex-shrink:0; }
        .ds-avatar-ring::before { content:''; position:absolute; inset:-3px; border-radius:50%; background:conic-gradient(from 0deg,#0d9488,#67e8f9,#0d9488); animation:ds-spin 6s linear infinite; z-index:0; }
        .ds-avatar-ring::after  { content:''; position:absolute; inset:-1px; border-radius:50%; background:#fff; z-index:1; }
        .ds-avatar { position:relative; z-index:2; width:120px; height:120px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#e0f2f1,#ccfbf1); font-size:36px; font-weight:700; color:#0d9488; letter-spacing:2px; font-family:'Tajawal',sans-serif; }
        .ds-avatar img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
        @keyframes ds-spin { to { transform:rotate(360deg); } }
        @keyframes ds-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .ds-fade-up { animation:ds-fade-up 0.5s ease forwards; }
        .ds-fade-up-1 { animation-delay:0.05s; opacity:0; }
        .ds-fade-up-2 { animation-delay:0.15s; opacity:0; }
        .ds-fade-up-3 { animation-delay:0.25s; opacity:0; }
        .ds-edit-btn { display:flex; align-items:center; gap:8px; padding:10px 20px; border-radius:10px; border:1px solid #e8edf3; background:#fff; color:#475569; font-size:14px; font-family:'Cairo',sans-serif; cursor:pointer; transition:all 0.2s ease; white-space:nowrap; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
        .ds-edit-btn:hover { background:rgba(13,148,136,0.09); border-color:rgba(13,148,136,0.2); color:#0d9488; transform:translateY(-1px); box-shadow:0 4px 16px rgba(13,148,136,0.14); }
        .ds-section-header { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .ds-section-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; background:rgba(13,148,136,0.09); border:1px solid rgba(13,148,136,0.2); flex-shrink:0; }
        .ds-section-title { font-size:18px; font-weight:700; color:var(--text-primary); font-family:'Tajawal',sans-serif; margin:0; }
        .ds-section-line { flex:1; height:1px; background:var(--card-border); }
        .ds-work-chip { display:flex; align-items:center; gap:7px; background:#f8fafc; border:1px solid var(--card-border); border-radius:8px; padding:8px 14px; font-size:14px; color:var(--text-secondary); }
        .ds-work-chip strong { color:var(--text-primary); font-weight:600; }
        .ds-bio { margin-top:16px; padding:16px; background:#f8fafc; border-radius:10px; border:1px solid var(--card-border); font-size:14px; line-height:1.9; color:var(--text-secondary); font-family:'Tajawal',sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', fontFamily: "'Cairo',sans-serif", background: 'var(--background)' }} dir={isRtl ? 'rtl' : 'ltr'}>
        {isEditOpen && (
          <EditProfileModal
            initialData={{
              photo: profileData.photo || null,
              full_name: profileData.full_name || '',
              phone: profileData.phone || '',
              gender: profileData.gender || '',
              years_of_experience: profileData.years_of_experience || '',
              bio: profileData.bio || '',
              consultation_price: profileData.consultation_price || '',
              work_from: profileData.work_from || '',
              work_to: profileData.work_to || '',
              work_days: profileData.work_days || '',
              location: profileData.location || '',
              specialist: profileData.specialist || '',
            }}
            onClose={() => setIsEditOpen(false)}
            onSuccess={handleEditSuccess}
          />
        )}

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* ── HERO CARD ── */}
          <div className="ds-fade-up ds-fade-up-1 rounded-2xl border p-6 sm:p-8 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
              <div className="flex items-center gap-5">
                <div className="ds-avatar-ring">
                  <div className="ds-avatar">
                    <img src={avatarSrc} alt={fullName} />
                  </div>
                  {profileData.is_verified && (
                    <div className="absolute bottom-1 left-1 z-[3] w-7 h-7 rounded-full bg-white flex items-center justify-center border-2" style={{ borderColor: '#0d9488' }}>
                      <BadgeCheck size={14} color="#0d9488" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-['Tajawal',sans-serif]" style={{ color: 'var(--text-primary)' }}>
                    {valueOrDash(profileData.full_name)}
                  </h2>
                  {profileData.specialist && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-sm px-3 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(13,148,136,0.09)', border: '1px solid rgba(13,148,136,0.2)', color: '#0d9488' }}>
                      <Stethoscope size={13} />
                      {profileData.specialist}
                    </div>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setIsEditOpen(true)} className="ds-edit-btn">
                <Pencil size={14} />
                {isRtl ? 'تعديل الملف' : 'Edit Profile'}
              </button>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--card-border)' }} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <StatCard
                accent="gold"
                icon={<Star size={22} fill="#f59e0b" color="#f59e0b" />}
                value={profileData.average_rating ? `${profileData.average_rating} / 5` : '—'}
                label={`${valueOrDash(profileData.total_ratings)} ${isRtl ? 'تقييم' : 'ratings'}`}
              />
              <StatCard
                accent="green"
                icon={<User size={22} color="#10b981" />}
                value={valueOrDash(profileData.years_of_experience)}
                label={isRtl ? 'سنوات الخبرة' : 'Years of Experience'}
              />
              <StatCard
                accent="blue"
                icon={<BadgeCheck size={22} color={profileData.is_verified ? '#3b82f6' : '#94a3b8'} />}
                value={profileData.is_verified ? (isRtl ? 'موثّق' : 'Verified') : (isRtl ? 'غير موثّق' : 'Not Verified')}
                label={isRtl ? 'حالة التوثيق' : 'Verification Status'}
              />
            </div>
          </div>

          {/* ── BOTTOM GRID ── */}
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,400px), 1fr))' }}>
            {/* Work hours card */}
            <div className="ds-fade-up ds-fade-up-2 rounded-2xl border p-6 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="ds-section-header">
                <div className="ds-section-icon"><Clock size={16} color="#0d9488" /></div>
                <h3 className="ds-section-title">{isRtl ? 'ساعات العمل والموقع' : 'Work Hours & Location'}</h3>
                <div className="ds-section-line" />
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="ds-work-chip">
                  <Calendar size={15} className="opacity-50" />
                  <strong>{formatWorkDays(profileData.work_days, isRtl)}</strong>
                </div>
                <div className="ds-work-chip">
                  <Clock size={15} className="opacity-50" />
                  <strong>{formatTimeToAmPm(profileData.work_from, isRtl)} – {formatTimeToAmPm(profileData.work_to, isRtl)}</strong>
                </div>
                {profileData.consultation_price && (
                  <div className="ds-work-chip">
                    <DollarSign size={15} className="opacity-50" />
                    {isRtl ? 'سعر الاستشارة: ' : 'Price: '}<strong>{profileData.consultation_price}</strong>
                  </div>
                )}
              </div>
              {profileData.bio && <div className="ds-bio">{profileData.bio}</div>}
            </div>

            {/* Personal info card */}
            <div className="ds-fade-up ds-fade-up-2 rounded-2xl border p-6 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="ds-section-header">
                <div className="ds-section-icon"><User size={16} color="#0d9488" /></div>
                <h3 className="ds-section-title">{isRtl ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
              </div>
              <InfoRow icon={<Mail size={16} />} label={isRtl ? 'البريد الإلكتروني' : 'Email'} value={valueOrDash(user?.email)} isRtl={isRtl} />
              <InfoRow icon={<Phone size={16} />} label={isRtl ? 'الهاتف' : 'Phone'} value={valueOrDash(profileData.phone)} isRtl={isRtl} />
              <InfoRow icon={<MapPin size={16} />} label={isRtl ? 'العنوان' : 'Address'} value={valueOrDash(profileData.location)} isRtl={isRtl} />
              <InfoRow icon={<User size={16} />} label={isRtl ? 'الجنس' : 'Gender'}
                value={profileData.gender === 'male' ? (isRtl ? 'ذكر' : 'Male') : profileData.gender === 'female' ? (isRtl ? 'أنثى' : 'Female') : '—'}
                isRtl={isRtl} />
              <InfoRow icon={<FileText size={16} />} label={isRtl ? 'ترخيص المهنة' : 'Professional Licence'}
                value={profileData.licence
                  ? <a href={profileData.licence} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline font-semibold hover:text-teal-800 transition-colors">{isRtl ? 'عرض الترخيص' : 'View Licence'}</a>
                  : '—'
                }
                isRtl={isRtl} />
            </div>
          </div>

          {/* ── CHANGE PASSWORD CARD ── */}
          <div className="ds-fade-up ds-fade-up-3 rounded-2xl border p-6 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="ds-section-header">
              <div className="ds-section-icon"><Lock size={16} color="#0d9488" /></div>
              <h3 className="ds-section-title">{isRtl ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
              <div className="ds-section-line" />
            </div>

            <form onSubmit={handleChangePassword} className="max-w-lg mx-auto space-y-4 pt-2">
              {pwSuccess && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">{isRtl ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!'}</div>}
              {pwError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">{pwError}</div>}

              {[
                { id: 'cur', value: currentPw, setValue: setCurrentPw, show: showCurrent, setShow: setShowCurrent, placeholder: isRtl ? 'كلمة المرور الحالية' : 'Current password' },
                { id: 'nw', value: newPw, setValue: setNewPw, show: showNew, setShow: setShowNew, placeholder: isRtl ? 'كلمة المرور الجديدة' : 'New password' },
                { id: 'cf', value: confirmPw, setValue: setConfirmPw, show: showConfirm, setShow: setShowConfirm, placeholder: isRtl ? 'تأكيد كلمة المرور' : 'Confirm password' },
              ].map(({ id, value, setValue, show, setShow, placeholder }) => (
                <div key={id} className="relative">
                  <input type={show ? 'text' : 'password'} value={value} onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0d9488] transition-all"
                    style={{ borderColor: 'rgba(13,148,136,0.2)', background: 'transparent', color: 'var(--text-primary)' }} />
                  <button type="button" onClick={() => setShow(!show)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d9488] cursor-pointer ${isRtl ? 'left-3' : 'right-3'}`}>
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ))}

              <div className="flex justify-center mt-4">
                <button type="submit" disabled={pwUpdating}
                  className="ds-edit-btn max-w-sm w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed justify-center">
                  {pwUpdating
                    ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : <><Lock size={16} />{isRtl ? 'تحديث كلمة المرور' : 'Update Password'}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
