import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/Logo1.png';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Nav() {
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchCount = () => {
      if (isAuthenticated) {
        axiosInstance.get('/api/notifications/me')
          .then(res => {
            let data = res.data;
            if (data && data.data) data = data.data;
            const list = Array.isArray(data) ? data : data?.notifications || [];
            const count = list.filter(n => !(n.read || n.is_read)).length;
            setUnreadCount(count);
          })
          .catch(err => console.error("Failed to fetch notifications nav", err));
      }
    };
    
    fetchCount();
    window.addEventListener('notificationsUpdated', fetchCount);
    return () => window.removeEventListener('notificationsUpdated', fetchCount);
  }, [isAuthenticated]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setProfileOpen(false);
    navigate('/Login');
  };

  const activeLinkStyle = ({ isActive }) =>
    isActive
      ? 'text-[#2563eb] font-bold border-b-2 border-[#2563eb] pb-1 transition-all duration-200'
      : 'text-[#0f1a4f] hover:text-[#2563eb] transition-all duration-200';

  const activeMobileLinkStyle = ({ isActive }) =>
    isActive
      ? 'flex items-center justify-between w-full px-4 py-2.5 bg-[#0f1a4f] text-white font-medium rounded-lg transition-all duration-200'
      : 'flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-[#d9e3ff] rounded-lg transition-all duration-200';

  // Build avatar
  const fullName = user?.profile?.full_name || user?.name || user?.email || 'User';
  const userPhoto = user?.photo || user?.profile?.photo || null;
  const avatarUrl = userPhoto
    ? userPhoto
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0f1a4f&color=fff&size=80`;

  const navLinks = [
    { to: '/', label: t('home'), end: true },
    { to: '/Specialties', label: t('specialties') },
    { to: '/Doctors', label: t('doctors') },
    { to: '/Appointments', label: t('appointments') },
    { to: '/About', label: t('about') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-[#edf2ff] border-b border-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="block h-10 w-10">
          <img src={logoImg} alt="Medaura logo" className="h-full w-full object-contain" />
        </Link>
        <span className="text-xl font-bold tracking-wide text-[#0f1a4f]">Medaura</span>
      </div>

      {/* Desktop nav links */}
      <div className="hidden lg:flex items-center gap-6 lg:gap-8 text-sm md:text-base">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={activeLinkStyle}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Desktop right actions */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 flex items-center justify-center rounded-3xl border border-[#0f1a4f] text-[#0f1a4f] text-xs font-bold uppercase hover:bg-gray-50 transition-colors"
        >
          {isEnglish ? 'EN' : 'ع'}
        </button>

        {isAuthenticated && (
           <Link to="/Notifications" className="relative p-2 text-[#0f1a4f] hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
           </Link>
        )}

        {isAuthenticated ? (
          /* ── Logged-in: avatar + dropdown ── */
          <div className="relative">
            <button
              id="nav-avatar-btn"
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-1.5 rounded-full pr-2 pl-1 py-1 border border-[#0f1a4f]/20 hover:bg-white/60 transition-colors"
            >
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#0f1a4f]/20"
              />
              <svg
                className={`w-4 h-4 text-[#0f1a4f] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#0f1a4f] truncate">{fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>

                {user?.user_type === 'doctor' && (
                  <Link
                    to="/doctor-dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1a4f] hover:bg-[#edf2ff] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                )}

                {user?.user_type === 'patient' && (
                  <Link
                    to="/Profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1a4f] hover:bg-[#edf2ff] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('profile') || 'Profile'}
                  </Link>
                )}

                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('logout') || 'Logout'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Guest: login / sign-up ── */
          <>
            <Link
              to="/Login"
              className="px-4 py-2 rounded-full border border-[#0f1a4f] text-[#0f1a4f] font-medium hover:bg-gray-50 transition-colors"
            >
              {t('login.login')}
            </Link>
            <Link
              to="/CreateAccount"
              className="px-6 py-2 rounded-full bg-[#0f1a4f] text-white font-medium hover:bg-[#1a2d75] transition-colors"
            >
              {t('createAccount')}
            </Link>
          </>
        )}
      </div>

      {/* Mobile: language + hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        {isAuthenticated && (
           <Link to="/Notifications" className="relative p-2 text-[#0f1a4f] hover:bg-blue-50 rounded-full transition-colors mr-1">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#edf2ff]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
           </Link>
        )}
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0f1a4f] text-[#0f1a4f] text-xs font-bold"
        >
          {isEnglish ? 'EN' : 'ع'}
        </button>
        <button onClick={() => setOpen(!open)} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f1a4f" strokeWidth="2">
            <path d="M4 12h16M4 6h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#edf2ff] border-b border-gray-200 flex flex-col p-4 gap-3 lg:hidden shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={activeMobileLinkStyle}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <img src={avatarUrl} alt={fullName} className="w-9 h-9 rounded-full object-cover" />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-[#0f1a4f] truncate">{fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {user?.user_type === 'doctor' && (
                <Link
                  to="/doctor-dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1a4f] bg-white rounded-lg border border-gray-200 hover:bg-[#d9e3ff] transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {user?.user_type === 'patient' && (
                <Link
                  to="/Profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1a4f] bg-white rounded-lg border border-gray-200 hover:bg-[#d9e3ff] transition-colors"
                >
                  {t('profile') || 'Profile'}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('logout') || 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/Login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full border border-[#0f1a4f] text-[#0f1a4f] font-medium hover:bg-gray-50 text-center"
              >
                {t('login.login')}
              </Link>
              <Link
                to="/CreateAccount"
                onClick={() => setOpen(false)}
                className="px-6 py-2 rounded-full bg-[#0f1a4f] text-white font-medium hover:bg-[#1a2d75] text-center"
              >
                {t('createAccount')}
              </Link>
            </>
          )}
        </div>
      )}

      {/* Close dropdown on outside click */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </nav>
  );
}