import React , { useEffect }  from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export default function Nav() {
    const [open, setOpen] = React.useState(false);
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language.startsWith("en");
    const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
};
    const activeLinkStyle = ({ isActive }) =>
  isActive
    ? "text-[#2563eb] font-bold border-b-2 border-[#2563eb] pb-1 transition-all duration-200"
    : "text-[#0f1a4f] hover:text-[#2563eb] transition-all duration-200";
    const activeMobileLinkStyle = ({ isActive }) =>
        isActive
            ? "flex items-center justify-between w-full px-4 py-2.5 bg-[#0f1a4f] text-white font-medium rounded-lg transition-all duration-200"
            : "flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-[#d9e3ff] rounded-lg transition-all duration-200";
    return (
        
        <nav className="fixed top-0 left-0 w-full z-[9999] bg-[#edf2ff] border-b border-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex items-center justify-between">
            
            <div className='flex items-center gap-3'>
                <Link to="/" className="block h-10 w-10">
                    <img src='src/assets/Logo1.png' alt='logo med' className="h-full w-full object-contain"/>
                </Link>
                <span className='text-xl font-bold tracking-wide text-[#0f1a4f]'>Medaura</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 lg:gap-8 text-sm md:text-base">
                <NavLink to="/" className={activeLinkStyle}>{t('home')}</NavLink>
                <NavLink to="/Specialties" className={activeLinkStyle}>{t('specialties')}</NavLink>
                <NavLink to="/Doctors" className={activeLinkStyle}>{t('doctors')}</NavLink>
                <NavLink to="/Clinics" className={activeLinkStyle}>{t('clinics')}</NavLink>
                <NavLink to="/Appointments" className={activeLinkStyle}>{t('appointments')}</NavLink>
                <NavLink to="/About" className={activeLinkStyle}>{t('about')}</NavLink>
                <NavLink to="/contact" className={activeLinkStyle}>{t('contact')}</NavLink>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <button 
                    onClick={toggleLanguage} 
                    className="w-10 h-10 flex items-center justify-center rounded-3xl border border-[#0f1a4f] text-[#0f1a4f] text-xs font-bold uppercase hover:bg-gray-50 transition-colors"
                >
                {isEnglish ? "EN" : "ع"}
                </button>
                <Link to="/Login" className="px-4 py-2 rounded-full border border-[#0f1a4f] text-[#0f1a4f] font-medium hover:bg-gray-50">{t('login')}</Link>
                <Link to="/CreateAccount" className="px-6 py-2 rounded-full bg-[#0f1a4f] text-white font-medium hover:bg-[#1a2d75]">{t('createAccount')}</Link>
            </div>
            <div className="sm:hidden flex items-center gap-2">
  <button
    onClick={toggleLanguage}
    className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0f1a4f] text-[#0f1a4f] text-xs font-bold"
  >
    {isEnglish ? "EN" : "ع"}
  </button>

  <button onClick={() => setOpen(!open)} className="p-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f1a4f" strokeWidth="2">
      <path d="M4 12h16M4 6h16M4 18h16" />
    </svg>
  </button>
</div>
            {open && (
                <div className="absolute top-full left-0 w-full bg-[#edf2ff] border-b border-gray-200 flex flex-col p-4 gap-4 sm:hidden shadow-lg">
                <NavLink to="/" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("home")}</NavLink>
                <NavLink to="/Specialties" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t('specialties')}</NavLink>
                <NavLink to="/Specialties" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("specialties")}</NavLink>
                <NavLink to="/Doctors" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("doctors")}</NavLink>
                <NavLink to="/Clinics" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("clinics")}</NavLink>
                <NavLink to="/Appointments" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("appointments")}</NavLink>
                <NavLink to="/About" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("about")}</NavLink>
                <NavLink to="/contact" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>{t("contact")}</NavLink>
                <Link to="/Login" onClick={() => setOpen(false)} className="px-4 py-2 rounded-full border border-[#0f1a4f] text-[#0f1a4f] font-medium hover:bg-gray-50 text-center">{t('login')}</Link>
                <Link to="/CreateAccount" onClick={() => setOpen(false)} className="px-6 py-2 rounded-full bg-[#0f1a4f] text-white font-medium hover:bg-[#1a2d75] text-center">{t('createAccount')}</Link>
                </div>
            )}
        </nav>
    );
}