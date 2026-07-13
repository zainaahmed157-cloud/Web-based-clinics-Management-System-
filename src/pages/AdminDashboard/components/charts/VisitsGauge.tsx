
import React from "react";
import { Mars, Venus } from "lucide-react";

type Props = {
  male: number;
  female: number;
  total: number;
};

export default function VisitsGauge({ male, female, total }: Props) {
  const size = 260;
  const center = size / 2;
  const outerRadius = 122;
  const innerRadius = 103;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const malePercent = male / 100;
  const femalePercent = female / 100;

  const maleFilled = Math.round(malePercent * outerCircumference);
  const maleUnfilled = Math.round(outerCircumference - maleFilled);

  const femaleFilled = Math.round(femalePercent * innerCircumference);
  const femaleUnfilled = Math.round(innerCircumference - femaleFilled);

  return (
    <div className="bg-(--card-bg) border border-(--card-border) h-fit rounded-xl shadow-md overflow-hidden">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          عرض الكل
        </button>

        <h3 className="text-2xl font-bold text-(--text-primary)">
          زيارات المرضى
        </h3>
      </div>

      <div className="flex justify-center p-6">
        <div className="w-full max-w-75">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            
            <defs>
              <mask id="maskMale">
                <circle
                  cx={center}
                  cy={center}
                  r={outerRadius}
                  stroke="white"
                  fill="none"
                  strokeWidth="10"
                  strokeDasharray={outerCircumference}
                  strokeDashoffset={maleUnfilled}
                  transform={`rotate(-210 ${center} ${center})`}
                />
              </mask>

              <mask id="maskFemale">
                <circle
                  cx={center}
                  cy={center}
                  r={innerRadius}
                  stroke="white"
                  fill="none"
                  strokeWidth="10"
                  strokeDasharray={innerCircumference}
                  strokeDashoffset={femaleUnfilled}
                  transform={`rotate(-210 ${center} ${center})`}
                />
              </mask>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={outerRadius}
              stroke="#1F6DB2"
              strokeLinecap="butt"
              fill="none"
              strokeWidth="20"
              strokeDasharray="9 8"
              mask="url(#maskMale)"
              transform={`rotate(-367 ${center} ${center})`}
            />

            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="#6A1B9A"
              fill="none"
              strokeWidth="10"
              strokeDasharray="9 8"
              mask="url(#maskFemale)"
              transform={`rotate(-367 ${center} ${center})`}
            />

            <text
              x={center}
              y={center - 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fill="var(--text-secondary)"
              fontWeight="semibold"
            >
              جميع المرضى
            </text>

            <text
              x={center}
              y={center + 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="30"
              fill="var(--text-primary)"
              fontWeight="bold"
            >
              {total}%
            </text>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-6">

        {/* male */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-(--text-primary)">
            {male}%
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="text-right">
              <p className="font-semibold text-(--text-primary)">
                ذكر
              </p>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-(--text-secondary)">
                  منذ الأسبوع الماضي
                </p>
                <span className="text-emerald-600">-15%</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#1F6DB2] flex items-center justify-center">
              <Mars size={23} strokeWidth={2} className="text-white" />
            </div>
          </div>
        </div>

        {/* female */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-(--text-primary)">
            {female}%
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="text-right">
              <p className="font-semibold text-(--text-primary)">
                أنثى
              </p>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-(--text-secondary)">
                  منذ الأسبوع الماضي
                </p>
                <span className="text-emerald-600">-15%</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#6A1B9A] flex items-center justify-center">
              <Venus size={23} strokeWidth={2} className="text-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}