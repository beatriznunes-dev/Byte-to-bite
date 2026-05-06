import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Produto, Ingrediente } from '../../types/types';
import { useSales } from '../../features/sales/SalesContext';

interface CartItem {
  produto: Partial<Produto>;
  quantidade: number;
  idUnico: string;
}

// --- MODAL DE EXCLUSÃO ---
function DeleteModal({
  produto,
  onConfirm,
  onCancel,
}: {
  produto: Produto;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[200] backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-red-600 text-4xl">delete</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Excluir Produto</h2>
        <p className="text-slate-600 font-medium leading-relaxed mb-10">
          Deseja excluir <span className="font-black text-slate-900 italic">"{produto.nome}"</span> permanentemente?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-2xl transition-all order-2 sm:order-1 uppercase text-xs tracking-widest"
          >
            Manter
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg order-1 sm:order-2 text-xs"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export function POSView() {
  const [products, setProducts] = useState<Produto[]>([]);
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<Ingrediente[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [comprovante, setComprovante] = useState<any>(null);

  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nomeCliente, setNomeCliente] = useState('');
  const [tipoPedido, setTipoPedido] = useState<'LOCAL' | 'RETIRADA' | 'ENTREGA'>('LOCAL');
  const [formaPagamento, setFormaPagamento] = useState<'PIX' | 'CARTAO' | 'DINHEIRO'>('PIX');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaDesc, setNovaDesc] = useState('');
  const [novaImagemUrl, setNovaImagemUrl] = useState('');
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [imagemNome, setImagemNome] = useState('');
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState<number[]>([]);
  const [salvando, setSalvando] = useState(false);

  // --- INTEGRAÇÃO COM SALESCONTEXT ---
  const { registrarVenda } = useSales();

  const totalPreco = cart.reduce((acc, i) => acc + (Number(i.produto.preco) * i.quantidade), 0);
  const totalItens = cart.reduce((acc, i) => acc + i.quantidade, 0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [prodRes, ingRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/ingredientes'),
      ]);
      setProducts(prodRes.data);
      const ingData = Array.isArray(ingRes.data) ? ingRes.data : ingRes.data.ingredientes;
      setIngredientesDisponiveis(ingData || []);
    } catch (err) {
      console.error('Erro ao carregar dados', err);
    }
  };

  const handleImageFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      alert('Imagem muito grande! Máximo 1MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemBase64(reader.result as string);
      setImagemNome(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent) => {
    let file: File | null = null;
    if ('files' in e.target && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files![0];
    } else if ('clipboardData' in e) {
      const items = (e as React.ClipboardEvent).clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) file = item.getAsFile();
      }
    }
    if (file) handleImageFile(file);
  };

  const previewImagem = imagemBase64 || novaImagemUrl;

  // --- LOGICA DE ATUALIZAÇÃO ---
  // POSView.tsx

