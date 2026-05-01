import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Produto } from '../../types/types';

export function POSView() {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produtos')
      .then(response => {
        setProducts(response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-stack-lg space-y-stack-lg pb-24">
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-on-surface">Lista de pedidos</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            {products.length} Itens sincronizados
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-on-surface-variant">Carregando lista de pedidos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Barra de Pedido inferior - Estática conforme design */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-70 right-6 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-sidebar-bg text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-white/10 pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              <div>
                <p className="text-sm font-bold">Pedido</p>
                <p className="text-[10px] text-sidebar-text font-bold uppercase">Selecione itens para iniciar</p>
              </div>
            </div>
          </div>
          <button className="px-8 py-3 bg-sidebar-active text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2">
            FINALIZAR PEDIDO
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Produto; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-on-surface/5 hover:shadow-md transition-all group flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          src={product.imagemUrl || 'https://via.placeholder.com/150'} 
          alt={product.nome}
        />
      </div>
      <div className="p-stack-md flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black leading-tight text-on-surface">{product.nome}</h3>
          <span className="text-sm font-black text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.preco))}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant font-medium mb-6 line-clamp-2">
          {product.descricao}
        </p>
        <button className="w-full mt-auto py-3 bg-surface-container text-primary font-black text-xs rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 tracking-widest">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          ADICIONAR
        </button>
      </div>
    </motion.div>
  );
}