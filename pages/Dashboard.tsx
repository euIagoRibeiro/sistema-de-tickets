import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, AlertCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Ticket, Priority, Status, PRIORITY_LABELS, STATUS_LABELS } from '../types';
import CreateTicketModal from '../components/CreateTicketModal';

interface DashboardProps {
  onSelectTicket: (ticketId: string) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-blue-100 text-blue-800',
    High: 'bg-orange-100 text-orange-800',
    Critical: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const colors = {
    'Open': 'bg-blue-50 text-blue-600 border border-blue-200',
    'In Progress': 'bg-purple-50 text-purple-600 border border-purple-200',
    'Waiting Reply': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'Resolved': 'bg-green-50 text-green-600 border border-green-200',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};

const SLACountdown: React.FC<{ deadline: string }> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Expirado');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setIsUrgent(hours < 2);
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (isExpired) return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
        <AlertCircle size={12}/> Expirado
    </span>
  );

  return (
    <span className={`flex items-center gap-1 font-mono text-xs md:text-sm ${isUrgent ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
      <Clock size={14} />
      {timeLeft}
    </span>
  );
};

// Ticket Menu Component - Removed Edit Option
const TicketMenu: React.FC<{ ticket: Ticket; onDelete: (id: string) => void }> = ({ ticket, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsOpen(false); 
                if(window.confirm('Tem certeza que deseja excluir este chamado?')) onDelete(ticket.id); 
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onSelectTicket }) => {
  const { tickets, deleteTicket } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterLabels: Record<string, string> = {
    'All': 'Todos',
    'Open': 'Aberto',
    'In Progress': 'Em Andamento',
    'Waiting Reply': 'Aguardando',
    'Resolved': 'Resolvido'
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 custom-scrollbar pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Painel de Atendimento</h2>
          <p className="text-slate-500 text-sm">Gerencie solicitações e prazos</p>
        </div>
        <button 
          onClick={handleCreate}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm"
        >
          <Plus size={20} />
          Novo Chamado
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          
          {/* Scrollable Filters - CRITICAL FIX: overflow-x-auto, flex-nowrap, proper constraints, visible scrollbar */}
          <div className="w-full md:w-auto min-w-0">
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 md:pb-3 lg:pb-0 scrollbar-visible">
                {['All', 'Open', 'In Progress', 'Waiting Reply', 'Resolved'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                    filterStatus === status 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {filterLabels[status]}
                </button>
                ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar chamados..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 text-base placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Ticket List - Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalhes</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Solicitante</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prazo</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map(ticket => (
                <tr 
                  key={ticket.id} 
                  onClick={() => onSelectTicket(ticket.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group relative"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.subject}</span>
                      <span className="text-xs text-slate-500">#{ticket.id} • Criado em {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-800">{ticket.requester.name}</span>
                      <span className="text-xs text-slate-500">{ticket.requester.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <SLACountdown deadline={ticket.slaDeadline} />
                  </td>
                  <td className="px-6 py-4">
                    <TicketMenu ticket={ticket} onDelete={deleteTicket} />
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket List - Mobile/Tablet Cards Grid */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.99] transition-transform relative"
              >
                  <div className="absolute top-4 right-4">
                     <TicketMenu ticket={ticket} onDelete={deleteTicket} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-2 pr-8">
                      <div className="flex-1 mr-2">
                          <span className="text-xs text-slate-400 block mb-1">#{ticket.id}</span>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem]">{ticket.subject}</h3>
                      </div>
                  </div>
                  <div className="mb-3">
                     <StatusBadge status={ticket.status} />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex flex-col">
                          <span className="font-medium text-slate-700 truncate max-w-[120px]">{ticket.requester.name}</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <PriorityBadge priority={ticket.priority} />
                          <SLACountdown deadline={ticket.slaDeadline} />
                      </div>
                  </div>
              </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                Nenhum chamado encontrado.
            </div>
          )}
      </div>

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;