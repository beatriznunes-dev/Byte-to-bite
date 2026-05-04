import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Produto } from '../../types/types';

interface CartItem { produto: Produto; quantidade: number; }
interface Endereco { id: string; rua: string; bairro: string; cidade: string; numeroDaCasa: string; }

function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('@ByteToBite:token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1])).sub || null;
  } catch { return null; }
}

export function POSView() {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  // ─── ESTADO DO CARRINHO (NOVO) ───────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const [showNovoEndereco, setShowNovoEndereco] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [novoRua, setNovoRua] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novoCidade, setNovoCidade] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const usuarioId = getUserIdFromToken();
  const totalItens = cart.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPreco = cart.reduce((acc, i) => acc + (Number(i.produto.preco) * i.quantidade), 0);

  function addToCart(produto: Produto) {
    setCart(prev => {
      const existing = prev.find(i => i.produto.id === produto.id);
      if (existing) return prev.map(i => i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      return [...prev, { produto, quantidade: 1 }];
    });
  }
  function removeFromCart(produtoId: number) {
    setCart(prev => {
      const existing = prev.find(i => i.produto.id === produtoId);
      if (existing && existing.quantidade > 1) return prev.map(i => i.produto.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i);
      return prev.filter(i => i.produto.id !== produtoId);
    });
  }

  useEffect(() => {
    if (showCheckout && usuarioId) {
      api.get(`/enderecos/${usuarioId}`)
        .then(r => { setEnderecos(r.data); if (r.data.length > 0) setEnderecoSelecionado(r.data[0].id); })
        .catch(() => setEnderecos([]));
    }
  }, [showCheckout, usuarioId]);

  async function finalizarPedido() {
    if (!usuarioId || cart.length === 0) return;
    setFinalizando(true);
    try {
      let endId = enderecoSelecionado;
      if (!endId || showNovoEndereco) {
        if (!novoRua || !novoBairro || !novoCidade || !novoNumero) { alert('Preencha todos os campos do endereço.'); setFinalizando(false); return; }
        const r = await api.post('/enderecos', { usuarioId, rua: novoRua, bairro: novoBairro, cidade: novoCidade, numeroDaCasa: novoNumero });
        endId = r.data.id;
      }
      await api.post('/pedidos', { usuarioId, enderecoId: endId, itens: cart.map(i => ({ produtoId: i.produto.id, quantidade: i.quantidade })) });
      setSucesso(true);
      setCart([]);
      setTimeout(() => { setSucesso(false); setShowCheckout(false); setShowNovoEndereco(false); setNovoRua(''); setNovoBairro(''); setNovoCidade(''); setNovoNumero(''); }, 2500);
    } catch (err) {
  alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao finalizar pedido.');
  } finally { setFinalizando(false); }
  }
  // ────────────────────────────────────────────────────────────────────────────

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
              <ProductCard
  key={product.id}
  product={product}
  index={idx}
  cartQty={cart.find(i => i.produto.id === product.id)?.quantidade || 0}
  onAdd={() => addToCart(product)}
  onRemove={() => removeFromCart(product.id)}
/>
            ))}
          </div>
        )}
      </section>

      {/* Barra de Pedido inferior - Estática conforme design */}
      {/* Barra de Pedido inferior */}
<motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-70 right-6 z-50 pointer-events-none">
  <div className="max-w-4xl mx-auto bg-sidebar-bg text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-white/10 pointer-events-auto">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-sidebar-active text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {totalItens}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-bold">Pedido</p>
          <p className="text-[10px] text-sidebar-text font-bold uppercase">
            {totalItens === 0
              ? 'Selecione itens para iniciar'
              : `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} — ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPreco)}`
            }
          </p>
        </div>
      </div>
    </div>
    <button
      onClick={() => totalItens > 0 && setShowCheckout(true)}
      className={`px-8 py-3 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 ${totalItens > 0 ? 'bg-sidebar-active text-white' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
    >
      FINALIZAR PEDIDO
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
</motion.div>

{/* Modal de Checkout */}
<AnimatePresence>
  {showCheckout && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-[#FFCCBC] overflow-hidden">

        {sucesso ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
            </motion.div>
            <h3 className="text-2xl font-black text-on-surface">Pedido Criado!</h3>
            <p className="text-on-surface-variant font-medium mt-2">Seu pedido foi enviado para a cozinha.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-[#FFCCBC] flex justify-between items-center">
              <h3 className="text-xl font-black text-on-surface">Finalizar Pedido</h3>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-on-surface/5">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Resumo</p>
                {cart.map(item => (
                  <div key={item.produto.id} className="flex justify-between items-center py-2 border-b border-on-surface/5">
                    <span className="text-sm font-bold text-on-surface"><strong className="text-primary">{item.quantidade}x</strong> {item.produto.nome}</span>
                    <span className="text-sm font-black text-on-surface">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.produto.preco) * item.quantidade)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3">
                  <span className="font-black text-on-surface uppercase text-sm">Total</span>
                  <span className="font-black text-primary text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPreco)}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Endereço de Entrega</p>
                {enderecos.length > 0 && !showNovoEndereco ? (
                  <div className="space-y-2">
                    {enderecos.map(end => (
                      <label key={end.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${enderecoSelecionado === end.id ? 'border-primary bg-primary/5' : 'border-on-surface/10'}`}>
                        <input type="radio" name="endereco" value={end.id} checked={enderecoSelecionado === end.id} onChange={() => setEnderecoSelecionado(end.id)} className="accent-primary" />
                        <span className="text-sm font-bold text-on-surface">{end.rua}, {end.numeroDaCasa} — {end.bairro}, {end.cidade}</span>
                      </label>
                    ))}
                    <button onClick={() => setShowNovoEndereco(true)} className="text-xs font-black text-primary uppercase tracking-widest mt-1 hover:underline">+ Usar outro endereço</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enderecos.length > 0 && <button onClick={() => setShowNovoEndereco(false)} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">← Usar endereço salvo</button>}
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Rua" value={novoRua} onChange={e => setNovoRua(e.target.value)} className="col-span-2 p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold text-sm" />
                      <input placeholder="Número" value={novoNumero} onChange={e => setNovoNumero(e.target.value)} className="p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold text-sm" />
                      <input placeholder="Bairro" value={novoBairro} onChange={e => setNovoBairro(e.target.value)} className="p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold text-sm" />
                      <input placeholder="Cidade" value={novoCidade} onChange={e => setNovoCidade(e.target.value)} className="col-span-2 p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[#FFCCBC] flex gap-4">
              <button onClick={() => setShowCheckout(false)} className="flex-1 px-6 py-3 font-bold text-on-surface-variant hover:bg-on-surface/5 rounded-xl">Cancelar</button>
              <button onClick={finalizarPedido} disabled={finalizando}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {finalizando
                  ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  : <><span className="material-symbols-outlined text-sm">check</span>Confirmar</>
                }
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

function ProductCard({ product, index, cartQty, onAdd, onRemove }: { product: Produto; index: number; cartQty: number; onAdd: () => void; onRemove: () => void; }) {
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
       {cartQty === 0 ? (
  <button onClick={onAdd} className="w-full mt-auto py-3 bg-surface-container text-primary font-black text-xs rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 tracking-widest">
    <span className="material-symbols-outlined text-lg">add_circle</span>
    ADICIONAR
  </button>
) : (
  <div className="w-full mt-auto flex items-center justify-between bg-primary rounded-lg overflow-hidden">
    <button onClick={onRemove} className="px-4 py-3 text-white font-black hover:bg-black/10 transition-colors">
      <span className="material-symbols-outlined text-lg">remove</span>
    </button>
    <span className="text-white font-black text-sm">{cartQty} no carrinho</span>
    <button onClick={onAdd} className="px-4 py-3 text-white font-black hover:bg-black/10 transition-colors">
      <span className="material-symbols-outlined text-lg">add</span>
    </button>
  </div>
)}
      </div>
    </motion.div>
  );
}