import React from 'react';
import { BarChart2, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
        <TrendingUp size={12} /> {trend}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const { tickets } = useAppContext();

  // Mock Calculations
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const open = tickets.filter(t => t.status === 'Open').length;
  
  // Mock Chart Data
  const categoryData = [
    { label: 'Técnico', value: 65, color: 'bg-indigo-500' },
    { label: 'Financeiro', value: 45, color: 'bg-blue-500' },
    { label: 'Acesso', value: 30, color: 'bg-green-500' },
    { label: 'Outros', value: 15, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Relatórios e Métricas</h2>
        <p className="text-slate-500 text-sm">Visão geral da operação de suporte</p>
      </div>

      {/* Grid optimized for Tablet (md:2 cols) and Desktop (lg:3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Chamados" 
          value={total.toString()} 
          trend="+12% essa semana" 
          icon={<BarChart2 size={24} />} 
          color="bg-indigo-600"
        />
        <StatCard 
          title="Chamados Resolvidos" 
          value={resolved.toString()} 
          trend="+5% essa semana" 
          icon={<CheckCircle size={24} />} 
          color="bg-green-600"
        />
        <StatCard 
          title="Satisfação (CSAT)" 
          value="4.8/5.0" 
          trend="Estável" 
          icon={<Users size={24} />} 
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Volume por Categoria</h3>
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value} chamados</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Mock */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Atividade Recente</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-bold">Alex Operador</span> resolveu o chamado <span className="text-indigo-600">#CHM-100{i}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Há {i * 15} minutos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
