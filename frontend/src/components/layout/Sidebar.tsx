import type { ViewType } from '../../types/types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS = [
  { id: 'kds' as ViewType, label: 'Cozinha (KDS)', icon: 'grid_view' },
  { id: 'pos' as ViewType, label: 'Pedidos', icon: 'receipt_long' },
  { id: 'stock' as ViewType, label: 'Estoque', icon: 'inventory_2' },
  { id: 'sales' as ViewType, label: 'Vendas', icon: 'analytics' },
  { id: 'settings' as ViewType, label: 'Configurações', icon: 'settings' },
];

export function Sidebar({ currentView, onViewChange, isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 bg-sidebar-bg flex flex-col py-6 z-50 border-r border-[#FFCCBC] transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="px-6 mb-10 flex items-center justify-between">
  <h1 className="text-xl font-black text-sidebar-active tracking-tighter">FastFood Ops</h1>
  <button onClick={onMobileClose} className="md:hidden text-sidebar-text hover:text-white">
    <span className="material-symbols-outlined">close</span>
  </button>
</div>
      
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-all text-sm font-semibold tracking-wide ${
              currentView === item.id
                ? 'bg-sidebar-active/10 text-sidebar-active border-r-4 border-sidebar-active'
                : 'text-sidebar-text hover:bg-white/5'
            }`}
          >
            <span className={`material-symbols-outlined ${currentView === item.id ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 py-4 border-t border-white/10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-sidebar-active text-xl">account_circle</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">João Silva</span>
            <span className="text-[10px] text-sidebar-text uppercase tracking-wider">Gerente</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
