import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSales } from '../../features/sales/SalesContext';

export function SalesView() {
  const { sales } = useSales();

  // --- TOTAL DO DIA ---
  const totalDia = sales.reduce((acc, s) => acc + s.total, 0);
  const totalPedidos = sales.length;

  // --- MÉTODOS DE PAGAMENTO ---
  const pagamentos = sales.reduce(
    (acc, s) => {
      if (s.pagamento === 'PIX') acc.pix += s.total;
      else if (s.pagamento === 'CARTAO') acc.cartao += s.total;
      else if (s.pagamento === 'DINHEIRO') acc.dinheiro += s.total;
      return acc;
    },
    { pix: 0, cartao: 0, dinheiro: 0 }
  );

  // --- VENDAS POR HORA ---
  const vendasPorHora = Array.from({ length: 24 }, (_, h) => {
    const label = `${String(h).padStart(2, '0')}h`;
    const total = sales
      .filter((s) => new Date(s.hora).getHours() === h)
      .reduce((acc, s) => acc + s.total, 0);
    return { hour: label, sales: total };
  }).filter((h) => h.sales > 0);

  // Garante ao menos placeholder visual quando não há vendas ainda
  const dadosGrafico =
    vendasPorHora.length > 0
      ? vendasPorHora
      : [{ hour: '--', sales: 0 }];

  const pico = vendasPorHora.reduce(
    (max, h) => (h.sales > max.sales ? h : max),
    { hour: '--', sales: 0 }
  );

  // --- PRODUTOS MAIS VENDIDOS ---
  const produtosMap = new Map<
    number,
    { nome: string; count: number; sales: number; imagemUrl?: string }
  >();
  sales.forEach((s) => {
    s.itens.forEach((item) => {
      const existing = produtosMap.get(item.produtoId);
      if (existing) {
        existing.count += item.quantidade;
        existing.sales += item.precoDaUnidade * item.quantidade;
      } else {
        produtosMap.set(item.produtoId, {
          nome: item.nome,
          count: item.quantidade,
          sales: item.precoDaUnidade * item.quantidade,
          imagemUrl: item.imagemUrl,
        });
      }
    });
  });
  const topProdutos = Array.from(produtosMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // --- COMPARAÇÃO COM ONTEM (placeholder, sem dados históricos) ---
  const variacaoTexto = sales.length > 0 ? 'AO VIVO' : 'SEM VENDAS HOJE';

  return (
    <div className="p-stack-lg space-y-stack-lg animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* CARD PRINCIPAL */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC] relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Vendas de Hoje</p>
                <h2 className="text-5xl font-black text-primary leading-tight">
                  R$ {totalDia.toFixed(2).replace('.', ',')}
                </h2>
              </div>
              <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl fill-icon">payments</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-xs font-black">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                {variacaoTexto}
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-2 rounded-full text-xs font-black">
                <span className="material-symbols-outlined text-sm">receipt</span>
                {totalPedidos} PEDIDO{totalPedidos !== 1 ? 'S' : ''}
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[240px] text-on-surface/5 pointer-events-none">restaurant</span>
        </div>

        {/* MÉTODOS DE PAGAMENTO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <h3 className="text-xl font-black text-on-surface mb-6 uppercase tracking-wider">Métodos de Pagamento</h3>
          <div className="space-y-6">
            <PaymentMethodItem label="Pix" value={pagamentos.pix} total={totalDia} icon="qr_code_2" color="#3B82F6" bgColor="#EFF6FF" />
            <PaymentMethodItem label="Cartão" value={pagamentos.cartao} total={totalDia} icon="credit_card" color="#8B5CF6" bgColor="#F5F3FF" />
            <PaymentMethodItem label="Dinheiro" value={pagamentos.dinheiro} total={totalDia} icon="payments" color="#10B981" bgColor="#ECFDF5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* GRÁFICO DE VENDAS POR HORA */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-on-surface uppercase tracking-wider">Vendas por Hora</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase">
                {pico.hour !== '--' ? `PICO: ${pico.hour}` : 'SEM DADOS'}
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#5b4039' }}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-sidebar-bg text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold border border-white/10">
                          {`R$ ${Number(payload[0].value).toFixed(2)}`}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={index} fill={entry.sales > 700 ? '#ac2d00' : '#e4beb4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP PRODUTOS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <h3 className="text-xl font-black text-on-surface mb-6 uppercase tracking-wider">Produtos + Vendidos</h3>
          <div className="space-y-4">
            {topProdutos.length > 0 ? (
              topProdutos.map((p) => (
                <TopProductItem
                  key={p.nome}
                  name={p.nome}
                  count={p.count}
                  sales={p.sales}
                  img={p.imagemUrl || 'https://placehold.co/48x48'}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-4xl opacity-30">bar_chart</span>
                <p className="text-xs font-black uppercase tracking-wider opacity-50">Nenhuma venda ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-on-surface-variant gap-4 bg-on-surface/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-black">update</span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Última atualização: {sales.length > 0
              ? new Date(sales[sales.length - 1].hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : '--'}
          </span>
        </div>
        <div className="flex gap-8">
          <button className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary transition-all">Baixar Relatório PDF</button>
          <button className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary transition-all">Configurações de Taxas</button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodItem({ label, value, total, icon, color, bgColor }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
        <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{label}</span>
          <span className="text-sm font-black text-on-surface">R$ {value.toFixed(2)}</span>
        </div>
        <div className="w-full h-2 bg-on-surface/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

function TopProductItem({ name, count, sales, img }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-on-surface/5 rounded-xl transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-on-surface/5">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-black text-on-surface">{name}</p>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{count} un. vendidas</p>
        </div>
      </div>
      <span className="text-sm font-black text-primary">R$ {sales.toFixed(2)}</span>
    </div>
  );
}
