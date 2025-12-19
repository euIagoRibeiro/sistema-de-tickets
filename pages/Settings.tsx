import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { user, showToast } = useAppContext();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    showToast('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
          <p className="text-slate-500 text-sm">Gerencie seu perfil e preferências</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" /> Perfil
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <img src={user?.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-100" />
              <div>
                <button className="text-sm text-indigo-600 font-medium hover:underline">Alterar Foto</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  defaultValue={user?.name} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-500" disabled />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" /> Preferências
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Bell size={18} /></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notificações por Email</p>
                    <p className="text-xs text-slate-500">Receber alertas sobre novos chamados</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Moon size={18} /></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Modo Escuro</p>
                    <p className="text-xs text-slate-500">Alterar aparência da interface</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
