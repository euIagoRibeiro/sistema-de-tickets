import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Toast: React.FC = () => {
  const { toast, hideToast } = useAppContext();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />
  };

  const borderColors = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500'
  };

  return (
    <div className={`fixed z-[100] bottom-4 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-auto md:top-6 md:right-6 flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-xl border border-slate-100 ${borderColors[toast.type]} animate-slide-up md:animate-slide-left min-w-[300px]`}>
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
      <button onClick={hideToast} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
