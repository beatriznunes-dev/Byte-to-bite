import { STOCK_ITEMS } from '../constants.ts';
import { getIconByInsumoName } from '../utils/iconHelper.ts';

export function StockView() {
  return (
    <div className="p-stack-lg space-y-stack-lg animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface leading-tight">Gestão de Estoque</h1>
          <p className="font-medium text-on-surface-variant flex items-center gap-2">
            Controle de insumos e níveis críticos
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </p>
        </div>
        <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined font-black">add</span>
          Adicionar Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard label="Total de Itens" value="124" icon="inventory_2" color="#ac2d00" />
        <StatCard label="Estoque Baixo" value="12" icon="warning" color="#ba1a1a" isError />
        <StatCard label="Valor em Estoque" value="R$ 14.2k" icon="payments" color="#745853" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-[#FFCCBC] overflow-hidden">
        <div className="p-6 border-b border-[#FFCCBC] flex flex-col md:flex-row gap-6 justify-between items-center bg-on-surface/5">
          <div className="relative w-full md:w-96 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">search</span>
            <input 
              className="w-full pl-12 pr-6 py-3 bg-white border border-on-surface/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-semibold transition-all shadow-sm" 
              placeholder="Buscar insumo..." 
              type="text"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-3 border border-on-surface/10 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
            <button className="p-3 border border-on-surface/10 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-on-surface-variant">download</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-on-surface/5 border-b border-[#FFCCBC]">
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Insumo</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Quantidade Atuall</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Unidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Última Reposição</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {STOCK_ITEMS.map((item) => (
  <tr key={item.id} className="hover:bg-on-surface/2 transition-colors">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shadow-inner">
  {(() => {
    const icon = getIconByInsumoName(item.name);
    
    // Se o ícone começar com "fa-", usamos a tag do Font Awesome
    if (icon.startsWith('fa-')) {
      return <i className={`${icon} text-primary text-2xl`}></i>;
    }
    
    // Caso contrário, usamos o Material Symbols padrão
    return (
      <span className="material-symbols-outlined text-primary text-2xl">
        {icon}
      </span>
    );
  })()}
</div>
        <span className="text-lg font-bold text-on-surface">{item.name}</span>
      </div>
    </td>
    <td className="px-8 py-6">
      <StatusBadge status={item.status} />
    </td>
    <td className="px-8 py-6">
      <span className={`text-xl font-black ${item.status === 'baixo' ? 'text-error' : 'text-on-surface'}`}>
        {item.quantity}
      </span>
    </td>
    <td className="px-8 py-6 text-sm font-black text-on-surface-variant uppercase">{item.unit}</td>
    <td className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.lastRestock}</td>
    <td className="px-8 py-6 text-right">
      <button className="w-10 h-10 hover:bg-on-surface/5 rounded-full transition-all flex items-center justify-center">
        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
      </button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, isError }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#FFCCBC] flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`} style={{ backgroundColor: `${color}10` }}>
        <span className="material-symbols-outlined text-3xl font-black fill-icon" style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className={`text-3xl font-black ${isError ? 'text-error' : 'text-on-surface'}`}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    baixo: { bg: 'bg-error-container', text: 'text-on-error-container', icon: 'warning', label: 'Estoque Baixo' },
    normal: { bg: 'bg-green-100', text: 'text-green-800', icon: 'check_circle', label: 'Normal' },
    aguardando: { bg: 'bg-on-surface/5', text: 'text-on-surface-variant', icon: 'history', label: 'Aguardando' },
  }[status as 'baixo' | 'normal' | 'aguardando'];

  return (
    <span className={`px-4 py-2 rounded-full ${config.bg} ${config.text} text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm`}>
      <span className="material-symbols-outlined text-sm font-black">{config.icon}</span>
      {config.label}
    </span>
  );
}

