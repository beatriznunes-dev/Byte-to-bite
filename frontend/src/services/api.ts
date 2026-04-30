export type Role = 'ADMIN' | 'ENTREGADOR' | 'USUARIO';
export type StatusPedido = 'EM_PREPARO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO';
export type MetodoPagamento = 'PIX' | 'CARTAO' | 'DINHEIRO';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: Role;
}

export interface Ingrediente {
  id: number;
  nome: string;
  estoque: number;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  promocao?: number;
  estoque: number;
  imagemUrl?: string;
  tempoProducao: number;
  ingredientes?: ProdutoIngrediente[];
}

export interface ProdutoIngrediente {
  produtoId: number;
  ingredienteId: number;
  quantidade: number;
  ingrediente?: Ingrediente;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  enderecoId: string;
  precoTotal: number;
  status: StatusPedido;
  pagamento: MetodoPagamento;
  createdAt: string;
  item: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  quantidade: number;
  precoDaUnidade: number;
  produto?: Produto;
}