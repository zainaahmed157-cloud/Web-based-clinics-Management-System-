import React from 'react'
import { Mail, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; // استيراد Link الصحيح

export default function Footer({ isEnglish }) {
  const arabicText = {
    desc: 'منصة ذكية لحجز الرعاية الصحية تربط المرضى بأفضل الأطباء والعيادات.',
    searchTitle: 'ابحث عبر',
    // المسارات مطابقة تماماً للموجودة في الناف بار عندك
    links: [
      { name: 'الرئيسية', path: '/' },
      { name: 'التخصصات', path: '/Specialties' },
      { name: 'الأطباء', path: '/Doctors' },
      { name: 'مواعيدي', path: '/Appointments' },
      { name: 'العروض', path: '#' }, // هندلي المسار لاحقاً
      { name: 'من نحن', path: '/About' }
    ],
    supportTitle: 'الدعم',
    supportLinks: ['مركز المساعدة', 'تواصل معنا', 'سياسة الخصوصية', 'شروط الخدمة'],
    teamTitle: 'الفريق',
    teamLinks: ['انضم للفريق', 'التقديم للفريق', 'دعم الفريق'],
    contactTitle: 'اتصل',
    hours: 'ساعات الدعم',
    rights: `حقوق النشر © ${new Date().getFullYear()} ميداورا. جميع الحقوق محفوظة.`
  };

  const englishText = {
    desc: 'Smart healthcare booking platform connecting patients with top doctors and clinics.',
    searchTitle: 'Search by',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Specialties', path: '/Specialties' },
      { name: 'Doctors', path: '/Doctors' },
      { name: 'My Appointments', path: '/Appointments' },
      { name: 'Offers', path: '#' },
      { name: 'About us', path: '/About' }
    ],
    supportTitle: 'SUPPORT',
    supportLinks: ['Help center', 'Contact us', 'Privacy policy', 'Terms of service'],
    teamTitle: 'Team',
    teamLinks: ['Join our team', 'Apply to join', 'Team support'],
    contactTitle: 'Contact',
    hours: 'Support hours',
    rights: `© ${new Date().getFullYear()} Medaura. All rights reserved.`
  };

  const text = isEnglish ? englishText : arabicText;

  return (
    <div 
      className='text-[#8db0c3] pt-8 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#071022] w-full mt-auto'
      dir={isEnglish ? 'ltr' : 'rtl'}
    >
      <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
        <div className='max-w-80'>
          <div className='flex items-center gap-2'>
            <img src='src/assets/Logo1.png' alt='logo med' className="h-10 w-10 object-contain"/>
            <span className='text-xl font-bold tracking-wide text-white'>Medaura</span>
          </div>
          <p className='text-sm mt-2'>{text.desc}</p>
          
          {/* أيقونات السوشيال ميديا ترتبط بالهوم الآن */}
          <div className='flex items-center gap-3 mt-4'>
            {/* LinkedIn */}
            <Link to="/" className="hover:text-[#cdffff] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
              </svg>
            </Link>
            {/* Instagram */}
            <Link to="/" className="hover:text-[#cdffff] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
              </svg>
            </Link>
            {/* Twitter */}
            <Link to="/" className="hover:text-[#cdffff] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* العمود الثاني: ابحث عبر (روابط ديناميكية تؤدي لصفحاتها الفردية) */}
        <div>
          <p className='text-lg text-gray-600'>{text.searchTitle}</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            {text.links.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className='hover:text-[#cdffff]'>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود الثالث: الدعم */}
        <div>
          <p className='text-lg text-gray-600 '>{text.supportTitle}</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            {text.supportLinks.map((link, index) => (
              <li key={index}>
                {/* قمت بتغييرها لـ Link كابيتال وتوجيهها مؤقتاً لـ / يمكنك هندلتها لاحقاً */}
                <Link to="#" className='hover:text-[#cdffff]'>{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود الرابع: الفريق */}
        <div className='max-w-80 text-gray-600'>
          <p className='text-lg '>{text.teamTitle}</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm text-[#8db0c3]'>
            {text.teamLinks.map((link, index) => (
              <li key={index}>
                <Link to="#" className='hover:text-[#cdffff]'>{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود الخامس: الاتصال */}
        <div className='max-w-80 text-gray-600'>
          <p className='text-lg font-medium'>{text.contactTitle}</p>
          <ul className='mt-3 flex flex-col gap-3 text-sm text-[#8db0c3]'>
            <li className='flex items-center gap-2'>
              <Mail className="w-4 h-4 text-gray-500" />
              <a href="mailto:support@medaura.com" className='hover:underline hover:text-[#cdffff]'>support@medaura.com</a>
            </li>
            <li className='flex items-center gap-2'>
              <Phone className="w-4 h-4 text-gray-500" />
              <a href="tel:+201000000000" className='hover:underline hover:text-[#cdffff]'>+20 100 000 0000</a>
            </li>
            <li className='flex items-center gap-2'>
              <Clock className="w-4 h-4 text-gray-500" />
              <a href="#" className='hover:underline hover:text-[#cdffff]'>{text.hours}</a>
            </li>
          </ul>
        </div>
      </div>

      <hr className='border-gray-700 mt-8' />
      <div className='flex items-center justify-center py-5'>
        <p className='text-sm text-gray-300 text-center w-full mb-4 mt-4'>
          {text.rights}
        </p>
      </div>
    </div>
  );
}