import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HOURLY_DATA = [
  { hour: '10h', sales: 200 },
  { hour: '11h', sales: 450 },
  { hour: '12h', sales: 950 },
  { hour: '13h', sales: 800 },
  { hour: '14h', sales: 350 },
  { hour: '15h', sales: 300 },
  { hour: '16h', sales: 550 },
  { hour: '17h', sales: 600 },
  { hour: '18h', sales: 900 },
];

export function SalesView() {
  return (
    <div className="p-stack-lg space-y-stack-lg animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC] relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Vendas de Hoje</p>
                <h2 className="text-5xl font-black text-primary leading-tight">R$ 1.240,00</h2>
              </div>
              <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl fill-icon">payments</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-xs font-black">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12.5% VS ONTEM
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-2 rounded-full text-xs font-black">
                <span className="material-symbols-outlined text-sm">receipt</span>
                48 PEDIDOS
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[240px] text-on-surface/5 pointer-events-none">restaurant</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <h3 className="text-xl font-black text-on-surface mb-6 uppercase tracking-wider">Métodos de Pagamento</h3>
          <div className="space-y-6">
            <PaymentMethodItem label="Pix" value={520} total={1240} icon="qr_code_2" color="#3B82F6" bgColor="#EFF6FF" />
            <PaymentMethodItem label="Cartão" value={610} total={1240} icon="credit_card" color="#8B5CF6" bgColor="#F5F3FF" />
            <PaymentMethodItem label="Dinheiro" value={110} total={1240} icon="payments" color="#10B981" bgColor="#ECFDF5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-on-surface uppercase tracking-wider">Vendas por Hora</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase">PICO: 12:00 - 14:00</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_DATA}>
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
                          {`R$ ${payload[0].value}`}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {HOURLY_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.sales > 700 ? '#ac2d00' : '#e4beb4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#FFCCBC]">
          <h3 className="text-xl font-black text-on-surface mb-6 uppercase tracking-wider">Produtos + Vendidos</h3>
          <div className="space-y-4">
            <TopProductItem name="Burger Clássico" count={24} sales={840} img="https://lh3.googleusercontent.com/aida-public/AB6AXuBGqzm1gjptAcxiCO-ZijI16obOf_OAM5uuPRAAwplaP1q4ThbUSvTatqZfgFaLX4t6Zz6xfOxtTRBEZgoiILlvk6agt4boR_QfGe8RxKQ5U5f-aSxLa-h2OnyLWbiax2IWIuXNCJCTkU1vDbP9pvOuDMbhwYg2hr3IrPnCBaopr7Jy0ElAzffkUmQIjLXs7QIs9I4XI1i1sI2m5ogzqIM2aOcT-hfkMlNb3oq1A-2oey4FTeHFi9elCKUawgY0brUA0L8ef6B0phf2" />
            <TopProductItem name="Batata G" count={18} sales={270} img="https://lh3.googleusercontent.com/aida-public/AB6AXuDq_IQwIokbuLikhK2WLynLzz9Eie2OeE09tgw22GmZgwJuS2TRudTApKVFJgDNMot8XHLItqH00azAMYGCTV76H8hmpkS9YbKAaQlZqbJN31rTGsZQ9W-gi-4btmfdhuB7TQG01BbT0nZkrOkMSg2o-wESuMVR0GS2DcmP6rni-4FqvBIDbTzq2Z-5fdnZRBhv_VpncdGXxlrf9XHyYx96HsWelcWiaYqAl3M99f8mvJj88_2DXb09U2fy5yqK7Kal7XBfed_J0VgJ" />
            <TopProductItem name="Refrigerante" count={12} sales={130} img="https://lh3.googleusercontent.com/aida-public/AB6AXuAN_mMzq03oUbYFNru0eueSTu76LJvDBD29RTJ8Aj3BfrzBFr9UNUkzYd3ESrP6g5QPI_9y0VP7hkNh6XmcXf771QmuwJBGTTC6XWlLAK9bi_RgDeIAdDXpnIg3rU51WtoD3K4pUr2-8rzZo2kbUnTH89Roo3Z9qXF6Sqi93GrYq3Bha_SNonXPyUqTbfpil1tjk4pZjn6iHHexVjCoORcpevZOZ4eZbK9QPtbdqZ9a9iEvYrLqtBs3B_xO4ckfUS0ItrHj4zK04nCY" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-on-surface-variant gap-4 bg-on-surface/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-black">update</span>
          <span className="text-xs font-bold uppercase tracking-wider">Última atualização: hoje às 18:42</span>
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
  const percentage = (value / total) * 100;
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
