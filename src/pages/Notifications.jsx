import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');

  const getLocalizedTitle = (title) => {
    if (!title) return title;
    if (!isEnglish) return title;
    
    if (title.includes('تم إلغاء الحجز تلقائياً') || title.includes('تم الغاء الحجز تلقائيا')) return 'Reservation Auto-Cancelled';
    if (title.includes('تم تأكيد حجزك')) return 'Reservation Confirmed';
    if (title.includes('تم الحجز بنجاح')) return 'Reservation Successful';
    if (title.includes('تذكير بموعد الحجز')) return 'Appointment Reminder';
    if (title.includes('تم إلغاء الحجز')) return 'Reservation Cancelled';
    
    return title;
  };

  const getLocalizedMessage = (message) => {
    if (!message) return message;
    if (!isEnglish) return message;
    
    let msg = message;
    if (msg.includes('تم إلغاء حجزك لعدم الحضور في الموعد المحدد (مرور أكثر من 30 دقيقة)')) {
      return 'Your reservation was cancelled due to no-show at the scheduled time (exceeded 30 minutes).';
    }
    if (msg.includes('تم تأكيد حجزك مع')) {
      msg = msg.replace('تم تأكيد حجزك مع', 'Your reservation with');
      msg = msg.replace('بتاريخ', 'on');
      msg = msg.replace('من', 'from');
      msg = msg.replace('حتى', 'to');
      return msg;
    }
    
    return msg;
  };

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/notifications/me');
      
      // Normalize data based on Medaura backend response structure
      let data = res.data;
      if (data && data.data) {
        data = data.data;
      }
      
      let list = Array.isArray(data) ? data : data?.notifications || [];
      
      // Sort safely without mutating the original array, and handle missing dates
      const sortedList = [...list].sort((a, b) => {
        const dateA = a?.created_at || a?.createdAt;
        const dateB = b?.created_at || b?.createdAt;
        const timeA = dateA ? new Date(dateA).getTime() : 0;
        const timeB = dateB ? new Date(dateB).getTime() : 0;
        return timeB - timeA;
      });
      
      setNotifications(sortedList);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError(t('notificationsPage.error') + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    if (!id) return;
    try {
      // Try PATCH first
      try {
        await axiosInstance.patch(`/api/notifications/${id}/read`);
      } catch (err) {
        // Fallback to POST if PATCH is not supported
        await axiosInstance.post(`/api/notifications/read?id=${id}`);
      }
      
      setNotifications(prev => prev.map(n => {
        const nId = n.id || n.notification_id || n._id;
        if (nId === id) {
          return { ...n, read: true, is_read: true };
        }
        return n;
      }));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => !(n.read || n.is_read))
      .map(n => n.id || n.notification_id || n._id)
      .filter(Boolean);
      
    if (unreadIds.length === 0) return;
    
    // We update UI optimistically
    setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
    window.dispatchEvent(new Event('notificationsUpdated'));
    
    // Then fire API calls
    for (const id of unreadIds) {
      try {
        await axiosInstance.patch(`/api/notifications/${id}/read`);
      } catch (e) {
        try {
          await axiosInstance.post(`/api/notifications/read?id=${id}`);
        } catch(err) {}
      }
    }
  };

  return (
    <main dir={isEnglish ? "ltr" : "rtl"} className="min-h-screen bg-slate-50 pt-28 pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f1a4f] mb-2 flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              {t('notificationsPage.title')}
            </h1>
            <p className="text-slate-500 font-medium">
              {t('notificationsPage.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              {isEnglish ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {t('notificationsPage.backHome')}
            </Link>
            
            {notifications.some(n => !(n.read || n.is_read)) && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-semibold text-blue-700 hover:text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm"
              >
                <Check className="w-4 h-4" />
                {t('notificationsPage.markAllRead')}
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">{t('notificationsPage.loading')}</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-medium bg-red-50">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {t('notificationsPage.noNotifications')}
              </h3>
              <p className="text-slate-500">
                {t('notificationsPage.noNotificationsDesc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification, idx) => {
                const isRead = notification.read || notification.is_read;
                const dateString = notification.created_at || notification.createdAt || notification.date;
                const dateObj = new Date(dateString);
                const isValidDate = dateString && !isNaN(dateObj.getTime());
                
                return (
                  <div 
                    key={notification.id || notification.notification_id || idx}
                    className={`p-5 sm:p-6 transition-colors flex gap-4 ${isRead ? 'bg-white' : 'bg-blue-50/40 hover:bg-blue-50'}`}
                  >
                    <div className="shrink-0 pt-1">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${isRead ? 'bg-slate-300' : 'bg-blue-600 ring-4 ring-blue-100'}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <h4 className={`text-base font-bold ${isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                          {getLocalizedTitle(notification.title) || t('notificationsPage.newNotification')}
                        </h4>
                      </div>
                      <p className={`text-sm ${isRead ? 'text-slate-500' : 'text-slate-700 font-medium'} leading-relaxed`}>
                        {getLocalizedMessage(notification.message)}
                      </p>
                    </div>
                    
                    {!isRead && (
                      <div className="shrink-0 flex items-center">
                        <button 
                          onClick={() => markAsRead(notification.id || notification.notification_id || notification._id)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm"
                          title={t('notificationsPage.markAsRead')}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}
