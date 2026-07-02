import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
i18n
.use(LanguageDetector) 
.use(initReactI18next)
.init({
resources: {
    en: { translation: { home: "Home",
            specialties: "Specialties",
            doctors: "Doctors",
            clinics: "Clinics",
            appointments: "Appointments",
            about: "About",
            contact: "Contact",
            login: "Login",
            createAccount: "Create account",
            footer: {
            desc: "Smart healthcare booking platform connecting patients with top doctors and clinics.",
            searchTitle: "Search by",
            supportTitle: "Support",
            teamTitle: "Team",
            contactTitle: "Contact",
            hours: "Support hours",
            rights: "© Medaura. All rights reserved.",
            home: "Home",
            specialties: "Specialties",
            doctors: "Doctors",
            appointments: "My Appointments",
            offers: "Offers",
            about: "About Us",
            helpCenter: "Help Center",
            contactUs: "Contact Us",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            join: "Join our Team",
            apply: "Apply to Join",
            teamSupport: "Team Support"
            }
            ,
            specialtiesPage: {
            badge: "Medical Specialties",
            title: "Choose the right specialty",
            subtitle: "Book your appointment with the best doctors in minutes",
            search: "Search for specialty...",
            doctor: "Doctor",
            button: "View Doctors",
            sectionTitle: "Medical Specialties",
            viewAll: "View All Doctors",
            cardiology: "Cardiology",
            neurology: "Neurology",
            orthopedics: "Orthopedics",
            pulmonology: "Pulmonology",
            nephrology: "Nephrology",
            oncology: "Oncology",
            ent: "ENT",
            ophthalmology: "Ophthalmology",
            obgyn: "OB-GYN",
            dermatology: "Dermatology",
            dentistry: "Dentistry",
            pediatrics: "Pediatrics",
            specialtiesCount: "Medical Specialties",
            availableDoctors: "Available Doctors",
            noResults: "No specialties found"
}
        } },
    ar: { translation: { home: "الرئيسية",
            specialties: "التخصصات",
            doctors: "الأطباء",
            clinics: "العيادات",
            appointments: "المواعيد",
            about: "من نحن",
            contact: "اتصل بنا",
            login: "تسجيل الدخول",
            createAccount: "إنشاء حساب",
            footer: {
            desc: "منصة ذكية لحجز الرعاية الصحية تربط المرضى بأفضل الأطباء والعيادات.",
            searchTitle: "ابحث عبر",
            supportTitle: "الدعم",
            teamTitle: "الفريق",
            contactTitle: "اتصل بنا",
            hours: "ساعات الدعم",
            rights: "جميع الحقوق محفوظة © Medaura",
            home: "الرئيسية",
            specialties: "التخصصات",
            doctors: "الأطباء",
            appointments: "مواعيدي",
            offers: "العروض",
            about: "من نحن",
            helpCenter: "مركز المساعدة",
            contactUs: "تواصل معنا",
            privacy: "سياسة الخصوصية",
            terms: "شروط الخدمة",
            join: "انضم للفريق",
            apply: "التقديم للفريق",
            teamSupport: "دعم الفريق",
            }
            ,
            specialtiesPage: {
            badge: "جميع التخصصات الطبية ",
            title: "اختر التخصص المناسب",
            subtitle: "احجز موعدك مع أفضل الأطباء في غضون دقائق",
            search: "ابحث عن تخصص...",
            doctor: "طبيب",
            button: "عرض الأطباء",
            sectionTitle: "التخصصات الطبية",
            viewAll: "عرض جميع الأطباء",
            cardiology: "قلب وأوعية دموية",
            neurology: "مخ وأعصاب",
            orthopedics: "عظام",
            pulmonology: "صدر وجهاز تنفسي",
            nephrology: "كلى",
            oncology: "أورام",
            ent: "أنف وأذن وحنجرة",
            ophthalmology: "طب العيون",
            obgyn: "نساء وتوليد",
            dermatology: "جلدية",
            dentistry: "أسنان",
            pediatrics: "أطفال وحديثي الولادة",
            specialtiesCount: "تخصص طبي",
            availableDoctors: "طبيب متاح",
            noResults: "لا توجد تخصصات مطابقة"
}
    } }
},
detection: {
    order: ['localStorage', 'navigator'], 
    caches: ['localStorage'] 
},
fallbackLng: "ar",
interpolation: { escapeValue: false }
});

export default i18n;