import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface ItemPedido {
  id: string | number;
  produto?: {
    nome: string;
  };
  nome?: string;
  name?: string;
  precoDaUnidade: number;
  quantidade: number;
  observacao?: string;
}

interface Pedido {
  id: string;
  status: 'EM_PREPARO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO';
  nomeCliente?: string;
  createdAt: string;
  retirada?: string;
  pagamento?: string;
  precoTotal: number;
  itens?: ItemPedido[];
  item?: ItemPedido[]; // Suporte para ambas variações da API
}

type StatusVisual = 'AGUARDANDO' | 'EM_PREPARO' | 'ATRASADO' | 'PRONTO';

interface StatusConfigValue {
  color: string;
  bg: string;
  label: string;
  action: string;
}

const STATUS_CONFIG: Record<StatusVisual, StatusConfigValue> = {
  AGUARDANDO: {
    color: '#78909C',
    bg: '#78909C22',
    label: 'Aguardando',
    action: 'Iniciar Preparo',
  },
  EM_PREPARO: {
    color: '#FFA000',
    bg: '#FFA00022',
    label: 'Em Preparo',
    action: 'Marcar como Pronto',
  },
  ATRASADO: {
    color: '#E53935',
    bg: '#E5393522',
    label: 'Atrasado',
    action: 'Marcar como Pronto',
  },
  PRONTO: {
    color: '#388E3C',
    bg: '#388E3C22',
    label: 'Pronto',
    action: 'Confirmar Entrega',
  },
};

// -------------------------------------------------------------------
// Persistência no localStorage
// -------------------------------------------------------------------
const LS_INICIADOS = '@KDS:iniciados';
const LS_PRONTOS = '@KDS:prontos';
const LS_INICIO_TS = '@KDS:inicioTs';

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