const salvarOuAtualizarProduto = async () => {
  if (!novoNome || !novoPreco) return alert('Preencha os campos obrigatórios!');

  setSalvando(true);
  try {
    const dadosParaEnvio = {
      nome: novoNome,
      preco: parseFloat(novoPreco), // Garante que é número
      descricao: novaDesc,
      estoque: 999, // Valor padrão ou do estado
      tempoProducao: 15,
      imagemUrl: imagemBase64 || novaImagemUrl || null,
      // Garante que enviamos um array de números puros[cite: 12]
      ingredientes: ingredientesSelecionados.map(id => Number(id))
    };

    if (editandoId) {
      await api.put(`/produtos/${editandoId}`, dadosParaEnvio);
      alert('Produto atualizado!');
    } else {
      await api.post('/produtos', dadosParaEnvio);
      alert('Produto criado!');
    }

    fecharModalCadastro();
    await carregarDados(); // Atualiza a lista na tela
  } catch (err: any) {
    console.error("Erro detalhado:", err.response?.data || err.message);
    alert("Erro ao salvar produto. Verifique o console.");
  } finally {
    setSalvando(false);
  }
};

  const fecharModalCadastro = () => {
    setShowCadastroModal(false);
    setEditandoId(null);
    setNovoNome('');
    setNovoPreco('');
    setNovaDesc('');
    setNovaImagemUrl('');
    setImagemBase64(null);
    setImagemNome('');
    setIngredientesSelecionados([]);
  };

  const abrirEdicao = (p: Produto) => {
  // 1. Define o ID como número
  setEditandoId(Number(p.id));
  
  // 2. Preenche os campos básicos
  setNovoNome(p.nome);
  setNovoPreco(String(p.preco));
  setNovaDesc(p.descricao || '');

  // 3. Trata a imagem (se for URL ou Base64)
  if (p.imagemUrl && !p.imagemUrl.startsWith('data:')) {
    setNovaImagemUrl(p.imagemUrl);
    setImagemBase64(null);
  } else {
    setImagemBase64(p.imagemUrl || null);
    setNovaImagemUrl('');
  }

  // 4. Lógica para capturar IDs de ingredientes de diferentes formatos da API
  const ings = p.ingredientes ?? [];
  const ids = ings.map((i: any) => {
    if (typeof i === 'number') return i;
    // Tenta pegar o ID de dentro da relação do Prisma[cite: 12]
    return Number(i.ingredienteId ?? i.id ?? i.ingrediente?.id ?? 0);
  }).filter((id: number) => id > 0);

  setIngredientesSelecionados(ids);
  setShowCadastroModal(true);
};

  const abrirDeleteModal = (p: Produto) => {
    setProdutoParaExcluir({ ...p, id: Number(p.id) });
    setShowDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;
    try {
      await api.delete(`/produtos/${Number(produtoParaExcluir.id)}`);
      setShowDeleteModal(false);
      setProdutoParaExcluir(null);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CARRINHO ---
  const addToCart = (produto: Partial<Produto>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.produto.id === Number(produto.id));
      if (existing)
        return prev.map((i) =>
          i.produto.id === Number(produto.id) ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      return [...prev, { produto, quantidade: 1, idUnico: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.produto.id === Number(id));
      if (item && item.quantidade > 1)
        return prev.map((i) =>
          i.produto.id === Number(id) ? { ...i, quantidade: i.quantidade - 1 } : i
        );
      return prev.filter((i) => i.produto.id !== Number(id));
    });
  };

  const removeItemTotal = (idUnico: string) => {
    setCart((prev) => prev.filter((i) => i.idUnico !== idUnico));
  };

  const getQtdCarrinho = (id: number) =>
    cart.find((i) => i.produto.id === Number(id))?.quantidade || 0;

  // --- LOGICA DE FECHAMENTO ---
  const getUsuarioIdDoToken = (): string | null => {
    try {
      const token = localStorage.getItem('@ByteToBite:token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.sub ?? decoded.id ?? decoded.usuarioId ?? null;
    } catch {
      return null;
    }
  };

  const imprimirRecibo = () => {
    setTimeout(() => {
      window.print();
      setComprovante(null);
    }, 500);
  };

  const finalizarPedido = async () => {
    if (!nomeCliente.trim()) return alert('O nome do cliente é obrigatório.');
    if (cart.length === 0) return alert('O carrinho não pode estar vazio.');

    if (tipoPedido === 'ENTREGA') {
      if (!rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim())
        return alert('Preencha todos os campos de endereço para entrega.');
    }

    const usuarioId = getUsuarioIdDoToken();
    if (!usuarioId) return alert('Sessão inválida. Por favor, faça login novamente.');

    setFinalizando(true);
    try {
      let enderecoId: string | null = null;
      if (tipoPedido === 'ENTREGA') {
        const enderecoRes = await api.post('/enderecos', {
          usuarioId,
          rua,
          numeroDaCasa: numero,
          bairro,
          cidade,
        });
        enderecoId = enderecoRes.data.id;
      }

      const payload: any = {
        nomeCliente,
        usuarioId,
        retirada: tipoPedido === 'RETIRADA' ? 'SIM' : 'NAO',
        precoTotal: Number(totalPreco),
        status: 'EM_PREPARO',
        pagamento: formaPagamento,
        enderecoId,
        itens: cart.map((i) => ({
          produtoId: Number(i.produto.id),
          quantidade: i.quantidade,
          precoDaUnidade: Number(i.produto.preco),
        })),
      };

      const response = await api.post('/pedidos', payload);

      // --- REGISTRA A VENDA NO CONTEXTO COMPARTILHADO ---
      registrarVenda({
        id: response.data.id,
        total: totalPreco,
        pagamento: formaPagamento,
        hora: new Date(),
        itens: cart.map((i) => ({
          produtoId: Number(i.produto.id),
          nome: i.produto.nome ?? '',
          quantidade: i.quantidade,
          precoDaUnidade: Number(i.produto.preco),
          imagemUrl: i.produto.imagemUrl,
        })),
      });

      setComprovante({
        id: response.data.id,
        cliente: nomeCliente,
        data: new Date().toLocaleString('pt-BR'),
        itens: [...cart],
        total: totalPreco,
        tipoPedido,
        pagamento: formaPagamento,
      });

      setCart([]);
      setShowCheckout(false);
      setNomeCliente('');
      setRua('');
      setNumero('');
      setBairro('');
      setCidade('');

    } catch (err: any) {
      const erroBackend = err.response?.data || err.message;
      console.error('ERRO AO FINALIZAR PEDIDO:', erroBackend);
      alert(`Erro: ${err.response?.data?.message || 'Falha ao salvar o pedido. Verifique o console.'}`);
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="p-8 bg-[#FDF2F0] min-h-screen pb-40 font-sans">
      <header className="flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-black text-[#2D1B18]">Cardápio Digital</h2>
        <button
          onClick={() => { fecharModalCadastro(); setShowCadastroModal(true); }}
          className="bg-[#ac2d00] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
        >
          + NOVO LANCHE
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const qtd = getQtdCarrinho(p.id);
          return (
            <div key={p.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-orange-100 flex flex-col group relative">
              <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); abrirEdicao(p); }}
                  className="bg-white/90 p-2 rounded-full text-blue-600 shadow"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); abrirDeleteModal(p); }}
                  className="bg-white/90 p-2 rounded-full text-red-600 shadow"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              <div className="h-48 bg-gray-200">
                <img
                  src={p.imagemUrl || 'https://placehold.co/400x300'}
                  className="w-full h-full object-cover"
                  alt={p.nome}
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-[#2D1B18] text-xl">{p.nome}</h3>
                  <span className="font-black text-[#ac2d00]">R$ {Number(p.preco).toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{p.descricao}</p>

                <div className="mt-auto pt-6">
                  {qtd > 0 ? (
                    <div className="flex items-center justify-between bg-[#ac2d00] rounded-2xl p-1 text-white shadow-md">
                      <button onClick={() => removeFromCart(p.id)} className="w-10 h-10 font-bold text-xl">－</button>
                      <span className="text-[11px] font-black uppercase">{qtd} no pedido</span>
                      <button onClick={() => addToCart(p)} className="w-10 h-10 font-bold text-xl">＋</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-4 bg-[#E2EEF5] text-[#ac2d00] font-black rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px]"
                    >
                      <span className="material-symbols-outlined text-lg">add_shopping_cart</span> ADICIONAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-[#2D1B18] rounded-[32px] p-6 flex justify-between items-center shadow-2xl z-50 border-b-8 border-[#ac2d00]"
        >
          <div className="text-white">
            <p className="text-[10px] font-black text-gray-400 uppercase">Subtotal ({totalItens} itens)</p>
            <p className="text-2xl font-black italic">R$ {totalPreco.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-[#FF6D33] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-lg"
          >
            FECHAR PEDIDO
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-[40px] w-full max-w-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#2D1B18] italic uppercase">Finalizar</h3>
                <button onClick={() => setShowCheckout(false)} className="material-symbols-outlined text-gray-400">close</button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.idUnico} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <button onClick={() => removeItemTotal(item.idUnico)} className="text-red-500 material-symbols-outlined text-lg opacity-0 group-hover:opacity-100">cancel</button>
                        <span className="font-bold text-[#2D1B18]">{item.quantidade}x {item.produto.nome}</span>
                      </div>
                      <span className="font-black text-[#ac2d00]">R$ {(item.quantidade * Number(item.produto.preco)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t font-black text-lg">
                    <span>Total</span>
                    <span className="text-[#ac2d00]">R$ {totalPreco.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <input
                    className="w-full p-4 bg-gray-100 rounded-2xl font-bold"
                    placeholder="Nome do Cliente *"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    {(['LOCAL', 'RETIRADA', 'ENTREGA'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipoPedido(t)}
                        className={`py-4 rounded-2xl font-black text-[10px] border-2 ${tipoPedido === t ? 'bg-[#ac2d00] text-white' : 'bg-white text-gray-400'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['PIX', 'CARTAO', 'DINHEIRO'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormaPagamento(f)}
                        className={`py-3 rounded-2xl font-black text-[10px] border-2 ${formaPagamento === f ? 'bg-[#2D1B18] text-white' : 'bg-white text-gray-400'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {tipoPedido === 'ENTREGA' && (
                  <div className="space-y-3 pt-2">
                    <input className="w-full p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Rua *" value={rua} onChange={(e) => setRua(e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Número *" value={numero} onChange={(e) => setNumero(e.target.value)} />
                      <input className="p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Bairro *" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                    </div>
                    <input className="w-full p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Cidade *" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                  </div>
                )}
              </div>

              <div className="p-8 border-t flex gap-4">
                <button onClick={() => setShowCheckout(false)} className="px-6 py-5 font-black text-gray-400">VOLTAR</button>
                <button
                  onClick={finalizarPedido}
                  disabled={finalizando}
                  className="flex-1 bg-[#ac2d00] text-white py-5 rounded-2xl font-black uppercase text-xs disabled:opacity-60"
                >
                  {finalizando ? 'PROCESSANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {comprovante && (
        <div className="fixed inset-0 bg-white z-[200] p-10 flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-sm border-2 border-dashed border-gray-300 p-8 font-mono text-sm space-y-4">
            <h2 className="text-center font-black text-xl">BYTE TO BITE</h2>
            <div className="border-b py-2 flex justify-between">
              <span>#{String(comprovante.id).slice(0, 8)}</span>
              <span>{comprovante.data}</span>
            </div>
            <div className="font-bold">CLIENTE: {comprovante.cliente}</div>
            <div className="space-y-1">
              {comprovante.itens.map((i: CartItem) => (
                <div key={i.idUnico} className="flex justify-between">
                  <span>{i.quantidade}x {i.produto.nome}</span>
                  <span>R$ {(i.quantidade * Number(i.produto.preco)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 text-lg font-black flex justify-between uppercase">
              <span>Total:</span>
              <span>R$ {comprovante.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={imprimirRecibo} className="bg-[#ac2d00] text-white px-8 py-4 rounded-xl font-black">IMPRIMIR</button>
            <button onClick={() => setComprovante(null)} className="bg-[#2D1B18] text-white px-10 py-4 rounded-xl font-black">FECHAR</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCadastroModal && (
          <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white p-8 rounded-[40px] w-full max-w-3xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-black italic mb-6">{editandoId ? 'EDITAR LANCHE' : 'CADASTRAR NO CARDÁPIO'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <input className="w-full p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                  <input className="w-full p-4 bg-gray-100 rounded-2xl font-bold" placeholder="Preço" type="number" step="0.01" value={novoPreco} onChange={(e) => setNovoPreco(e.target.value)} />
                  <div className="relative w-full h-40 bg-gray-100 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden" onPaste={handleImageInput}>
                    <input type="file" accept="image/*" onChange={handleImageInput} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {previewImagem ? <img src={previewImagem} className="w-full h-full object-cover" alt="preview" /> : <p className="text-[10px] text-gray-400">Upload Imagem (1MB)</p>}
                  </div>
                  <input className="w-full p-3 bg-gray-100 rounded-xl font-bold text-sm" placeholder="Ou cole URL da imagem" value={novaImagemUrl} onChange={(e) => { setNovaImagemUrl(e.target.value); setImagemBase64(null); }} />
                </div>
                <div className="space-y-4">
                  <textarea className="w-full p-4 bg-gray-100 rounded-2xl font-bold h-28 resize-none" placeholder="Descrição" value={novaDesc} onChange={(e) => setNovaDesc(e.target.value)} />
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border rounded-2xl">
                    {ingredientesDisponiveis.map((ing) => (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => ingredientesSelecionados.includes(ing.id) ? setIngredientesSelecionados(prev => prev.filter(id => id !== ing.id)) : setIngredientesSelecionados([...ingredientesSelecionados, ing.id])}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black ${ingredientesSelecionados.includes(ing.id) ? 'bg-[#ac2d00] text-white' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {ing.nome}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button onClick={fecharModalCadastro} className="flex-1 font-black text-gray-400 py-4">CANCELAR</button>
                <button onClick={salvarOuAtualizarProduto} disabled={salvando} className="flex-1 py-5 bg-[#ac2d00] text-white rounded-2xl font-black uppercase text-xs">
                  {salvando ? 'SALVANDO...' : (editandoId ? 'ATUALIZAR DADOS' : 'SALVAR')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showDeleteModal && produtoParaExcluir && (
        <DeleteModal produto={produtoParaExcluir} onConfirm={confirmarExclusao} onCancel={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}