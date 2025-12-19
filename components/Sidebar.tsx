import React, { useState } from 'react';
import { LayoutDashboard, Inbox, BarChart2, LogOut, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, isOpen, setIsOpen }) => {
  const { logout, user } = useAppContext();

  const menuItems = [
    { id: 'dashboard', label: 'Todos os Chamados', icon: LayoutDashboard },
    { id: 'my_queue', label: 'Meus Chamados', icon: Inbox },
    { id: 'analytics', label: 'Relatórios', icon: BarChart2 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl md:shadow-none`}>
        
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight text-indigo-400">Sistema de Chamados</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão Interna</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4 px-2">
                <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
                <LogOut size={18} />
                Sair
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
