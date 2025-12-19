export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Waiting Reply' | 'Resolved';
export type MessageType = 'email' | 'internal_note';
export type UserRole = 'admin' | 'operator';

export const PRIORITY_LABELS: Record<Priority, string> = {
  Low: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
  Critical: 'Crítica'
};

export const STATUS_LABELS: Record<Status, string> = {
  'Open': 'Aberto',
  'In Progress': 'Em Andamento',
  'Waiting Reply': 'Aguardando',
  'Resolved': 'Resolvido'
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
}

export interface Attachment {
  name: string;
  type: string;
  size: string;
}

export interface Message {
  id: string;
  senderId: string; // 'system', 'operator-id', or 'client-email'
  senderName: string;
  content: string;
  timestamp: string; // ISO string
  type: MessageType;
  isInternal?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  slaDeadline: string; // ISO string
  createdAt: string; // ISO string
  requester: {
    name: string;
    email: string;
    whatsapp?: string;
  };
  ccEmails: string[];
  attachments: Attachment[];
  messages: Message[];
}

export interface NewTicketPayload {
  subject: string;
  description: string;
  priority: Priority;
  slaDeadline: string;
  requesterEmail: string;
  requesterName: string;
  requesterWhatsapp?: string;
  ccEmails: string[];
}

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
