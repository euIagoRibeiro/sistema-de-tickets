import React, { useState } from 'react';
import { X, Upload, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Priority, PRIORITY_LABELS } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose }) => {
  const { createTicket } = useAppContext();
  
  const initialFormState = {
    subject: '',
    description: '',
    priority: 'Medium' as Priority,
    requesterName: '',
    requesterEmail: '',
    requesterWhatsapp: '',
    ccEmails: '',
    slaDate: '',
    slaTime: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine Date/Time for SLA
    const slaDeadline = new Date(`${formData.slaDate}T${formData.slaTime}`).toISOString();
    
    // Create new ticket
    createTicket({
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      requesterName: formData.requesterName,
      requesterEmail: formData.requesterEmail,
      requesterWhatsapp: formData.requesterWhatsapp,
      ccEmails: formData.ccEmails.split(',').map(e => e.trim()).filter(e => e),
      slaDeadline,
    });

    setFormData(initialFormState);
    onClose();
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900 text-base placeholder-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">
            Novo Chamado
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Requester Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Solicitante</label>
                    <input 
                        required
                        type="text" 
                        className={inputClass}
                        value={formData.requesterName}
                        onChange={e => setFormData({...formData, requesterName: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        required
                        type="email" 
                        className={inputClass}
                        value={formData.requesterEmail}
                        onChange={e => setFormData({...formData, requesterEmail: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (Opcional)</label>
                    <input 
                        type="tel" 
                        className={inputClass}
                        value={formData.requesterWhatsapp}
                        onChange={e => setFormData({...formData, requesterWhatsapp: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emails em Cópia (CC)</label>
                    <input 
                        type="text" 
                        placeholder="separados, por, virgula"
                        className={inputClass}
                        value={formData.ccEmails}
                        onChange={e => setFormData({...formData, ccEmails: e.target.value})}
                    />
                </div>
            </div>

            <hr className="border-slate-100 my-2"/>

            {/* Ticket Details */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
                <input 
                    required
                    type="text" 
                    className={inputClass}
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                    <select 
                        className={inputClass}
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                    >
                        {(Object.keys(PRIORITY_LABELS) as Priority[]).map(key => (
                            <option key={key} value={key}>{PRIORITY_LABELS[key]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Prazo (SLA)</label>
                    <input 
                        required
                        type="date" 
                        className={inputClass}
                        style={{ colorScheme: 'light', cursor: 'pointer' }}
                        value={formData.slaDate}
                        onChange={e => setFormData({...formData, slaDate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora Prazo</label>
                    <input 
                        required
                        type="time" 
                        className={inputClass}
                        style={{ colorScheme: 'light', cursor: 'pointer' }}
                        value={formData.slaTime}
                        onChange={e => setFormData({...formData, slaTime: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
                <textarea 
                    required
                    rows={4}
                    className={inputClass}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
            </div>

            {/* File Dropzone Simulation */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50">
                <Upload size={24} className="mb-2 text-indigo-500" />
                <span className="text-sm font-medium">Clique ou arraste arquivos aqui</span>
            </div>

            <div className="flex justify-end pt-4 gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
                >
                    <Send size={18} />
                    Criar Chamado
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;