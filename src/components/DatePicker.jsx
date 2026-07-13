import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DatePicker({ onSelect, onClose, selectedDate, allowedDays }) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");

  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = isEnglish
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const dayNames = isEnglish
    ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    : ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    const value = toDateInputValue(date);
    const isPastDate = date < today;
    
    const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayName = dayMap[date.getDay()];
    
    // Check if the current day is in the allowed string
    // e.g. allowedDays = "sun,mon,tue"
    const allowedDaysStr = (allowedDays || "").toLowerCase();
    const isWorkingDay = !allowedDaysStr || 
      allowedDaysStr.includes(dayName) ||
      (dayName === "tue" && allowedDaysStr.includes("tues")) ||
      (dayName === "thu" && allowedDaysStr.includes("thur"));

    const isDisabled = isPastDate || !isWorkingDay;
    const isSelected = selectedDate === value;

    days.push(
      <button
        key={value}
        disabled={isDisabled}
        onClick={() => {
            onSelect(value);
            onClose();
        }}
        className={`relative h-10 w-10 flex items-center justify-center rounded-lg text-sm transition-colors mx-auto
          ${
            isDisabled
              ? "text-gray-300 cursor-not-allowed"
              : isSelected
                ? "bg-[#001A6E] text-white font-bold"
                : "text-[#001A6E] hover:bg-blue-50 font-medium"
          }
        `}
      >
        {d}
        {isDisabled && (
          <div className="absolute w-6 h-[1px] bg-gray-300 rotate-[-45deg]"></div>
        )}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-[32px] bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
        dir={isEnglish ? "ltr" : "rtl"}
      >
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className={`p-2 text-gray-400 hover:text-[#001A6E] transition-colors rounded-full hover:bg-gray-50 ${!isEnglish ? 'rotate-180' : ''}`}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl font-bold text-[#001A6E]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className={`p-2 text-gray-400 hover:text-[#001A6E] transition-colors rounded-full hover:bg-gray-50 ${!isEnglish ? 'rotate-180' : ''}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {dayNames.map((day) => (
            <div key={day} className="h-10 flex items-center justify-center text-xs font-bold text-gray-400">
              {day}
            </div>
          ))}
          {days}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-[#001A6E] py-3.5 font-bold text-white hover:bg-[#001250] transition-colors shadow-lg shadow-blue-900/10"
        >
          {isEnglish ? "Close" : "إغلاق"}
        </button>
      </div>
    </div>
  );
}
