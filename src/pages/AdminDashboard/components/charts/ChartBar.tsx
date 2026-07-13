
import { useState } from "react";
import { BarChart , Bar , XAxis , YAxis , Tooltip , ResponsiveContainer  , CartesianGrid} from "recharts";
import { format } from "date-fns";

interface props{
    data :any[];
}

export default function ChartBar({data}:props) {
  const [New , setNew] = useState(false)
  const [old , setOld] = useState(false)

  let totall = 0
  const filteredData = data.map((item)=>{
    if(New){
      totall = totall + item.new
    }else if(old){
      totall = totall + item.exixiting
    }else{
      totall = totall + (item.exixiting + item.new )
    }
  })

  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-xl shadow-sm overflow-hidden">
      
      <div className="flex flex-col gap-4 border-b-2 border-(--card-border) p-6 sm:flex-row sm:items-center sm:justify-between">
        <button 
          onClick={()=> {setNew(false) , setOld(false)}} 
          className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500"
        >
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          إحصائيات المرضى
        </h1>
      </div>

      {/* title */}
      <div className="flex flex-col gap-4 mb-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        
        <div className=" flex items-center gap-3 ">
          
          <div onClick={()=>{setNew(true) , setOld(false) }} className=" flex items-center gap-1  cursor-pointer " >
            <span className={` rounded-full bg-[#1F2B6C]  ${New ? "outline-1 border-2 border-white p-1" : "p-1.5 "}  `} ></span>
            <p className="text-(--text-primary)]">المرضى الجدد</p> 
          </div>

          <div onClick={()=>{ setOld(true) , setNew(false) }} className=" flex items-center gap-1 cursor-pointer">
            <span className={` rounded-full bg-[#D7DCF4] ${old ? "outline-1 border-2 border-white p-1" : "p-1.5 "} `}></span>
            <p className="text-(--text-primary)">المرضى القدامى</p> 
          </div>

        </div>

        <h3 className=" text-lg font-bold text-(--text-primary)">
          {totall} : إجمالي عدد المرضى
        </h3>
      </div>

      {/* Chart */}
      <div className=" h-72">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={30} barGap={-28}>
                
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="var(--card-border)" />

                <XAxis 
                  reversed 
                  dataKey="date" 
                  tickMargin={5} 
                  tick={{fontSize:12 ,fill: "var(--text-secondary)"  }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value)=>format(new Date(value) , "dd MMM")} 
                />

                <YAxis  
                  orientation="right" 
                  tick={{fontSize:12 ,fill: "var(--text-secondary)"}} 
                  axisLine={false} 
                  tickLine={false} 
                />

                <Tooltip 
                  cursor={{fill :"rgba(0,0,0,0.02)"}} 
                  contentStyle={{
                    borderRadius:"12px",
                    border:"none",
                    background:"var(--card-bg)",
                    color:"var(--text-primary)"
                  }} 
                />

                {/* الفاتح */}
                <Bar 
                  dataKey="exixiting" 
                  className={`${ New? "hidden" : "" }  duration-300`}  
                  fill="#D7DCF4" 
                  barSize={28} 
                  radius={[6,6,6,6]} 
                />

                {/* الغامق */}
                <Bar 
                  dataKey="new" 
                  className={` ${ old?"hidden" : "" }  duration-300`}  
                  fill="#1F2B6C" 
                  barSize={28} 
                  radius={[6,6,6,6]} 
                />

            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}