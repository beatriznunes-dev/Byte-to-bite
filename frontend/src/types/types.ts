// --- ENUMS SINCRONIZADOS COM O PRISMA ---
export type Role = 'ADMIN' | 'ENTREGADOR' | 'USUARIO';
export type StatusPedido = 'EM_PREPARO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO';
export type MetodoPagamento = 'PIX' | 'CARTAO' | 'DINHEIRO';

// --- INTERFACES DO BANCO DE DADOS ---

export interface Ingrediente {
  id: number;           
  nome: string;         
  estoque: number;      
  createdAt?: string;
}

// Interface para a relação Muitos-para-Muitos entre Produto e Ingrediente
export interface ProdutoIngrediente {
  id: number;
  produtoId: number;
  ingredienteId: number;
  ingrediente?: Ingrediente; // Carregamento opcional do objeto do ingrediente
}

export interface Produto {
  ingredientes: ProdutoIngrediente[]; 
  // Removido import de JSX do runtime (propriedades de estado visual devem ser booleanas)
  isPopular: boolean; 
  id: number;
  nome: string;
  descricao: string;
  preco: number;        
  promocao?: number;
  estoque: number;
  imagemUrl?: string;
  tempoProducao: number;
  categoria: string;    
}

export interface Pedido {
  id: string;           
  usuarioId: string;
  enderecoId: string;
  precoTotal: number;
  status: StatusPedido;
  pagamento?: MetodoPagamento;
  createdAt: string;
  imagemUrl?: string;
  item?: ItemPedido[];  
}

export interface ItemPedido {
  id: number;
  pedioId: string;      
  produtoId: number;
  precoDaUnidade: number;
  quantidade: number;
  produto?: Produto;
  observacao?: string; // Adicionado campo comum em itens de pedido
}

export type ViewType = 'kds' | 'pos' | 'sales' | 'stock' | 'settings';