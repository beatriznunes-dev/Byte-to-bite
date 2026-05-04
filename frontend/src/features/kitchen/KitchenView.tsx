import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Pedido } from '../../types/types';

const STATUS_CONFIG = {
  EM_PREPARO: { color: '#FFA000', label: 'Em Preparo', action: 'Marcar como Pronto' },
  A_CAMINHO: { color: '#43A047', label: 'A Caminho', action: 'Ver Detalhes' },
  ENTREGUE: { color: '#90A4AE', label: 'Entregue', action: 'Arquivar' },
  CANCELADO: { color: '#E53935', label: 'Cancelado', action: 'Ver Motivo' },
};

export function KitchenView() {
  const [orders, setOrders] = useState<Pedido[]>([]);

  useEffect(() => {
    // Busca pedidos ativos no backend
    api.get('/pedidos').then(response => {
      // Filtra apenas os que não foram entregues ou cancelados para a cozinha
      const ativos = response.data.filter((p: Pedido) => p.status === 'EM_PREPARO');
      setOrders(ativos);
    });
  }, []);

  return (
    <div className="p-stack-lg space-y-stack-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Monitor de Produção</h1>
          <p className="text-on-surface-variant font-medium">{orders.length} pedidos em preparo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {orders.map((order, idx) => (
          <OrderCard key={order.id} order={order} index={idx} />
        ))}
      </div>

      <footer className="fixed bottom-0 left-64 right-0 px-6 py-4 bg-white border-t border-[#FFCCBC] flex justify-between items-center text-on-surface-variant z-30">
        <div className="flex gap-gutter">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#43A047]"></span>
            <span className="text-xs font-semibold">Sistema Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">update</span>
          <span className="text-[10px] font-bold uppercase">Sincronizado com Banco de Dados</span>
        </div>
      </footer>
    </div>
  );
}

function OrderCard({ order, index }: { order: Pedido; index: number }) {
  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.EM_PREPARO;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-on-surface/5 flex h-full min-h-85"
    >
      <div className="w-2" style={{ backgroundColor: config.color }}></div>
      <div className="flex-1 flex flex-col p-stack-md">
        <div className="flex justify-between items-start mb-stack-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest mb-1 block" style={{ color: config.color }}>
              {config.label}
            </span>
            <h4 className="text-sm font-black text-on-surface-variant">ID: {order.id.slice(0,8)}</h4>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-black block text-primary">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex-1 py-stack-md border-t border-b border-on-surface/5 overflow-y-auto max-h-40">
          <ul className="space-y-stack-sm">
            {order.item?.map((item) => (
              <li key={item.id} className="flex flex-col">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-on-surface">
                    <strong className="text-primary font-black mr-2">{item.quantidade}x</strong>
                    {item.produto?.nome || "Produto"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-stack-md mt-auto">
          <button className="w-full py-3 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
            {config.action}
          </button>
        </div>
      </div>
    </motion.div>
  );
}