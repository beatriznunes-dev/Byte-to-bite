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

export interface Produto {
  isPopular: import("react/jsx-runtime").JSX.Element;
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
}

export type ViewType = 'kds' | 'pos' | 'sales' | 'stock' | 'settings';