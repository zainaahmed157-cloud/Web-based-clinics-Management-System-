import { Mars, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VisitsGauge({ male, female, total }) {
 const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const size = 220;
  const center = size / 2;
  const outerRadius = 100;
  const innerRadius = 84;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const malePercent = (male || 0) / 100;
  const femalePercent = (female || 0) / 100;
  const maleFilled = Math.round(malePercent * outerCircumference);
  const maleUnfilled = Math.round(outerCircumference - maleFilled);
  const femaleFilled = Math.round(femalePercent * innerCircumference);
  const femaleUnfilled = Math.round(innerCircumference - femaleFilled);

  return (
    <div
      className="border h-fit rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      dir={isEnglish ? "ltr" : "rtl"}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b mb-4 p-4" style={{ borderColor: 'var(--card-border)' }}>
        <button
          className="w-full sm:w-auto border px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:text-white hover:bg-[var(--primary)] transition-colors duration-300"
          style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
        >
          {t("visitsGauge.showAll")}
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t("visitsGauge.title")}
        </h3>
      </div>

      <div className="flex justify-center p-4">
        <div className="w-full max-w-[280px]">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            <defs>
              <mask id="maskMale">
                <circle cx={center} cy={center} r={outerRadius} stroke="white" fill="none" strokeWidth="10"
                  strokeDasharray={outerCircumference} strokeDashoffset={maleUnfilled}
                  transform={`rotate(-210 ${center} ${center})`}
                />
              </mask>
              <mask id="maskFemale">
                <circle cx={center} cy={center} r={innerRadius} stroke="white" fill="none" strokeWidth="10"
                  strokeDasharray={innerCircumference} strokeDashoffset={femaleUnfilled}
                  transform={`rotate(-210 ${center} ${center})`}
                />
              </mask>
            </defs>

            <circle cx={center} cy={center} r={outerRadius} stroke="#1F6DB2" strokeLinecap="butt" fill="none"
              strokeWidth="10" strokeDasharray="9 8" mask="url(#maskMale)"
              transform={`rotate(-367 ${center} ${center})`}
            />
            <circle cx={center} cy={center} r={innerRadius} stroke="#6A1B9A" fill="none"
              strokeWidth="10" strokeDasharray="9 8" mask="url(#maskFemale)"
              transform={`rotate(-367 ${center} ${center})`}
            />

            <text x={center} y={center - 22} textAnchor="middle" dominantBaseline="middle"
              fontSize="16" fill="var(--text-secondary)" fontWeight="semibold"
            >
              {t("visitsGauge.allPatients")}
            </text>
            <text x={center} y={center + 22} textAnchor="middle" dominantBaseline="middle"
              fontSize="24" fill="var(--text-primary)" fontWeight="bold"
            >
              {total}%
            </text>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Male */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{male}%</h3>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className={isEnglish ? "text-left" : "text-right"}>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t("visitsGauge.male")}</p>
              <div className="flex items-center gap-2 font-medium">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t("visitsGauge.sinceLastWeek")}</p>
                <span className="text-emerald-600">-15%</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1F6DB2] flex items-center justify-center shrink-0">
              <Mars size={20} strokeWidth={2} className="text-white" />
            </div>
          </div>
        </div>

        {/* Female */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{female}%</h3>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className={isEnglish ? "text-left" : "text-right"}>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t("visitsGauge.female")}</p>
              <div className="flex items-center gap-2 font-medium">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t("visitsGauge.sinceLastWeek")}</p>
                <span className="text-emerald-600">-15%</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#6A1B9A] flex items-center justify-center shrink-0">
              <Venus size={20} strokeWidth={2} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
