import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, User, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from './components/ui/StatsCard';
import DashboardHeader from './dashboardHeader/DashboardHeader';
import ChartBar from './components/charts/ChartBar';
import AppointmentRequests from './features/appointments/AppointmentRequests';
import VisitsGauge from './components/charts/VisitsGauge';
import TodayAppointments from './features/doctors/TodayAppointments';
import PatientReport from './features/patient/PatientReport';
import PatientsTable from './features/patient/PatientsTable';
import AppointmentsTable from './features/appointments/AppointmentsTable';
import axiosInstance from '../../api/axiosInstance';

export default function DoctorDashboardHome() {
  const [range, setRange] = useState();
  const [dashboardData, setDashboardData] = useState(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    let active = true;
    axiosInstance.get('/api/doctors/dashboard')
      .then(({ data }) => {
        if (active && (data.status === 'success' || data.success)) {
          setDashboardData(data.dashboard || data.data);
        }
      })
      .catch((err) => console.error('Failed to load doctor dashboard', err));
    return () => { active = false; };
  }, []);

  const chartData = useMemo(() =>
    dashboardData?.weeklyPatients?.length ? dashboardData.weeklyPatients : [],
    [dashboardData]
  );

  const filteredData = chartData.filter((item) => {
    if (!range?.from || !range?.to) return true;
    const d = new Date(item.date);
    return d >= range.from && d <= range.to;
  });

  const appointmentCard = dashboardData?.cards?.appointments;
  const patientCard = dashboardData?.cards?.patients;

  return (
    <div className="flex w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex w-full flex-col min-h-screen transition-colors duration-300" style={{ background: 'var(--background)' }}>
        <div className="space-y-4">
          {/* Header */}
          <div className="rounded-2xl border shadow-[var(--shadow-soft)] px-4 py-3 sm:px-5 sm:py-4" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
            <DashboardHeader range={range} setRange={setRange} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <StatsCard
              title={isRtl ? 'المواعيد' : 'Appointments'}
              value={appointmentCard?.value ?? 0}
              percentage={appointmentCard?.percentage ?? 0}
              icon={<Calendar size={18} strokeWidth={2} className="text-white" />}
              iconBg="bg-[#E65100]"
              chartColor="#E65100"
              data={appointmentCard?.trend ?? [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]}
            />
            <StatsCard
              title={isRtl ? 'إجمالي المرضى' : 'Total Patients'}
              value={patientCard?.value ?? 0}
              percentage={patientCard?.percentage ?? 0}
              icon={<User size={18} strokeWidth={2} className="text-white" />}
              iconBg="bg-[#001A6E]"
              chartColor="#001A6E"
              data={patientCard?.trend ?? [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]}
            />
          </div>

          {/* Charts + Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="lg:col-span-1">
              <ChartBar data={filteredData} />
            </div>
            <AppointmentRequests appointments={dashboardData?.appointmentRequests?.slice(0, 5)} />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <VisitsGauge
              male={dashboardData?.genderStats?.male ?? 0}
              female={dashboardData?.genderStats?.female ?? 0}
              total={dashboardData?.genderStats?.total ?? 0}
            />
            <TodayAppointments appointments={dashboardData?.todayAppointments?.slice(0, 5)} />
            <PatientsTable patients={dashboardData?.patients?.slice(0, 5)} />
          </div>

          {/* Reports */}
          <div className="grid grid-cols-1 gap-5">
            <PatientReport reports={dashboardData?.reports?.slice(0, 5)} doctorName={dashboardData?.doctor?.full_name} />
          </div>

          {/* Appointments Table */}
          <div className="grid grid-cols-1 gap-5">
            <AppointmentsTable appointments={dashboardData?.appointments?.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}
