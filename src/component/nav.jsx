import React from 'react';
import { NavLink, Link } from 'react-router-dom';
export default function Nav({ isEnglish, setIsEnglish }) {
    const [open, setOpen] = React.useState(false);
    const content = {
        ar: {
            home: "الرئيسية",
            specialties: "التخصصات",
            doctors: "الأطباء",
            clinics: "العيادات",
            appointments: "المواعيد",
            about: "من نحن",
            contact: "اتصل بنا",
            profile: "الحساب الشخصي",
            logout: "تسجيل الخروج",
        },
        en: {
            home: "Home",
            specialties: "Specialties",
            doctors: "Doctors",
            clinics: "Clinics",
            appointments: "Appointments",
            about: "About",
            contact: "Contact",
            profile: "Profile",
            logout: "Logout",
        }
    };
    const t = isEnglish ? content.en : content.ar;
    const activeLinkStyle = ({ isActive }) => 
        isActive 
            ? "border-b-2 border-[#0f1a4f] pb-1 font-medium text-[#0f1a4f] transition-colors duration-200" 
            : "hover:text-[#525b84] text-[#0f1a4f] transition-colors duration-200";
    const activeMobileLinkStyle = ({ isActive }) =>
        isActive
            ? "flex items-center justify-between w-full px-4 py-2.5 bg-[#0f1a4f] text-white font-medium rounded-lg transition-all duration-200"
            : "flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-[#d9e3ff] rounded-lg transition-all duration-200";
    return (
        
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative z-50">
            
            <div className='flex items-center gap-3'>
                <Link to="/" className="block h-10 w-10">
                    <img src='src/assets/Logo1.png' alt='logo med' className="h-full w-full object-contain"/>
                </Link>
                <span className='text-xl font-bold tracking-wide text-[#0f1a4f]'>Medaura</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 lg:gap-8 text-sm md:text-base">
                <NavLink to="/" className={activeLinkStyle}>{t.home}</NavLink>
                <NavLink to="/Specialties" className={activeLinkStyle}>{t.specialties}</NavLink>
                <NavLink to="/Doctors" className={activeLinkStyle}>{t.doctors}</NavLink>
                <NavLink to="/Clinics" className={activeLinkStyle}>{t.clinics}</NavLink>
                <NavLink to="/Appointments" className={activeLinkStyle}>{t.appointments}</NavLink>
                <NavLink to="/About" className={activeLinkStyle}>{t.about}</NavLink>
                <NavLink to="/contact" className={activeLinkStyle}>{t.contact}</NavLink>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <button 
                    onClick={() => setIsEnglish(!isEnglish)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-xs hover:bg-gray-50 cursor-pointer font-bold uppercase transition-colors"
                >
                    {isEnglish ? 'EN' : 'ع'}
                </button>
                <div className="cursor-pointer p-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div className="cursor-pointer p-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
            </div>
            <div className="flex sm:hidden items-center gap-3">
                <button 
                    onClick={() => setIsEnglish(!isEnglish)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                    {isEnglish ? 'EN' : 'ع'}
                </button>
                <div className="cursor-pointer p-1.5 rounded-full border border-gray-300 text-gray-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div className="cursor-pointer p-1.5 rounded-full border border-gray-300 text-gray-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <button onClick={() => setOpen(!open)} aria-label="Menu" className="cursor-pointer p-1 z-50">
                    {open ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="21" height="1.5" rx=".75" fill="#426287" />
                            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                        </svg>
                    )}
                </button>
            </div>
            <div className={`${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between transition-all duration-300 ease-in-out sm:hidden z-40 pt-20`} dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="flex flex-col gap-1.5 px-2 overflow-y-auto grow text-sm">
                    <NavLink to="/" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.home}</span>
                    </NavLink>
                    <NavLink to="/Specialties" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.specialties}</span>
                    </NavLink>
                    <NavLink to="/Doctors" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.doctors}</span>
                    </NavLink>
                    <NavLink to="/Clinics" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.clinics}</span>
                    </NavLink>
                    <NavLink to="/Appointments" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.appointments}</span>
                    </NavLink>
                    <NavLink to="/About" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.about}</span>
                    </NavLink>
                    <NavLink to="/contact" onClick={() => setOpen(false)} className={activeMobileLinkStyle}>
                        <span>{t.contact}</span>
                    </NavLink>
                    <div className="border-t border-gray-100 my-3"></div>
                    <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span className="font-medium">{t.profile}</span>
                    </Link>
                    <button onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg w-full text-start cursor-pointer transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span className="font-medium">{t.logout}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}