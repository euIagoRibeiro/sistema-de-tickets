import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Clock, Paperclip, Send, MoreVertical, Mail, MessageSquare, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Ticket, STATUS_LABELS, Status } from '../types';

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const { tickets, addMessage, updateStatus, user, deleteTicket } = useAppContext();
  const ticket = tickets.find(t => t.id === ticketId);
  
  const [replyText, setReplyText] = useState('');
  const [replyType, setReplyType] = useState<'email' | 'internal_note'>('email');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  if (!ticket) return <div>Chamado não encontrado</div>;

  const handleSend = () => {
    if (!replyText.trim()) return;
    addMessage(ticket.id, replyText, replyType);
    setReplyText('');
  };

  const handleDelete = () => {
    if(window.confirm('Tem certeza que deseja excluir este chamado atual?')) {
        deleteTicket(ticket.id);
        onBack();
    }
  };

  const isCritical = ticket.priority === 'Critical';

  return (
    <div className="flex flex-col h-full bg-white md:rounded-tl-2xl overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white z-20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 mr-2">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                <h2 className="font-bold text-slate-800 text-lg truncate">{ticket.subject}</h2>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                #{ticket.id} • {ticket.requester.name} • 
                <span className="flex items-center gap-1">
                    <Clock size={10} /> Prazo: {new Date(ticket.slaDeadline).toLocaleDateString()}
                </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
            <div className="hidden md:block">
                <select 
                    value={ticket.status} 
                    onChange={(e) => updateStatus(ticket.id, e.target.value as any)}
                    className="bg-slate-100 border-none text-sm font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-700 outline-none"
                >
                    {(Object.keys(STATUS_LABELS) as Status[]).map(key => (
                        <option key={key} value={key}>{STATUS_LABELS[key]}</option>
                    ))}
                </select>
            </div>
            
            {/* Context Menu */}
            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                >
                    <MoreVertical size={20} />
                </button>
                {isMenuOpen && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden py-1">
                        <button 
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                            <Trash2 size={16} /> Excluir
                        </button>
                    </div>
                    </>
                )}
            </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar pb-20 md:pb-6">
                {/* Initial Description as a message */}
                <div className="flex justify-start">
                    <div className="max-w-[90%] md:max-w-[70%]">
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-2">
                                {ticket.requester.name} 
                                <span className="font-normal text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">criou o chamado</span>
                            </p>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 ml-2 block">{new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>

                {ticket.messages.map((msg) => {
                    const isMe = msg.senderId === user?.id || msg.senderId === 'op-1'; // Check if sent by operator
                    const isInternal = msg.type === 'internal_note';
                    
                    return (
                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[90%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div 
                                    className={`p-4 rounded-2xl shadow-sm text-sm relative leading-relaxed ${
                                        isInternal 
                                            ? 'bg-amber-50 border border-amber-200 text-amber-900' // Internal Note
                                            : isMe 
                                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' // Operator Reply
                                                : 'bg-white border border-slate-200 rounded-tl-none text-slate-700' // Client Reply
                                    }`}
                                >
                                    {isInternal && (
                                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide border-b border-amber-200/50 pb-1">
                                            <MoreVertical size={10} /> Nota Interna
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 mx-2 block">
                                    {isMe ? 'Você' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                             </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
                <div className="flex items-center gap-3 mb-3">
                    <button 
                        onClick={() => setReplyType('email')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors border ${replyType === 'email' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}
                    >
                        <Mail size={14} /> Resposta Pública
                    </button>
                    <button 
                         onClick={() => setReplyType('internal_note')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors border ${replyType === 'internal_note' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}
                    >
                        <MessageSquare size={14} /> Nota Interna
                    </button>
                </div>
                
                <div className={`border rounded-xl p-2 focus-within:ring-2 transition-all shadow-sm ${replyType === 'internal_note' ? 'bg-amber-50/50 border-amber-200 ring-amber-400' : 'bg-white border-slate-300 ring-indigo-500'}`}>
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={replyType === 'internal_note' ? "Adicionar nota interna (visível apenas para a equipe)..." : "Escreva uma resposta para o cliente..."}
                        className={`w-full bg-transparent border-none focus:ring-0 text-base p-2 min-h-[80px] resize-none text-slate-800 placeholder-slate-400 ${replyType === 'internal_note' ? 'placeholder-amber-700/50 text-amber-900' : ''}`}
                    />
                    <div className="flex justify-between items-center px-2 pb-1">
                        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <Paperclip size={18} />
                        </button>
                        <button 
                            onClick={handleSend}
                            disabled={!replyText.trim()}
                            className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                                replyType === 'internal_note' 
                                    ? 'bg-amber-600 hover:bg-amber-700' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Send size={16} />
                            {replyType === 'internal_note' ? 'Salvar Nota' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Info Sidebar (Desktop Only) */}
        <div className="w-80 bg-white border-l border-slate-200 p-6 hidden lg:block overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Detalhes do Chamado</h3>
            
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitante</label>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {ticket.requester.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{ticket.requester.name}</p>
                            <p className="text-xs text-slate-500 truncate">{ticket.requester.email}</p>
                        </div>
                    </div>
                    {ticket.requester.whatsapp && (
                        <div className="mt-3 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-md inline-block font-medium border border-green-200">
                             WhatsApp: {ticket.requester.whatsapp}
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Em Cópia (CC)</label>
                    <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">{ticket.ccEmails.length > 0 ? ticket.ccEmails.join(', ') : 'Ninguém'}</p>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anexos</label>
                    <div className="mt-2 space-y-2">
                        {ticket.attachments.length > 0 ? ticket.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                                <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Paperclip size={16} />
                                </div>
                                <span className="text-sm text-slate-600 font-medium truncate">{file.name}</span>
                            </div>
                        )) : <p className="text-sm text-slate-400 italic mt-1">Sem anexos</p>}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TicketDetail;