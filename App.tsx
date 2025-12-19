import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAppContext();
  // Simple state-based routing
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'my_queue' | 'analytics' | 'settings'
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return (
      <>
        <Toast />
        <Login />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Toast />
      <Sidebar 
        activeView={currentView} 
        onChangeView={(view) => {
            setCurrentView(view);
            setSelectedTicketId(null);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 mr-4">
                <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800">Sistema de Chamados</span>
        </div>

        {selectedTicketId ? (
          <TicketDetail 
            ticketId={selectedTicketId} 
            onBack={() => setSelectedTicketId(null)} 
          />
        ) : (
          <>
            {(currentView === 'dashboard' || currentView === 'my_queue') && <Dashboard onSelectTicket={setSelectedTicketId} />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'settings' && <Settings />}
          </>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
