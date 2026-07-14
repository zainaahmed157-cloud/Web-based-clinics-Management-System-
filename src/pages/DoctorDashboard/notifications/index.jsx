import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, RefreshCw, CheckCircle2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../api/axiosInstance';

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true); setError(null);
      const { data } = await axiosInstance.get('/api/notifications/me');
      if (data.status !== 'success' && !data.success) throw new Error(data.error || 'Failed to load notifications');
      const list = data.notifications || data.data || [];
      const items = Array.isArray(list) ? list.map(item => ({
        id: item.notification_id || item.id,
        title: item.title,
        message: item.message,
        read: Boolean(item.is_read !== undefined ? item.is_read : item.read),
        created_at: item.created_at,
      })) : [];
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageNotifications = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1));
    const end = Math.min(totalPages, start + maxButtons - 1);
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [page, totalPages]);

  const formatTime = (createdAt) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: isRtl ? ar : enUS });
    } catch { return ''; }
  };

  const markRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await axiosInstance.patch(`/api/notifications/${id}/read`).catch(() => {});
  }, []);

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(unread.map((n) => axiosInstance.patch(`/api/notifications/${n.id}/read`).catch(() => {})));
  }, [notifications]);

  return (
    <div className="space-y-6 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Title + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'الإشعارات' : 'Notifications'}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'تابع كل تنبيهاتك هنا' : 'Stay on top of your alerts'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadNotifications} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
            <RefreshCw size={16} />{isRtl ? 'تحديث' : 'Refresh'}
          </button>
          <button onClick={markAllRead} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
            <CheckCircle2 size={16} />{isRtl ? 'تحديد الكل كمقروء' : 'Mark all read'}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border p-4 flex flex-col gap-2" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'إجمالي الإشعارات' : 'Total Notifications'}</p>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{notifications.length}</div>
        </div>
        <div className="rounded-2xl border p-4 flex flex-col gap-2" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'غير مقروءة' : 'Unread'}</p>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{unreadCount}</div>
        </div>
        <div className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
          <div className="flex flex-col gap-1">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'آخر نشاط' : 'Last Activity'}</p>
            <div className="text-sm font-semibold max-w-[180px] truncate" style={{ color: 'var(--text-primary)' }}>
              {notifications[0]?.title || (isRtl ? 'لا توجد إشعارات حديثة' : 'No recent notifications')}
            </div>
          </div>
          <Bell size={24} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-2xl p-1.5 border max-w-md" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {[
          { key: 'all', label: `${isRtl ? 'الكل' : 'All'} (${notifications.length})` },
          { key: 'unread', label: `${isRtl ? 'غير مقروء' : 'Unread'} (${unreadCount})` },
          { key: 'read', label: `${isRtl ? 'مقروء' : 'Read'} (${notifications.length - unreadCount})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => { setFilter(tab.key); setPage(1); }}
            className="flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{ background: filter === tab.key ? '#1f2b6c' : 'transparent', color: filter === tab.key ? 'white' : 'var(--text-secondary)' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
        <div className={`border-b px-6 py-4 flex items-center justify-between gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`} style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{isRtl ? 'كل الإشعارات' : 'All Notifications'}</h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{isRtl ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
        </div>

        {loading && <div className="px-6 py-8 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'جارٍ التحميل...' : 'Loading...'}</div>}
        {!loading && error && <div className="px-6 py-8 text-sm text-red-500 text-center">{error}</div>}
        {!loading && !error && pageNotifications.length === 0 && (
          <div className="px-6 py-8 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>{isRtl ? 'لا توجد إشعارات' : 'No notifications'}</div>
        )}

        {!loading && !error && pageNotifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 px-6 py-4 border-b last:border-b-0 transition-colors`}
            style={{ borderColor: 'var(--card-border)', background: n.read ? 'transparent' : 'var(--semi-card-bg)', opacity: n.read ? 0.75 : 1 }}>
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-[#1f2b6c]/10 flex items-center justify-center">
                <Bell size={18} style={{ color: '#1f2b6c' }} />
              </div>
              {!n.read && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#1f2b6c] rounded-full ring-2 ring-white" />}
            </div>
            <div className="flex-1 min-w-0 text-start">
              <div className={`flex items-center justify-between gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{formatTime(n.created_at)}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className={`mt-2 text-xs font-semibold text-[#1f2b6c] hover:underline flex items-center gap-1 cursor-pointer ${isRtl ? 'ml-auto' : 'mr-auto'}`}>
                  <Check size={12} />{isRtl ? 'تحديد كمقروء' : 'Mark as read'}
                </button>
              )}
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className={`flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} style={{ borderColor: 'var(--card-border)' }}>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-[var(--semi-card-bg)] transition" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {isRtl ? 'التالي' : 'Next'}
            </button>
            <div className="flex items-center gap-2">
              {pageNumbers.map((pn) => (
                <button key={pn} onClick={() => setPage(pn)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold border cursor-pointer transition"
                  style={{ borderColor: 'var(--card-border)', background: pn === page ? '#1f2b6c' : 'var(--card-bg)', color: pn === page ? 'white' : 'var(--text-primary)' }}>
                  {pn}
                </button>
              ))}
            </div>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-[var(--semi-card-bg)] transition" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {isRtl ? 'السابق' : 'Previous'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
