import { motion } from 'motion/react';
import type { Order } from '../types.ts';
import { INITIAL_ORDERS } from '../constants.ts';

const STATUS_CONFIG = {
  atrasado: { color: '#E53935', label: 'Atrasado', action: 'Prioridade Máxima' },
  preparando: { color: '#FFA000', label: 'Em Preparo', action: 'Marcar como Pronto' },
  pronto: { color: '#43A047', label: 'Pronto', action: 'Ver Detalhes' },
  recebido: { color: '#90A4AE', label: 'Recebido', action: 'Iniciar Preparo' },
};

export function KitchenView() {
  return (
    <div className="p-stack-lg space-y-stack-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Monitor de Produção</h1>
          <p className="text-on-surface-variant font-medium">4 pedidos ativos no momento</p>
        </div>
        <div className="flex gap-stack-md">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-on-surface/10 text-sm font-semibold hover:bg-surface-dim transition-all">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-on-surface/10 text-sm font-semibold hover:bg-surface-dim transition-all">
            <span className="material-symbols-outlined text-sm">sort</span>
            Ordenar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {INITIAL_ORDERS.map((order, idx) => (
          <OrderCard key={order.id} order={order} index={idx} />
        ))}
      </div>

      <footer className="fixed bottom-0 left-64 right-0 px-6 py-4 bg-white border-t border-[#FFCCBC] flex justify-between items-center text-on-surface-variant z-30">
        <div className="flex gap-gutter">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#43A047]"></span>
            <span className="text-xs font-semibold">Ticket Médio: 12min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E53935]"></span>
            <span className="text-xs font-semibold">Alertas: 1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">update</span>
          <span className="text-[10px] font-bold uppercase">Última atualização: Agora mesmo</span>
        </div>
      </footer>
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number; key?: string }) {
  const config = STATUS_CONFIG[order.status];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-on-surface/5 flex h-full min-h-85 ${order.status === 'pronto' ? 'opacity-80' : ''}`}
    >
      <div className="w-2" style={{ backgroundColor: config.color }}></div>
      <div className="flex-1 flex flex-col p-stack-md">
        <div className="flex justify-between items-start mb-stack-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest mb-1 block" style={{ color: config.color }}>
              {config.label}
            </span>
            <h4 className="text-xl font-black text-on-surface">#{order.id}</h4>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-black block" style={{ color: config.color }}>
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              {order.tableNumber ? `Mesa ${order.tableNumber}` : `Delivery #${order.deliveryId}`}
            </span>
          </div>
        </div>

        <div className="flex-1 py-stack-md border-t border-b border-on-surface/5 overflow-y-auto max-h-40">
          <ul className="space-y-stack-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex flex-col">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-on-surface">
                    <strong className="text-primary font-black mr-2">{item.quantity}x</strong>
                    {item.name}
                  </span>
                </div>
                {item.notes && (
                  <span className="text-[11px] text-on-surface-variant italic font-medium ml-6">
                    * {item.notes}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-stack-md mt-auto">
          <button 
            className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              order.status === 'atrasado' 
                ? 'border-2 border-sidebar-bg text-sidebar-bg hover:bg-sidebar-bg hover:text-white'
                : order.status === 'preparando'
                ? 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20'
                : 'border border-on-surface/20 text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {config.action}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
