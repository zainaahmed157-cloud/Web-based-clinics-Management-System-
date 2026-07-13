
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const data = [
  { name: 'أمراض القلب', value: 800, color: '#001A6E' },
  { name: 'طب الأعصاب', value: 600, color: '#3189A1' },
  { name: 'الأمراض الجلدية', value: 400, color: '#6A1B9A' },
  { name: 'جراحة العظام', value: 350, color: '#EB642F' },
  { name: 'المسالك البولية', value: 300, color: '#FEB746' },
  { name: 'الأشعة', value: 500, color: '#09800F' }
];

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload: { name, value } } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const expandedOuter = outerRadius + 30;
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const ex = cx + (outerRadius + 10) * cos;
  const ey = cy + (outerRadius + 10) * sin;
  const percentage = ((value / 3200) * 100).toFixed(1);

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={expandedOuter}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke='var(--text-primary)'
        strokeWidth={5}
        cornerRadius={10}
      />
    </g>
  );
};


export default function DepartmentsChart() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);

  const totalAppointments = useMemo(() => data.reduce((sum, dep) => sum + dep.value, 0), [data]);
  const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const { name, value, color } = payload[0].payload;
  const percentage = ((value / totalAppointments) * 100).toFixed(1);

  return (
    <div className='min-w-52 p-4 rounded-2xl bg-(--card-bg) backdrop-blur-md shadow-2xl border border-(--card-border)'>
      <div className='flex items-center justify-between gap-3 mb-3 pb-2 border-b border-(--card-border)'>
        <div className='flex items-center gap-3'>
          <div className='w-4 h-4 rounded-full shadow-md ring-2 ring-white/50' style={{ backgroundColor: color }} />
          <span className='font-bold text-lg text-(--text-primary)'>{name}</span>
        </div>
        <span className='px-3 py-1 text-white text-xs font-semibold rounded-full shadow-md'style={{backgroundColor:color}} >
          {percentage}%
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-(--text-secondary) font-medium'>عدد المواعيد</span>
        <span className='text-2xl font-black text-(--text-primary)'>
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

  const pieProps: any = {
    data,
    dataKey: 'value',
    cx: '50%',
    cy: '50%',
    innerRadius: 70,
    outerRadius: 100,
    cornerRadius: 5,
    paddingAngle:5,
    activeIndex,
    activeShape: renderActiveShape,
    isAnimationActive: true,
    onMouseEnter: (_: any, index: number) => { setActiveIndex(index); setTooltipActive(true); },
    onMouseLeave: () => { setActiveIndex(-1); setTooltipActive(false); },
  };

  return (
    <div className='bg-(--card-bg) rounded-2xl shadow-lg border border-(--card-border) overflow-hidden'>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          تقارير المرضي
        </h1>
      </div>

      <div className='flex flex-col lg:flex-row items-stretch justify-between gap-6 p-6'>

        {/* legend */}
        <div className='w-full lg:w-1/2 space-y-2'>
          {data.map((dep, index) => (
            <div key={index} className='flex items-center gap-2 p-2 hover:bg-(--hover-bg) rounded-xl cursor-default transition-all duration-200 group'>
              <span className='w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-(--card-border) group-hover:scale-110 transition-transform' style={{ backgroundColor: dep.color }} />
              <span className='text-sm font-medium text-(--text-primary) truncate'>
                {dep.name}
              </span>
            </div>
          ))}
        </div>

        {/* chart */}
        <div className='relative w-full h-64 sm:h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie {...pieProps} >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} strokeWidth={4} stroke='var(--text-primary)' fill={entry.color} />
                ))}
              </Pie>
              <Tooltip  content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 ${tooltipActive?"opacity-0":"opacity-100"} transition-opacity duration-300`}>
            <div className='text-center'>
              <div className='text-xl font-bold text-متعافي var(--text-primary)mb-1'>المواعيد</div>
              <div className='text-3xl font-black text-(--text-primary)'>{totalAppointments.toLocaleString()}</div>
              <div className='text-sm text-(--text-secondary) mt-1'>إجمالي الأقسام: {data.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-(--card-bg) rounded-2xl p-6">
        <div className="grid grid-cols-1 gap-4 divide-y divide-(--card-border) shadow-sm border border-(--card-border) rounded-xl p-4 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">

          <div className="text-center px-4">
            <p className="text-xl font-bold text-(--text-primary)">
              2512.32 دولار
            </p>
            <p className="text-sm text-(--text-secondary) mt-1">
              الإيرادات
            </p>
          </div>

          <div className="text-center px-4">
            <p className="text-xl font-bold text-(--text-primary)">
              3125+
            </p>
            <p className="text-sm text-(--text-secondary) mt-1">
              المواعيد في الشهر الماضي
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}