import { Ticket, User } from './types';

export const MOCK_USER: User = {
  id: 'op-1',
  name: 'Alex Operador',
  email: 'alex@empresa.com.br',
  role: 'operator',
  avatar: 'https://picsum.photos/200/200',
};

const now = new Date();
const hour = 60 * 60 * 1000;

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'CHM-1001',
    subject: 'Não consigo acessar a VPN remotamente',
    description: 'Estou tentando conectar na VPN com as novas credenciais mas recebo erro 403.',
    status: 'Open',
    priority: 'High',
    createdAt: new Date(now.getTime() - 2 * hour).toISOString(),
    slaDeadline: new Date(now.getTime() + 2 * hour).toISOString(), // Expiring soon
    requester: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@cliente.com',
      whatsapp: '+5511999999999',
    },
    ccEmails: ['gerente@cliente.com'],
    attachments: [{ name: 'erro_print.png', type: 'image/png', size: '1.2MB' }],
    messages: [
      {
        id: 'msg-1',
        senderId: 'sarah.j@cliente.com',
        senderName: 'Sarah Jenkins',
        content: 'Olá, não consigo acessar a VPN. Segue o print em anexo.',
        timestamp: new Date(now.getTime() - 2 * hour).toISOString(),
        type: 'email',
      },
    ],
  },
  {
    id: 'CHM-1002',
    subject: 'Solicitação de licença de software',
    description: 'Precisamos de uma licença do Figma para o novo designer que inicia semana que vem.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: new Date(now.getTime() - 24 * hour).toISOString(),
    slaDeadline: new Date(now.getTime() + 48 * hour).toISOString(),
    requester: {
      name: 'Mike Ross',
      email: 'mike.r@design.com',
    },
    ccEmails: [],
    attachments: [],
    messages: [
      {
        id: 'msg-1',
        senderId: 'mike.r@design.com',
        senderName: 'Mike Ross',
        content: 'Olá equipe, por favor liberar uma licença do Figma.',
        timestamp: new Date(now.getTime() - 24 * hour).toISOString(),
        type: 'email',
      },
      {
        id: 'msg-2',
        senderId: 'op-1',
        senderName: 'Alex Operador',
        content: 'Encaminhei para o financeiro aprovar. Retorno em breve.',
        timestamp: new Date(now.getTime() - 23 * hour).toISOString(),
        type: 'email',
      },
    ],
  },
  {
    id: 'CHM-1003',
    subject: 'Queda de servidor - Crítico',
    description: 'Servidor de produção US-East-1 não está respondendo.',
    status: 'Resolved',
    priority: 'Critical',
    createdAt: new Date(now.getTime() - 48 * hour).toISOString(),
    slaDeadline: new Date(now.getTime() - 40 * hour).toISOString(), // Expired
    requester: {
      name: 'Alerta de Sistema',
      email: 'alertas@sys.com',
    },
    ccEmails: ['cto@empresa.com'],
    attachments: [],
    messages: [
      {
        id: 'msg-1',
        senderId: 'alertas@sys.com',
        senderName: 'Alerta de Sistema',
        content: 'CRÍTICO: Heartbeat perdido em US-East-1.',
        timestamp: new Date(now.getTime() - 48 * hour).toISOString(),
        type: 'email',
      },
      {
        id: 'msg-2',
        senderId: 'op-1',
        senderName: 'Alex Operador',
        content: 'Serviços reiniciados. Monitorando.',
        timestamp: new Date(now.getTime() - 47 * hour).toISOString(),
        type: 'email',
      },
       {
        id: 'msg-3',
        senderId: 'op-1',
        senderName: 'Alex Operador',
        content: 'Resolvido. Causa raiz: Vazamento de memória no worker node.',
        timestamp: new Date(now.getTime() - 46 * hour).toISOString(),
        type: 'internal_note',
        isInternal: true,
      },
    ],
  },
];
