import { useState } from "react";
import type { ViewType } from "../../types/types.ts";

interface HeaderProps {
  currentView: ViewType;
  onMenuClick: () => void;
}

const VIEW_LABELS: Record<ViewType, string> = {
  kds: "Monitor de Produção",
  pos: "Painel PDV",
  sales: "Relatório de Vendas",
  stock: "Gestão de Estoque",
  settings: "Configurações do Sistema",
};

export function Header({ currentView, onMenuClick }: HeaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleLogout = () => {
    setIsExiting(true);

    // Tempo para a animação de fade e o spinner serem percebidos
    setTimeout(() => {
      localStorage.clear();
      window.location.replace("/login");
    }, 800);
  };

  return (
    <>
      {/* OVERLAY DE LOGOUT */}
      {isExiting && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="flex items-center justify-center">
            {/* Spinner centralizado sem ícone bugado */}
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-on-surface font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Encerrando Sessão
          </p>
        </div>
      )}

      <header
        className={`flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#FFCCBC] shadow-sm transition-all duration-700 ${isExiting ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100"}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden hover:bg-on-surface/5 rounded-full p-2 transition-all"
          >
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <button className="hidden md:flex hover:bg-on-surface/5 rounded-full p-2 transition-all">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              Painel Operacional
            </h2>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest leading-none">
              {VIEW_LABELS[currentView]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-on-surface">
              Chefe da Cozinha
            </span>
            <span className="text-[10px] text-on-surface-variant tracking-wider uppercase">
              Turno Tarde
            </span>
          </div>

          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border-2 border-primary/20 cursor-pointer hover:border-primary transition-all shadow-sm">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGEvig9_taDIi__yQYBitq-vtvXJyneq13uiV3oLyNIlphLoF7bHMBecPbffpjPamUqnxpB_HuI1I_5pfgIZZc15y5j-Z9oxx8KPSESWES7QxtWBMcO9bmvmd_9o3lTMGxr-7xzD23ezpmoGzshMaPFJ7ex6mZhDKa2Zx4wF6hDjot_h9vHrgKXec6tNC4EGmAAe1WzBa08fWnjQYj86Vf1dSFx3VJF8FwPTwgkheFbhXHKHVaaj8bnMCkJMl5O-a65qWKFmVaE1MR"
              />
            </div>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-on-surface/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50 transform origin-top-right">
              <button className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-on-surface/5 transition-colors text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  person
                </span>
                Perfil
              </button>
              <button className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-on-surface/5 transition-colors text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  notifications
                </span>
                Notificações
              </button>

              <hr className="my-1 border-on-surface/5" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  logout
                </span>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
