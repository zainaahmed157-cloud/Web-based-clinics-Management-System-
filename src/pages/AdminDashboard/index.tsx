

import DashboardHeader from "./dashboardHeader/DashboardHeader";
import AppointsmentRequests from "./features/appointments/AppointsmentRequests";
import VisitsGauge from "./components/charts/VisitsGauge";
import DoctorsList from "./features/doctors/doctorsList";
import DepartmentsChart from "./components/charts/DepartmentsChart";
import PatientsTable from "./features/clinics/PatientsTable";
import AppointmentsTable from "./features/appointments/AppointmentsTable";
import AnalyticsLineChart from "./components/charts/AnalyticsLineChart";
import MiniStatsCard from "./components/ui/MiniStatsCard";
import CalendarWidget from "./components/ui/CalendarWidget";
import { useLocale } from "@/lib/hooks";
import { t } from "@/i18n";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Users,
  User,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

function Dashboard({ childern }: { childern: React.ReactNode }) {
  const [range, setRange] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const locale = useLocale();
  const isRtl = locale === "ar";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/admin-stats", {
          credentials: "include",
        });
        const result = await response.json();
        if (result?.success || result?.status === "success") {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const weeklyData = [
    { date: "2026-01-25", exixiting: 40, new: 20 },
    { date: "2026-01-26", exixiting: 50, new: 30 },
    { date: "2026-01-27", exixiting: 45, new: 25 },
    { date: "2026-01-28", exixiting: 60, new: 35 },
    { date: "2026-01-29", exixiting: 38, new: 22 },
    { date: "2026-01-30", exixiting: 55, new: 28 },
    { date: "2026-01-31", exixiting: 65, new: 32 },
  ];

  const filteredData = weeklyData.filter((item) => {
    if (!range?.from || !range?.to) return true;
    const itemDate = new Date(item.date);
    return itemDate >= range.from && itemDate <= range.to;
  });
  const stats = dashboardData?.stats ?? dashboardData ?? {};

  return (
    <div className="flex w-full" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex w-full flex-col bg-(--background) min-h-screen transition-colors duration-300">
        <div className="p-6">
          <DashboardHeader range={range} setRange={setRange} />

          {/* Top Row: Main Analytics + Mini Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
            <div className="xl:col-span-8">
              <AnalyticsLineChart data={filteredData} />
            </div>
            <div className="xl:col-span-4 flex flex-col gap-4">
              <MiniStatsCard
                title={t("adminDash.totalDoctors", locale)}
                value={stats?.totalDoctors ?? 0}
                percentage={18}
                icon={<Stethoscope size={24} className="text-[#6A1B9A]" />}
                iconBg="bg-[#F3E8F9]"
              />
              <MiniStatsCard
                title={t("adminDash.totalPatients", locale)}
                value={stats?.totalPatients ?? 0}
                percentage={20}
                icon={<User size={24} className="text-[#1F6DB2]" />}
                iconBg="bg-[#E7F0F8]"
              />
              <MiniStatsCard
                title={t("adminDash.totalStaff", locale)}
                value={stats?.totalStaff ?? 0}
                percentage={5}
                icon={<ShieldCheck size={24} className="text-[#00796B]" />}
                iconBg="bg-[#E0F2F1]"
              />
              <MiniStatsCard
                title="مواعيد اليوم"
                value={124}
                percentage={-2}
                icon={<CalendarDays size={24} className="text-[#EB642F]" />}
                iconBg="bg-[#FDECE5]"
              />
            </div>
          </div>

          {/* Middle Row: Donut Chart, Gauge, Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <VisitsGauge male={69} female={56} total={80} />
            </div>
            <div className="lg:col-span-1">
              <DepartmentsChart />
            </div>
            <div className="lg:col-span-1">
              <CalendarWidget />
            </div>
          </div>

          {/* Bottom Row: Lists and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AppointsmentRequests requests={dashboardData?.pendingRequests} />
            <DoctorsList doctors={dashboardData?.doctors} />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <PatientsTable patients={dashboardData?.patients} />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <AppointmentsTable appointments={dashboardData?.recentBookings} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
