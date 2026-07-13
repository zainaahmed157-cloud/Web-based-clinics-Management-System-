
import { Area, AreaChart , ResponsiveContainer } from "recharts"
import { useId } from "react";

interface statscardProps {
  title : string ;
  value : number ;
  percentage : number ;
  icon :React.ReactNode ;
  iconBg : string ;
  chartColor : string;
  data :{value :number}[];
}

export default function StatsCard({title , value , percentage , icon , iconBg , chartColor , data}:statscardProps) {
  const gradientID = useId()

  return (
    <div className="group w-full bg-(--card-bg) border border-(--card-border)  rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      
      {/* Top Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        
        {/* percentage */}
        <div className="mb-3 p-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${percentage >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {percentage > 0 ? "+" : ""}
            {percentage}%
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4 p-4">
          
          <div className="text-right">
            <p 
              className="font-semibold text-(--text-secondary)"
              style={{color:chartColor}}
            >
              {title}
            </p>

            <h3 className="text-2xl font-bold text-(--text-primary)">
              {title==="المعاملات"? "$" : ""}
              {value.toLocaleString()}
            </h3>
          </div>

          <div className={`${iconBg} w-10 h-10 p-2 rounded-full flex items-center justify-center`}>
            {icon}
          </div>

        </div>
      </div>

      {/* mini chart */}
      <div className="h-28 w-full">
        <ResponsiveContainer  width={"100%"} height={"100%"}>
          <AreaChart data={data} >
            
            <defs>
              <linearGradient id={gradientID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area 
              type="bumpX" 
              dataKey="value" 
              stroke={chartColor}  
              strokeWidth={2} 
              fill={`url(#${gradientID})`} 
              dot={false} 
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}