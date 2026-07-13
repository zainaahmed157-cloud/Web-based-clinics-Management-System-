import type { Notification } from '../types/api';

export async function fetchNotificationsClient(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
  try {
    const res = await fetch('/api/notifications', { credentials: 'include' });
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch' };
  }
}
