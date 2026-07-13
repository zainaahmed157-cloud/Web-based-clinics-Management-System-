export type Appointment = {
  id: string;
  name: string;
  type: string;
  doctor: string;
  status: string;
  date: string;
};

export type ApiListResult = {
  items: Appointment[];
  total: number;
};

export async function fetchAppointmentsServer(url = '/api/appointments', page = 1, limit = 10): Promise<ApiListResult> {
  const q = new URL(url, 'http://localhost');
  q.searchParams.set('page', String(page));
  q.searchParams.set('limit', String(limit));
  const res = await fetch(q.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch appointments: ${res.status}`);
  const items = await res.json();
  const totalHeader = res.headers.get('X-Total-Count');
  const total = totalHeader ? parseInt(totalHeader, 10) : Array.isArray(items) ? items.length : 0;
  return { items, total };
}
