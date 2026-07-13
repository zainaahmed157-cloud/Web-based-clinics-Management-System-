import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import axiosInstance from '../../../../api/axiosInstance';

const COLORS = ['#1f2b6c', '#10b981', '#f59e0b'];

export default function AppointmentsPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [dashboardData, setDashboardData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [dashRes, bookingsRes] = await Promise.all([
          axiosInstance.get('/doctor-dashboard'),
          axiosInstance.get('/bookings/my-bookings'),
        ]);
        if (dashRes.data.success) setDashboardData(dashRes.data.data);
        if (bookingsRes.data.success && Array.isArray(bookingsRes.data.data)) setBookings(bookingsRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;

  const pieData = [
    { name: isRtl ? 'مكتملة' : 'Completed', value: completed },
    { name: isRtl ? 'مؤكدة' : 'Confirmed', value: confirmed },
    { name: isRtl ? 'قيد الانتظار' : 'Pending', value: pending },
  ].filter((d) => d.value > 0);

  const today = dashboardData?.todayAppointments || [];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'المواعيد' : 'Appointments'}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'نظرة شاملة على مواعيدك' : 'A complete overview of your appointments'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'مواعيد اليوم' : "Today's", value: today.length, icon: <Calendar size={18} className="text-white" />, bg: 'bg-[#1f2b6c]' },
          { label: isRtl ? 'مكتملة' : 'Completed', value: completed, icon: <CheckCircle size={18} className="text-white" />, bg: 'bg-emerald-600' },
          { label: isRtl ? 'مؤكدة' : 'Confirmed', value: confirmed, icon: <Clock size={18} className="text-white" />, bg: 'bg-amber-500' },
          { label: isRtl ? 'قيد الانتظار' : 'Pending', value: pending, icon: <Users size={18} className="text-white" />, bg: 'bg-purple-600' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-4 flex items-center gap-3 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border p-4 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'المواعيد الأسبوعية' : 'Weekly Appointments'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.weeklyPatients || []}>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
                <Bar dataKey="new" fill="#1f2b6c" radius={[6, 6, 6, 6]} barSize={12} />
                <Bar dataKey="exixiting" fill="#D7DCF4" radius={[6, 6, 6, 6]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border p-4 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'توزيع الحالات' : 'Case Distribution'}</h3>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد بيانات' : 'No data'}</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', background: 'var(--card-bg)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Today's appointments table */}
      <div className="rounded-2xl border shadow-[var(--shadow-soft)] overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'مواعيد اليوم' : "Today's Appointments"}</h3>
        </div>
        <div className="overflow-x-auto">
          {today.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد مواعيد اليوم' : 'No appointments today'}</div>
          ) : (
            <table className="w-full min-w-max text-xs sm:text-sm text-center">
              <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3">{isRtl ? 'الاسم' : 'Name'}</th>
                  <th className="px-4 py-3">{isRtl ? 'النوع' : 'Type'}</th>
                  <th className="px-4 py-3">{isRtl ? 'الوقت' : 'Time'}</th>
                  <th className="px-4 py-3">{isRtl ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {today.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-[var(--hover-bg)]" style={{ borderColor: 'var(--card-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{item.time}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
