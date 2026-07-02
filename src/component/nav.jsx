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
            ? "border-b-2 border-[#0f1a4f] pb-1 font-medium text-[#0f1a4f] transition-colors duration-200" 
            : "hover:text-[#525b84] text-[#0f1a4f] transition-colors duration-200";
    const activeMobileLinkStyle = ({ isActive }) =>
        isActive
            ? "flex items-center justify-between w-full px-4 py-2.5 bg-[#0f1a4f] text-white font-medium rounded-lg transition-all duration-200"
            : "flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-[#d9e3ff] rounded-lg transition-all duration-200";
    return (
        
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-[#edf2ff] relative z-50">
            
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
            <button onClick={() => setOpen(!open)} className="sm:hidden p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f1a4f" strokeWidth="2"><path d="M4 12h16M4 6h16M4 18h16"></path></svg>
            </button>
            {open && (
                <div className="absolute top-full left-0 w-full bg-[#edf2ff] border-b border-gray-200 flex flex-col p-4 gap-4 sm:hidden shadow-lg">
                <NavLink to="/" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('home')}</NavLink>
                <NavLink to="/Specialties" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('specialties')}</NavLink>
                <NavLink to="/Doctors" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('doctors')}</NavLink>
                <NavLink to="/Clinics" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('clinics')}</NavLink>
                <NavLink to="/Appointments" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('appointments')}</NavLink>
                <NavLink to="/About" onClick={() => setOpen(false)} className="text-[#0f1a4f] ">{t('about')}</NavLink>
                <NavLink to="/contact"onClick={() => setOpen(false)} className="text-[#0f1a4f]">{t('contact')}</NavLink>
                    <Link to="/Login" onClick={() => setOpen(false)} className="px-4 py-2 rounded-full border border-[#0f1a4f] text-[#0f1a4f] font-medium hover:bg-gray-50 text-center">{t('login')}</Link>
                    <Link to="/CreateAccount" onClick={() => setOpen(false)} className="px-6 py-2 rounded-full bg-[#0f1a4f] text-white font-medium hover:bg-[#1a2d75] text-center">{t('createAccount')}</Link>
                </div>
            )}
        </nav>
    );
}