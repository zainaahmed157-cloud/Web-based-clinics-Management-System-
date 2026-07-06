import { Stethoscope } from "lucide-react";

function Contact() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAFCFF] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-[620px] bg-white border border-[#D8E3FF] rounded-[32px] shadow-[0_20px_60px_rgba(47,86,211,.12)] py-12 px-8 text-center">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-[120px] h-[120px] rounded-full bg-[#EEF3FF] flex items-center justify-center">
            <div className="w-[90px] h-[90px] rounded-full bg-[#E5ECFF] flex items-center justify-center">
              <Stethoscope
                size={50}
                strokeWidth={2.5}
                className="text-[#2F56D3]"
              />
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className="mt-10 text-[110px] font-black leading-none text-[#1F2D6B]">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-5 text-[38px] font-bold text-[#1F2D6B]">
          الصفحة غير موجودة
        </h2>

        {/* Description */}
        <p className="mt-5 text-[20px] text-[#7A88B4] leading-9">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>

        {/* Button */}
        <button
          className="inline-flex items-center gap-3 mt-12 bg-[#2F56D3] hover:bg-[#2449C2] duration-300 text-white text-xl font-bold rounded-full px-10 py-4 shadow-[0_12px_30px_rgba(47,86,211,.35)]"
        >
          العودة للرئيسية
          <span className="text-2xl">←</span>
        </button>

      </div>
    </div>
  );
}

export default Contact;