import { motion } from 'motion/react';
import type { Product } from '../types.ts';
import { PRODUCTS } from '../constants.ts';


const CATEGORIES = [
  { id: 'burgers', label: 'Burgers', icon: 'lunch_dining' },
  { id: 'drinks', label: 'Drinks', icon: 'local_bar' },
  { id: 'sides', label: 'Sides', icon: 'restaurant_menu' },
  { id: 'desserts', label: 'Desserts', icon: 'icecream' },
  { id: 'combos', label: 'Combos', icon: 'star' },
  { id: 'others', label: 'Others', icon: 'category' },
];

export function POSView() {
  return (
    <div className="p-stack-lg space-y-stack-lg pb-24">
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm border transition-all active:scale-95 ${
              cat.id === 'burgers'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white text-on-surface border-on-surface/5 hover:border-primary/50'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl mb-2 ${cat.id === 'burgers' ? '' : 'text-primary'}`}>
              {cat.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
          </button>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-on-surface">Burgers Populares</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            24 Itens disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {PRODUCTS.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-70 right-6 z-50 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto bg-sidebar-bg text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-white/10 pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-sidebar-bg">
                  3
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Ver Pedido (3 itens)</p>
                <p className="text-[10px] text-sidebar-text font-bold uppercase">Mesa 04 • Cliente: Desconhecido</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="hidden md:block">
              <p className="text-[10px] text-sidebar-text uppercase tracking-widest font-black leading-none mb-1">Total Parcial</p>
              <p className="font-display text-2xl font-black text-sidebar-active leading-none">R$ 85,00</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-6 py-3 hover:bg-white/5 text-white text-xs font-black rounded-xl transition-colors hidden sm:block">
              LIMPAR
            </button>
            <button className="px-8 py-3 bg-sidebar-active hover:brightness-110 text-white font-black text-sm rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
              FECHAR PEDIDO
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number; key?: string }) {
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
          src={product.imageUrl} 
          alt={product.name}
        />
        {product.isPopular && (
          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Mais Vendido
          </div>
        )}
      </div>
      <div className="p-stack-md flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black leading-tight text-on-surface">{product.name}</h3>
          <span className="text-sm font-black text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant font-medium mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <button className="w-full mt-auto py-3 bg-surface-container text-primary font-black text-xs rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 tracking-widest">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          ADICIONAR
        </button>
      </div>
    </motion.div>
  );
}
