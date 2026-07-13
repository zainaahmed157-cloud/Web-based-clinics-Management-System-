import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, X, Menu, Globe, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../api/axiosInstance';
export default function Navbar({ onToggleSidebar, dark, setDark }) {
  const { logout, user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const fullName =
  user?.profile?.full_name ||
  user?.full_name ||
  t("navbar.defaultDoctor");
  const specialist =
  user?.profile?.specialist ||
  user?.specialist ||
  t("navbar.defaultSpecialist");
  const avatarSrc = user?.photo || user?.profile?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1f2b6c&color=fff`;

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [query, setQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const toggleLocale = () => {
    const next = i18n.language === 'en' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    axiosInstance.get('/notifications/me')
      .then(({ data }) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((item) => {
            let timeStr = '';
            if (item.created_at) {
              const diffMs = Date.now() - new Date(item.created_at).getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              if (diffMins < 60) timeStr = `${Math.max(1, diffMins)}m`;
              else if (diffHours < 24) timeStr = `${diffHours}h`;
              else timeStr = `${diffDays}d`;
            }
            return {
              id: String(item.id),
              title: item.title || t("navbar.notification"),
              body: item.message || '',
              time: timeStr || t("navbar.now"),
              read: Boolean(item.read),
            };
          });
          setNotifications(mapped);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(
      unread.map((n) => axiosInstance.patch(`/notifications/${n.id}/read`).catch(() => {}))
    );
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(var(--background-rgb,255,255,255),0.8)', borderColor: 'var(--card-border)' }}>
      <div className="mx-auto max-w-350 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Mobile menu + logo */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border transition"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)' }}
            >
              <span className="sr-only">{t("navbar.openSidebar")}</span>
              <Menu size={18} />
            </button>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Clynk</span>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                id="nav-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/search?q=${encodeURIComponent(query)}`); }}
                placeholder={t("navbar.search")}
                dir={isEnglish ? "ltr" : "rtl"}
                className="w-full pl-10 pr-4 py-2 rounded-2xl border text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'color-mix(in srgb, var(--primary) 40%, transparent)',
                }}
              />
              <Search
  size={18}
  className={`absolute top-1/2 -translate-y-1/2 ${
    isEnglish ? "left-3" : "right-3"
  }`}
  style={{ color: "var(--text-secondary)" }}
/>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl border transition cursor-pointer"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            title={dark ? t("navbar.lightMode") : t("navbar.darkMode")}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language */}
            <button
              onClick={toggleLocale}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl border transition cursor-pointer gap-1 text-[13px] font-bold"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              <Globe size={16} />
              <span className="text-[11px] uppercase">{i18n.language === 'en' ? 'en' : 'ar'}</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl border transition cursor-pointer"
                style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}
              >
                <Bell size={18} style={{ color: 'var(--text-primary)' }} />
              </button>
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {notifOpen && (
                <div
                  className="absolute mt-2 w-75 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-[var(--shadow-soft)] p-3 z-40 backdrop-blur-md"
                  style={{
                     [isEnglish ? "right" : "left"]:0,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div className="flex items-center justify-between px-2">
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {t("navbar.notifications")}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button onClick={handleMarkAllRead} className="text-xs text-slate-500 hover:text-slate-700">
                        {t("navbar.markAllRead")}
                      </button>
                      <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-slate-100">
                        <X size={14} className="text-slate-500" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 max-h-64 overflow-auto space-y-2">
                    {notifications.length === 0 && (
                      <div className="px-3 py-4 text-sm text-slate-500">
                        {t("navbar.noNotifications")}
                      </div>
                    )}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-3 py-2 rounded-xl cursor-pointer transition"
                        style={{
                          background: n.read ? 'transparent' : 'rgba(31,43,108,0.06)',
                          opacity: n.read ? 0.7 : 1,
                        }}
                        onClick={async () => {
                          setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
                          setNotifOpen(false);
                          if (!n.read) await axiosInstance.patch(`/notifications/${n.id}/read`).catch(() => {});
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                            <span className="text-xs ml-2 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{n.time}</span>
                          </div>
                          <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 border-t pt-2 flex items-center justify-between px-2" style={{ borderColor: 'var(--card-border)' }}>
                    <button onClick={() => setNotifications([])} className="text-xs text-red-500">
                      {t("navbar.clearAll")}
                    </button>
                    <button
                      onClick={() => { setNotifOpen(false); navigate('/doctor-dashboard/notifications'); }}
                      className="text-xs font-semibold cursor-pointer"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                    {t("navbar.viewAll")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border transition cursor-pointer overflow-hidden"
                style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}
              >
                <img src={avatarSrc} alt={fullName} width={40} height={40} className="rounded-full w-full h-full object-cover" />
              </button>
              {profileOpen && (
                <div
                  className="absolute mt-2 w-48 rounded-2xl shadow-xl p-2 z-50 backdrop-blur-sm"
                  style={{ [isEnglish ? "right" : "left"]:0, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img src={avatarSrc} alt={fullName} width={40} height={40} className="rounded-full" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{fullName}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{specialist}</div>
                    </div>
                  </div>
                  <div className="border-t mt-1" style={{ borderColor: 'var(--card-border)' }} />
                  <button
                    onClick={async () => { await logout(); navigate('/Login'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut size={16} />
                    <span>{t("navbar.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
