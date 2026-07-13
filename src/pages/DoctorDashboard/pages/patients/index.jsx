import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import axiosInstance from '../../../../api/axiosInstance';

const getDeptColor = (dept) => {
  if (!dept) return 'bg-gray-100 text-gray-600';
  const d = dept.toLowerCase();
  if (d.includes('orthopedics') || d.includes('عظام')) return 'bg-orange-100 text-orange-600';
  if (d.includes('cardiology') || d.includes('قلب')) return 'bg-blue-100 text-blue-600';
  if (d.includes('dermatology') || d.includes('جلد')) return 'bg-purple-100 text-purple-600';
  return 'bg-gray-100 text-gray-600';
};

export default function PatientsPage() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/doctor-dashboard')
      .then(({ data }) => { if (data.success) setPatients(data.data?.patients || []); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" dir={isEnglish ? "ltr" : "rtl"}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t("patients.title")}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{filtered.length} {t("patients.count")}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("patients.search")}
            className={`w-full py-2 rounded-xl border text-sm focus:outline-none ${isEnglish ? "pl-10 pr-4" : "pr-10 pl-4"
              }`}
            style={{ borderColor: 'var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
          />
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 ${isEnglish ? "left-3" : "right-3"
              }`}
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f2b6c]" /></div>
      ) : (
        <div className="rounded-2xl border shadow-[var(--shadow-soft)] overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--hover-bg)' }}>
                <Users size={28} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t("patients.noPatients")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">{t("patients.name")}</th>
                    <th className="px-4 py-3 text-left">{t("patients.gender")}</th>
                    <th className="px-4 py-3 text-left">{t("patients.department")}</th>
                    <th className="px-4 py-3 text-left">{t("patients.lastVisit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={i} className="border-t cursor-pointer hover:bg-[var(--hover-bg)] transition" style={{ borderColor: 'var(--card-border)' }}
                      onClick={() => navigate(`/doctor-dashboard/patients/${i + 1}`)}>
                      <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{i + 1}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.gender}</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDeptColor(p.department)}`}>{p.department}</span></td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
