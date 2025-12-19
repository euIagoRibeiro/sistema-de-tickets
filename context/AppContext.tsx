import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, User, NewTicketPayload, Message, ToastData } from '../types';
import { INITIAL_TICKETS, MOCK_USER } from '../mockData';

interface AppContextType {
  user: User | null;
  tickets: Ticket[];
  toast: ToastData | null;
  login: (email: string) => void;
  logout: () => void;
  createTicket: (payload: NewTicketPayload) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addMessage: (ticketId: string, content: string, type: 'email' | 'internal_note') => void;
  updateStatus: (ticketId: string, status: Ticket['status']) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [toast, setToast] = useState<ToastData | null>(null);

  const login = (email: string) => {
    setUser({ ...MOCK_USER, email });
  };

  const logout = () => {
    setUser(null);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const hideToast = () => setToast(null);

  const createTicket = (payload: NewTicketPayload) => {
    const newTicket: Ticket = {
      id: `CHM-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: payload.subject,
      description: payload.description,
      status: 'Open',
      priority: payload.priority,
      createdAt: new Date().toISOString(),
      slaDeadline: payload.slaDeadline,
      requester: {
        name: payload.requesterName,
        email: payload.requesterEmail,
        whatsapp: payload.requesterWhatsapp,
      },
      ccEmails: payload.ccEmails,
      attachments: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'op-1',
          senderName: 'Sistema',
          content: `Chamado criado. Descrição: ${payload.description}`,
          timestamp: new Date().toISOString(),
          type: 'internal_note',
          isInternal: true
        }
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    showToast('Chamado criado com sucesso!');
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Chamado atualizado com sucesso!');
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    showToast('Chamado excluído.', 'info');
  };

  const addMessage = (ticketId: string, content: string, type: 'email' | 'internal_note') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: user?.id || 'op-1',
          senderName: user?.name || 'Operador',
          content,
          timestamp: new Date().toISOString(),
          type,
          isInternal: type === 'internal_note',
        };
        const newStatus = type === 'email' && t.status === 'Open' ? 'Waiting Reply' : t.status;
        
        return {
          ...t,
          status: newStatus,
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));
  };

  const updateStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    showToast(`Status alterado para ${status}`, 'info');
  };

  return (
    <AppContext.Provider value={{ 
      user, tickets, toast, 
      login, logout, createTicket, updateTicket, deleteTicket, 
      addMessage, updateStatus, showToast, hideToast 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
