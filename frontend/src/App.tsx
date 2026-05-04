import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KitchenView } from './features/kitchen/KitchenView';
import { POSView } from './features/pos/POSView';
import { SalesView } from './features/sales/SalesView';
import { StockView } from './features/stock/StockView';
import { LoginView } from './features/login/LoginView'; // Importe o seu Login
import type { ViewType } from './types/types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('kds');
  // Estado para controlar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se existe o token ao carregar o app
    const token = localStorage.getItem('@ByteToBite:token');
    setIsAuthenticated(!!token);
  }, []);

  // Se não estiver logado, mostra apenas a tela de login
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'kds': return <KitchenView key="kds" />;
      case 'pos': return <POSView key="pos" />;
      case 'sales': return <SalesView key="sales" />;
      case 'stock': return <StockView key="stock" />;
      case 'settings':
        return (
          <div className="p-stack-lg flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <span className="material-symbols-outlined text-8xl text-on-surface/10 mb-6">settings</span>
              <h2 className="text-2xl font-black text-on-surface">Configurações</h2>
              <p className="text-on-surface-variant font-medium">Em implementação.</p>
            </div>
          </div>
        );
      default: return <KitchenView key="kds" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}