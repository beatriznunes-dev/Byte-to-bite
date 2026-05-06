import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { MetodoPagamento } from '../../types/types';

// --- TIPOS ---
export interface SaleRecord {
  id: string;
  total: number;
  pagamento: MetodoPagamento;
  itens: Array<{
    produtoId: number;
    nome: string;
    quantidade: number;
    precoDaUnidade: number;
    imagemUrl?: string;
  }>;
  hora: Date;
}

interface SalesContextData {
  sales: SaleRecord[];
  registrarVenda: (venda: SaleRecord) => void;
}

// --- CONTEXT ---
const SalesContext = createContext<SalesContextData>({
  sales: [],
  registrarVenda: () => {},
});

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<SaleRecord[]>([]);

  const registrarVenda = useCallback((venda: SaleRecord) => {
    setSales((prev) => [...prev, venda]);
  }, []);

  return (
    <SalesContext.Provider value={{ sales, registrarVenda }}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  return useContext(SalesContext);
}