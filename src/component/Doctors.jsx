import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function DoctorsFilterSection() {
  // حالات التحكم في فتح وإغلاق القوائم المنسدلة (Dropdowns)
  const [activeDropdown, setActiveDropdown] = useState(null);

  // قيم الفلاتر المختارة حالياً
  const [specialty, setSpecialty] = useState('All Specialties');
  const [price, setPrice] = useState('All Prices');
  const [gender, setGender] = useState('All');
  const [sortBy, setSortBy] = useState('Top Rated');
  const [searchQuery, setSearchQuery] = useState('');

  // دالة لتبديل فتح/إغلاق القائمة
  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  // مصفوفات البيانات المطابقة تماماً للصور المرسلة
  const specialties = [
    'All Specialties', 'Neurology', 'Orthopedics', 'Oncology', 'ENT',
    'Ophthalmology', 'Cardiology', 'Pulmonology', 'Nephrology',
    'Dentistry', 'Pediatrics', 'Dermatology', 'OB-GYN'
  ];

  const prices = [
    'All Prices', 'Under 200 EGP', '200 – 500 EGP', '500 – 1000 EGP', 'Over 1000 EGP'
  ];

  const genders = ['All', 'Male', 'Female'];

  const sortOptions = [
    'Top Rated', 'Price: Low to High', 'Price: High to Low', 'Alphabetical (A-Z)'
  ];

  return (
    <div className="bg-slate-50/40 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased select-none">

      {/* قسم العنوان العلوي */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1d4ed8] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-100/60">
          ✨ Best Certified Doctors in Egypt
        </div>
        <h1 className="text-4xl font-bold text-[#1e293b] tracking-tight mb-2">
          Most Booked Doctors
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          2 certified doctors in all specialties
        </p>
      </div>

      {/* شريط البحث الرئيسي والفلاتر */}
      <div className="max-w-4xl mx-auto space-y-4 relative">

        {/* حقل البحث */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 text-sm transition-all text-slate-600 placeholder-slate-400"
          />
        </div>

        {/* شريط الفلاتر (Dropdowns) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">

          {/* زر الأيقونة الجانبي */}
          <button className="flex items-center justify-center p-2.5 text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {/* 1. فلتر التخصص (Specialty) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('specialty')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'specialty' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-blue-900 font-semibold">⚕️</span>
              <span>{specialty}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'specialty' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'specialty' && (
              <div className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1 scrollbar-thin">
                {specialties.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setSpecialty(item); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${item === specialty ? 'bg-[#0f172a] text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. فلتر السعر (Consultation Price) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('price')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'price' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-blue-900 font-bold text-[10px]">EGP</span>
              <span>{price === 'All Prices' ? 'Consultation Price' : price}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'price' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1">
                {prices.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setPrice(item); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${item === price ? 'bg-[#0f172a] text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. فلتر النوع (Gender) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('gender')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'gender' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-slate-500 font-bold text-[11px]">👤</span>
              <span>{gender === 'All' ? 'Gender' : gender}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'gender' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'gender' && (
              <div className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1">
                {genders.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setGender(item); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${item === gender ? 'bg-[#0f172a] text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. فلتر الترتيب (Sort By) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('sortBy')}
              className={`flex items-center gap-2 bg-white border ${activeDropdown === 'sortBy' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-slate-200'} rounded-xl px-4 py-2 text-xs font-medium text-[#1e293b] shadow-sm hover:bg-slate-50 transition-all`}
            >
              <span className="text-slate-500 font-bold text-[11px]">⇅</span>
              <span>Sort By: {sortBy}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${activeDropdown === 'sortBy' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'sortBy' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1">
                {sortOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setSortBy(item); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${item === sortBy ? 'bg-[#0f172a] text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* سطر الـ Pagination الخفيف الموجود أسفل الفلاتر مباشرة في الصورة */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-between items-center text-[11px] text-slate-400 px-1 font-medium">
        <span>Showing 1 – 2 of 2 doctors</span>
        <span>Page <strong className="text-slate-700">1</strong> of 1</span>
      </div>

    </div>
  );
}