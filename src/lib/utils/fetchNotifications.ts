import type { Notification } from '../types/api';
import axiosInstance from '../../api/axiosInstance';

export async function fetchNotificationsClient(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
  try {
    const res = await axiosInstance.get('/api/notifications/me');
    let data = res.data;
    if (data && data.data) {
      data = data.data;
    }
    const list = Array.isArray(data) ? data : data?.notifications || [];
    return { success: true, data: list };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || err.message || 'Failed to fetch' };
  }
}
