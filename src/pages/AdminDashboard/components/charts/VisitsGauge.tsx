
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
    <div className="bg-(--card-bg) border border-(--card-border) h-full rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden flex flex-col">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border border-(--card-border) px-4 py-2 rounded-lg text-sm text-(--text-primary) font-semibold cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-300">
          عرض الكل
        </button>

        <h3 className="text-2xl font-bold text-(--text-primary)">
          زيارات المرضى (نسبة)
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
    </div>
  );
}