function loadTimestamps(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_INICIO_TS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTimestamps(ts: Record<string, number>) {
  try {
    localStorage.setItem(LS_INICIO_TS, JSON.stringify(ts));
  } catch {}
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

export function KitchenView() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const now = useNow(1000);

  const [iniciados, setIniciadosState] = useState<Set<string>>(() => loadSet(LS_INICIADOS));
  const [prontos, setProntosState] = useState<Set<string>>(() => loadSet(LS_PRONTOS));
  const [inicioTs, setInicioTsState] = useState<Record<string, number>>(() => loadTimestamps());

  const setIniciados = (fn: (prev: Set<string>) => Set<string>) => {
    setIniciadosState(prev => {
      const next = fn(prev);
      saveSet(LS_INICIADOS, next);
      return next;
    });
  };

  const setProntos = (fn: (prev: Set<string>) => Set<string>) => {
    setProntosState(prev => {
      const next = fn(prev);
      saveSet(LS_PRONTOS, next);
      return next;
    });
  };

  const setInicioTs = (fn: (prev: Record<string, number>) => Record<string, number>) => {
    setInicioTsState(prev => {
      const next = fn(prev);
      saveTimestamps(next);
      return next;
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get<Pedido[]>('/pedidos');
      const ativos = response.data.filter(
        (p) => p.status === 'EM_PREPARO' || p.status === 'A_CAMINHO'
      );
      setOrders(ativos);

      const idsAtivos = new Set<string>(ativos.map((p) => p.id));
      setIniciados(prev => new Set([...prev].filter(id => idsAtivos.has(id))));
      setProntos(prev => new Set([...prev].filter(id => idsAtivos.has(id))));
      setInicioTs(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => { if (!idsAtivos.has(id)) delete next[id]; });
        return next;
      });
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const resolveStatusVisual = (order: Pedido): StatusVisual => {
    if (prontos.has(order.id) || order.status === 'A_CAMINHO') return 'PRONTO';
    if (!iniciados.has(order.id)) return 'AGUARDANDO';

    const startTs = inicioTs[order.id] ?? new Date(order.createdAt).getTime();
    const minutos = Math.floor((now - startTs) / 60000);
    if (minutos > 15) return 'ATRASADO';
    return 'EM_PREPARO';
  };

  const getStartTs = (order: Pedido): number => {
    return inicioTs[order.id] ?? new Date(order.createdAt).getTime();
  };

  const handleAction = async (order: Pedido) => {
    const visual = resolveStatusVisual(order);

    try {
      if (visual === 'AGUARDANDO') {
        const ts = Date.now();
        setIniciados(prev => new Set(prev).add(order.id));
        setInicioTs(prev => ({ ...prev, [order.id]: ts }));
        return;
      }

      if (visual === 'EM_PREPARO' || visual === 'ATRASADO') {
        await api.patch(`/pedidos/${order.id}/status`, { status: 'A_CAMINHO' });
        setProntos(prev => new Set(prev).add(order.id));
        setOrders(prev =>
          prev.map(o => o.id === order.id ? { ...o, status: 'A_CAMINHO' } : o)
        );
        return;
      }

      if (visual === 'PRONTO') {
        await api.patch(`/pedidos/${order.id}/status`, { status: 'ENTREGUE' });
        setOrders(prev => prev.filter(o => o.id !== order.id));
        setIniciados(prev => { const n = new Set(prev); n.delete(order.id); return n; });
        setProntos(prev => { const n = new Set(prev); n.delete(order.id); return n; });
        setInicioTs(prev => { const n = { ...prev }; delete n[order.id]; return n; });
        return;
      }
    } catch (err) {
      console.error('Erro na atualização:', err);
      alert('Não foi possível atualizar o status no servidor.');
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#FDF2F0] min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B18] italic uppercase">
            Monitor de Produção
          </h1>
          <p className="text-gray-500 font-bold">
            {orders.length} PEDIDOS EM ATIVIDADE
          </p>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {(Object.entries(STATUS_CONFIG) as [StatusVisual, StatusConfigValue][]).map(
            ([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {cfg.label}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orders.map((order, idx) => (
          <OrderCard
            key={order.id}
            order={order}
            index={idx}
            statusVisual={resolveStatusVisual(order)}
            startTs={getStartTs(order)}
            now={now}
            onAction={() => handleAction(order)}
          />
        ))}
      </div>
    </div>
  );
}

function labelRetirada(retirada: string | undefined): string {
  if (!retirada) return '';
  const r = retirada.toUpperCase();
  if (r === 'SIM') return 'RETIRADA';
  if (r === 'NAO' || r === 'NÃO') return 'LOCAL';
  if (r === 'RETIRADA' || r === 'LOCAL' || r === 'ENTREGA') return r;
  return retirada;
}

function iconRetirada(retirada: string | undefined): string {
  const label = labelRetirada(retirada);
  if (label === 'ENTREGA') return '🛵';
  if (label === 'RETIRADA') return '🏃';
  return '🪑';
}

interface OrderCardProps {
  order: Pedido;
  index: number;
  statusVisual: StatusVisual;
  startTs: number;
  now: number;
  onAction: () => void;
}

function OrderCard({
  order,
  index,
  statusVisual,
  startTs,
  now,
  onAction,
}: OrderCardProps) {
  const config = STATUS_CONFIG[statusVisual];
  const listaItens: ItemPedido[] = order.itens ?? order.item ?? [];

  const elapsedMs = now - startTs;
  const elapsedFormatted = formatElapsed(elapsedMs);
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  const timerColor =
    statusVisual === 'ATRASADO'
      ? '#E53935'
      : statusVisual === 'PRONTO'
      ? '#388E3C'
      : statusVisual === 'EM_PREPARO'
      ? elapsedMinutes >= 12 ? '#FFA000' : '#2D1B18'
      : '#9E9E9E';

  const retiradaLabel = labelRetirada(order.retirada);
  const retiradaIcon = iconRetirada(order.retirada);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-orange-100 flex flex-col"
    >
      <div className="h-3" style={{ backgroundColor: config.color }} />

      <div className="p-6 flex flex-col flex-1 gap-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-2">
            <span
              className="text-[10px] font-black uppercase tracking-tighter"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <h4 className="text-xl font-black text-[#2D1B18] leading-tight uppercase truncate">
              {order.nomeCliente || 'Cliente'}
            </h4>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-black uppercase text-gray-300 tracking-wider">
              na fila
            </span>
            <span
              className="text-2xl font-black tabular-nums leading-none"
              style={{ color: timerColor, fontVariantNumeric: 'tabular-nums' }}
            >
              {elapsedFormatted}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {retiradaLabel && (
            <span
              className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: config.color + '22', color: config.color }}
            >
              {retiradaIcon} {retiradaLabel}
            </span>
          )}

          {order.pagamento && (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              {order.pagamento}
            </span>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto border-t border-b border-gray-100 py-3 my-2"
          style={{ maxHeight: '180px' }}
        >
          {listaItens.length === 0 ? (
            <p className="text-[10px] text-gray-300 font-bold uppercase text-center py-6">
              Sem itens registrados
            </p>
          ) : (
            <ul className="space-y-2">
              {listaItens.map((it) => {
                const nomeLanche =
                  it.produto?.nome ||
                  it.nome ||
                  it.name ||
                  'Lanche Desconhecido';
                const subtotal = (Number(it.precoDaUnidade ?? 0) * (it.quantidade ?? 1)).toFixed(2);

                return (
                  <li key={it.id} className="flex items-start gap-2">
                    <span
                      className="text-[11px] font-black shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-white mt-0.5"
                      style={{ backgroundColor: config.color }}
                    >
                      {it.quantidade ?? 1}
                    </span>

                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-black text-[#2D1B18] leading-snug uppercase truncate">
                        {nomeLanche}
                      </span>
                      {it.observacao && (
                        <span className="text-[9px] font-bold text-gray-400 leading-tight truncate">
                          {it.observacao}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-black text-gray-300 shrink-0 mt-0.5">
                      R$ {subtotal}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-[10px] font-black uppercase text-gray-300">
            Total
          </span>
          <span className="text-sm font-black text-[#2D1B18]">
            R$ {Number(order.precoTotal ?? 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={onAction}
          style={{ backgroundColor: config.color }}
          className="w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all mt-2"
        >
          {config.action}
        </button>
      </div>
    </motion.div>
  );
}