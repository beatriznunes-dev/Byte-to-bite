import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KitchenView } from './components/KitchenView';
import { POSView } from './components/POSView';
import { SalesView } from './components/SalesView';
import { StockView } from './components/StockView';
import type { ViewType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('kds');

  const renderView = () => {
    switch (currentView) {
      case 'kds':
        return <KitchenView key="kds" />;
      case 'pos':
        return <POSView key="pos" />;
      case 'sales':
        return <SalesView key="sales" />;
      case 'stock':
        return <StockView key="stock" />;
      case 'settings':
        return (
          <div className="p-stack-lg flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <span className="material-symbols-outlined text-8xl text-on-surface/10 mb-6">settings</span>
              <h2 className="text-2xl font-black text-on-surface">Configurações do Sistema</h2>
              <p className="text-on-surface-variant font-medium">Esta funcionalidade está sendo implementada.</p>
            </div>
          </div>
        );
      default:
        return <KitchenView key="kds" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => setCurrentView(view)} 
      />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header currentView={currentView} />
        
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
