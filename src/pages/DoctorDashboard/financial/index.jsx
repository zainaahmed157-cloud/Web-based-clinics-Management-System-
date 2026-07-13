import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axiosInstance from '../../../api/axiosInstance';

export default function FinancialPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/financial/doctor-earnings')
      .then(({ data: d }) => { if (d.success) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = data?.totalEarnings || 0;
  const monthlyData = data?.monthlyData || [];
  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الإدارة المالية' : 'Financial Management'}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'تتبع أرباحك وإيراداتك' : 'Track your earnings and revenue'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition" style={{ background: '#1f2b6c' }}>
          <Download size={16} />{isRtl ? 'تصدير' : 'Export'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: isRtl ? 'إجمالي الأرباح' : 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: <DollarSign size={18} className="text-white" />, bg: 'bg-[#1f2b6c]' },
          { label: isRtl ? 'هذا الشهر' : 'This Month', value: `$${(data?.thisMonth || 0).toLocaleString()}`, icon: <TrendingUp size={18} className="text-white" />, bg: 'bg-emerald-600' },
          { label: isRtl ? 'المعاملات' : 'Transactions', value: transactions.length, icon: <DollarSign size={18} className="text-white" />, bg: 'bg-amber-500' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-5 shadow-[var(--shadow-soft)] flex items-center gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className={`${s.bg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border p-5 shadow-[var(--shadow-soft)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</h3>
        {monthlyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            {isRtl ? 'لا توجد بيانات' : 'No data available'}
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f2b6c" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1f2b6c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', background: 'var(--card-bg)', color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="amount" stroke="#1f2b6c" strokeWidth={2.5} fill="url(#earningsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border shadow-[var(--shadow-soft)] overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'سجل المعاملات' : 'Transaction History'}</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد معاملات' : 'No transactions yet'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-center">
              <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3">{isRtl ? 'المريض' : 'Patient'}</th>
                  <th className="px-4 py-3">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="px-4 py-3">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="px-4 py-3">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className="border-t hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{t.patient || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">${(t.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.date || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.status === 'paid' ? (isRtl ? 'مدفوع' : 'Paid') : (isRtl ? 'قيد الانتظار' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
