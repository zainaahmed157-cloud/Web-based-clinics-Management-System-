export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  admin_id: string;
  details: string;
  created_at: string;
}

export interface AuditStats {
  total: number;
}
