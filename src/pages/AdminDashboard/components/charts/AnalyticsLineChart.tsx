import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface Props {
  data: any[];
}

export default function AnalyticsLineChart({ data }: Props) {
  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden h-full flex flex-col">
      <div className="flex flex-col gap-4 border-b border-(--card-border) p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--text-primary)">
            تحليل البيانات (المرضى)
          </h1>
          <p className="text-sm text-(--text-secondary) mt-1">
            نظرة عامة على المرضى الجدد والقدامى خلال الأسبوع
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--card-border)"
              opacity={0.5}
            />

            <XAxis
              reversed
              dataKey="date"
              tickMargin={12}
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                try {
                  return format(new Date(value), "dd MMM");
                } catch {
                  return value;
                }
              }}
            />

            <YAxis
              orientation="right"
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
              tickCount={6}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                padding: "12px",
              }}
              labelStyle={{ color: "var(--text-secondary)", marginBottom: "8px" }}
              itemStyle={{ fontWeight: 600, padding: "2px 0" }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "13px", color: "var(--text-primary)" }}
            />

            <Line
              name="المرضى القدامى"
              type="monotone"
              dataKey="exixiting"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            <Line
              name="المرضى الجدد"
              type="monotone"
              dataKey="new"
              stroke="#0EA5E9"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
