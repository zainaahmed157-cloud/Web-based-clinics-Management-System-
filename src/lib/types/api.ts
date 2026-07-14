export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface AuditLog {
  id?: string | number;
  log_id?: string | number;
  action?: string;
  method?: string;
  path?: string;
  status_code?: number | null;
  level?: string;
  timestamp?: string;
  created_at?: string;
  actor_id?: string | number;
  actor_user_id?: string | number;
  user_id?: string | number;
  actor_name?: string;
  actor_email?: string;
  actor_role?: string;
  ip_address?: string;
  ip?: string;
  ip_location?: {
    city?: string;
    region?: string;
    country?: string;
  };
  body?: unknown;
  details?: string | Record<string, unknown>;
  response_time_ms?: number;
  duration_ms?: number;
  admin_id?: string;
}

export interface AuditStats {
  total?: number;
  total_logs?: number;
  total_info_logs?: number;
  total_error_logs?: number;
  total_success_logs?: number;
  total_failed_logs?: number;
  failed?: number;
  errors?: number;
  success?: number;
  info?: number;
}
