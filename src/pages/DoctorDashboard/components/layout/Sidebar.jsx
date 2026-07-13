import { Link, useLocation } from 'react-router-dom';
import {
  Users, Calendar, Bell, Settings,
  LayoutDashboard, FileText, TrendingUp, Building2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const menu = [
  {
    title: "sidebar.home",
    items: [
      {
        text: "sidebar.dashboard",
        icon: <LayoutDashboard size={16} />,
        href: "/doctor-dashboard",
      },
    ],
  },
  {
    title: "sidebar.healthcare",
    items: [
      {
        text: "sidebar.patients",
        icon: <Users size={16} />,
        href: "/doctor-dashboard/patients",
      },
      {
        text: "sidebar.appointments",
        icon: <Calendar size={16} />,
        href: "/doctor-dashboard/appointments",
      },
      {
        text: "sidebar.prescriptions",
        icon: <FileText size={16} />,
        href: "/doctor-dashboard/prescriptions",
      },
    ],
  },
  {
    title: "sidebar.management",
    items: [
      {
        text: "sidebar.financial",
        icon: <TrendingUp size={16} />,
        href: "/doctor-dashboard/financial",
      },
      {
        text: "sidebar.notifications",
        icon: <Bell size={16} />,
        href: "/doctor-dashboard/notifications",
      },
      {
        text: "sidebar.settings",
        icon: <Settings size={16} />,
        href: "/doctor-dashboard/settings",
      },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const pathname = useLocation().pathname;
  const { t, i18n } = useTranslation();
const isEnglish = i18n.language.startsWith("en");
  const posClass = isEnglish
  ? `fixed inset-y-0 left-0 z-50 h-screen w-64 bg-[#182a53] text-white px-4 pb-4 space-y-4 overflow-auto shadow-2xl lg:shadow-none transform lg:sticky lg:top-0 transition-transform duration-300 ease-in-out border-r border-white/10 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
  : `fixed inset-y-0 right-0 z-50 h-screen w-64 bg-[#182a53] text-white px-4 pb-4 space-y-4 overflow-auto shadow-2xl lg:shadow-none transform lg:sticky lg:top-0 transition-transform duration-300 ease-in-out border-l border-white/10 ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`;
  return (
    <div className={posClass} dir={isEnglish ? "ltr" : "rtl"}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#182a53] pt-4 pb-2">
        <button
          className="lg:hidden mb-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={onClose}
          aria-label={t("sidebar.closeSidebar")}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div
  className={`flex items-center justify-between border-b border-white/10 pb-4 ${
    isEnglish ? "flex-row" : "flex-row-reverse"
  }`}
>
  <div
    className={`flex items-center gap-2 ${
      isEnglish ? "flex-row" : "flex-row-reverse"
    }`}
  >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-white" />
            </div>
            <div className={isEnglish ? 'text-left' : 'text-right'}>
              <h1 className="text-lg font-bold tracking-wide">Clynk</h1>
              <p className="text-[10px] text-white/60">
  {t("sidebar.doctorDashboard")}
</p>
            </div>
          </div>
          <span className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
            MD
          </span>
        </div>
      </div>

      {/* Menu */}
      {menu.map((section, i) => (
        <div key={i}>
         <span
  className={`text-[10px] text-white/55 mb-2.5 block uppercase tracking-[0.2em] ${
    isEnglish ? "text-left" : "text-right"
  }`}
>
  {t(section.title)}
</span>
          <div className="space-y-1">
            {section.items.map((item, idx) => {
              const isActive = item.href === '/doctor-dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={idx}
                  to={item.href}
                  className="w-full block"
                  onClick={onClose}
                >
                  <div
  className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 group
  ${isEnglish ? "flex-row" : "flex-row-reverse"}
  ${isActive
    ? "bg-white/15 text-white font-semibold ring-1 ring-white/15 shadow-[0_10px_18px_rgba(0,0,0,0.2)]"
    : "text-white/75 hover:bg-white/10 hover:text-white"
  }`}
>
                    <span className={`w-4 h-4 shrink-0 transition-transform group-hover:-rotate-6 ${isActive ? 'text-white' : ''}`}>
                      {item.icon}
                    </span>
                   <span
  className={`text-[13px] flex-1 ${
    isEnglish ? "text-left" : "text-right"
  }`}
>
  {t(item.text)}
</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
