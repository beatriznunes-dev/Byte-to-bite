export type OrderStatus = 'recebido' | 'preparando' | 'pronto' | 'atrasado';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber?: string;
  deliveryId?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  startTime?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  isPopular?: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  status: 'normal' | 'baixo' | 'aguardando';
  quantity: number;
  unit: string;
  lastRestock: string;
  icon: string;
}

export type ViewType = 'kds' | 'pos' | 'sales' | 'stock' | 'settings';