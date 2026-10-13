import { useState } from 'react';
import { Bot, BookOpen, CheckSquare, User, MessageCircle, ClipboardCheck } from 'lucide-react';
import { BRUNO_INFO } from '../data/stepsData';

interface NavbarProps {
  activeTab: 'chat' | 'steps' | 'checklist' | 'anamnese' | 'about';
  setActiveTab: (tab: 'chat' | 'steps' | 'checklist' | 'anamnese' | 'about') => void;
  checklistCount: number;
}

export default function Navbar({ activeTab, setActiveTab, checklistCount }: NavbarProps) {
  const [imageError, setImageError] = useState(false);

  interface TabItem {
    id: 'chat' | 'steps' | 'checklist' | 'anamnese' | 'about';
    label: string;
    icon: typeof Bot;
    badge?: string;
  }

  const tabs: TabItem[] = [
    { id: 'chat', label: 'Assistente Virtual', icon: Bot, badge: 'IA' },
    { id: 'steps', label: 'Os 7 Passos', icon: BookOpen },
    { id: 'checklist', label: 'Checklist da Semana', icon: CheckSquare, badge: checklistCount > 0 ? `${checklistCount}/7` : undefined },
    { id: 'anamnese', label: 'Anamnese Inicial', icon: ClipboardCheck, badge: 'Passo 1' },
    { id: 'about', label: 'Bruno Freire', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A1A2B] border-b border-cyan-900/40 shadow-lg text-white">
      {/* Top Banner with Centered Logo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-3">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Centered Responsive Logo */}
          <div
            onClick={() => {
              setActiveTab('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-[1.02]"
            title="Ir para a página inicial"
          >
            <div className="relative">
              {/* Subtle neon glow ring matching Coral and Azul Petróleo */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-500 to-[#E76F51] opacity-75 blur-xs group-hover:opacity-100 transition-opacity" />

              {!imageError ? (
                <img
                  src="/1000745804.jpg"
                  alt="Bruno Freire Personal Trainer - Logo"
                  className="relative h-20 sm:h-24 md:h-28 w-auto max-w-[280px] sm:max-w-[340px] object-contain rounded-xl bg-[#081726] p-1 shadow-md border border-cyan-500/30"
                  onError={() => {
                    // Try fallback uploaded filename or SVG
                    setImageError(true);
                  }}
                />
              ) : (
                <img
                  src="/logo.svg"
                  alt="Bruno Freire Personal Trainer - Logo"
                  className="relative h-20 sm:h-24 md:h-28 w-auto max-w-[280px] sm:max-w-[340px] object-contain rounded-xl bg-[#081726] p-1 shadow-md border border-cyan-500/30"
                />
              )}
            </div>

            {/* App Subtitle & Badges */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white">
                Guia 7 Passos
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E76F51] text-white shadow-xs">
                Menopausa & Movimento
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 font-medium mt-0.5">
              Preservando Força, Saúde Óssea e Qualidade de Vida
            </p>
          </div>

          {/* Quick WhatsApp Action bar on header */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <a
              href={BRUNO_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:shadow active:scale-95"
              title="Falar no WhatsApp com o Personal Bruno Freire"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: (21) 98205-3338</span>
              <span className="hidden sm:inline text-[10px] text-emerald-200">• Rio de Janeiro & Online</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs Styled in Coral & Azul Petróleo */}
        <nav
          aria-label="Navegação principal"
          className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-full w-full px-1 sm:px-2 pt-2.5 pb-1 border-t border-cyan-900/50"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      isActive ? 'bg-black/25 text-white' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
