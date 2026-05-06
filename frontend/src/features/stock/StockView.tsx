import { useEffect, useState } from 'react';
import { api } from '../../services/api'; 
import type { Ingrediente } from '../../types/types';
import { getIconByInsumoName } from '../../utils/iconHelper';

export function StockView() {
  const [items, setItems] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Ingrediente | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaQtd, setNovaQtd] = useState(0);

  async function loadStock() {
    try {
      setLoading(true);
      const response = await api.get('/ingredientes'); 
      const data = Array.isArray(response.data) ? response.data : response.data.ingredientes;
      setItems(data || []);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  function handleOpenAddModal() {
    setEditingId(null);
    setNovoNome('');
    setNovaQtd(0);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(item: Ingrediente) {
    setEditingId(item.id);
    setNovoNome(item.nome);
    setNovaQtd(item.estoque);
    setIsModalOpen(true);
    setActiveMenuId(null);
  }

  function handleOpenDeleteModal(item: Ingrediente) {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  }

  async function handleSaveInsumo(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { nome: novoNome, estoque: Number(novaQtd) };
      if (editingId) {
        await api.put(`/ingredientes/${editingId}`, payload);
      } else {
        await api.post('/ingredientes', payload);
      }
      setIsModalOpen(false);
      loadStock(); 
    } catch  {
      alert("Erro na operação.");
    }
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    try {
      await api.delete(`/ingredientes/${itemToDelete.id}`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      loadStock();
    } catch  {
      alert("Erro ao excluir insumo.");
    }
  }

  const totalItens = items.length;
  const estoqueBaixo = items.filter(item => (item.estoque || 0) < 5).length;

  return (
    <div className="p-stack-lg space-y-stack-lg animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface leading-tight">Gestão de Estoque</h1>
          <p className="font-medium text-on-surface-variant flex items-center gap-2">
            Controle de insumos e níveis críticos
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <span className="material-symbols-outlined font-black">add</span>
          Adicionar Insumo
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard label="Total de Itens" value={totalItens.toString()} icon="inventory_2" color="#ac2d00" />
        <StatCard label="Estoque Baixo" value={estoqueBaixo.toString()} icon="warning" color="#ba1a1a" isError={estoqueBaixo > 0} />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#FFCCBC] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-bold text-on-surface-variant">Carregando estoque...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-on-surface/5 border-b border-[#FFCCBC]">
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Insumo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Qtd Atual</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">ID</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/5">
                {items.map((item) => {
                  const qtd = item.estoque || 0;
                  const status = qtd < 5 ? 'baixo' : 'normal';
                  return (
                    <tr key={item.id} className="hover:bg-on-surface/2 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shadow-inner">
                            {(() => {
                              const icon = getIconByInsumoName(item.nome);
                              return icon.startsWith('fa-') ? (
                                <i className={`${icon} text-primary text-2xl`}></i>
                              ) : (
                                <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                              );
                            })()}
                          </div>
                          <span className="text-lg font-bold text-on-surface">{item.nome}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xl font-black ${status === 'baixo' ? 'text-error' : 'text-on-surface'}`}>
                          {qtd}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-on-surface-variant uppercase">#{String(item.id).slice(0, 8)}</td>
                      
                      <td className="px-8 py-6 text-right relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="w-10 h-10 hover:bg-on-surface/5 rounded-full transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                        </button>

                        {activeMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                            <div className="absolute right-8 top-14 bg-white border border-[#FFCCBC] shadow-2xl rounded-xl py-2 w-40 z-20 animate-in fade-in zoom-in-95 duration-100">
                              <button 
                                onClick={() => handleOpenEditModal(item)}
                                className="w-full text-left px-4 py-2 text-sm font-bold text-on-surface hover:bg-primary/5 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span> Editar
                              </button>
                              <button 
                                onClick={() => handleOpenDeleteModal(item)}
                                className="w-full text-left px-4 py-2 text-sm font-bold text-error hover:bg-error/5 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span> Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#FFCCBC] animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-on-surface mb-6">
              {editingId ? 'Editar Insumo' : 'Novo Insumo'}
            </h2>
            <form onSubmit={handleSaveInsumo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-on-surface-variant uppercase mb-2">Nome do Item</label>
                <input 
                  autoFocus required
                  className="w-full p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold"
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-on-surface-variant uppercase mb-2">Quantidade</label>
                <input 
                  required type="number"
                  className="w-full p-3 bg-on-surface/5 border border-on-surface/10 rounded-xl outline-none focus:border-primary text-on-surface font-bold"
                  value={novaQtd}
                  onChange={e => setNovaQtd(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 font-bold text-on-surface-variant hover:bg-on-surface/5 rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:brightness-110">{editingId ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-100 backdrop-blur-sm p-4">
    <div className="bg-white p-10 rounded-4xl shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200">
      
      {/* ÍCONE  Usando 'delete' */}
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-red-600 text-4xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 700" }}>
          delete
        </span>
      </div>

      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
        Confirmar Exclusão
      </h2>
      
      <p className="text-slate-600 font-medium leading-relaxed mb-10">
        Você tem certeza que deseja excluir <span className="font-black text-slate-900 italic">"{itemToDelete?.nome}"</span>? Esta ação não pode ser desfeita.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* BOTÃO MANTER */}
        <button 
          onClick={() => setIsDeleteModalOpen(false)}
          className="flex-1 px-6 py-4 font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-2xl transition-all order-2 sm:order-1 uppercase text-xs tracking-widest"
        >
          Manter item
        </button>
        
        {/* BOTÃO EXCLUIR */}
        <button 
          onClick={confirmDelete}
          className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200 order-1 sm:order-2 text-xs"
        >
          Sim, Excluir
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function StatCard({ label, value, icon, color, isError }: {
  label: string;
  value: string;
  icon: string;
  color: string;
  isError?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#FFCCBC] flex items-center gap-6 hover:shadow-xl transition-all group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${color}10` }}>
        <span className="material-symbols-outlined text-3xl font-black" style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className={`text-3xl font-black ${isError ? 'text-error' : 'text-on-surface'}`}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    baixo: { bg: 'bg-red-100', text: 'text-red-700', icon: 'warning', label: 'Estoque Baixo' },
    normal: { bg: 'bg-green-100', text: 'text-green-800', icon: 'check_circle', label: 'Normal' },
  }[status as 'baixo' | 'normal'] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'help', label: 'Indefinido' };

  return (
    <span className={`px-4 py-2 rounded-full ${config.bg} ${config.text} text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit`}>
      <span className="material-symbols-outlined text-sm font-black">{config.icon}</span>
      {config.label}
    </span>
  );
}