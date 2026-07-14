import axiosInstance from "../../../../api/axiosInstance";

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
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  const fullUrl = `${url}?${params.toString()}`;
  const { data, headers } = await axiosInstance.get(fullUrl);
  const totalHeader = headers['x-total-count'] as string | undefined;
  const items = Array.isArray(data) ? data : [];
  const total = totalHeader ? parseInt(totalHeader, 10) : items.length;
  return { items, total };
}
