import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import ChatAssistant from './components/ChatAssistant';
import StepsExplorer from './components/StepsExplorer';
import WeeklyChecklist from './components/WeeklyChecklist';
import AboutBruno from './components/AboutBruno';
import AnamneseForm from './components/AnamneseForm';
import WhatsAppButton from './components/WhatsAppButton';
import { INITIAL_CHECKLIST, BRUNO_INFO } from './data/stepsData';
import { ChecklistItem } from './types';
import { Sparkles, MessageCircle, Heart, Dumbbell, Shield, Award, ClipboardCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'steps' | 'checklist' | 'anamnese' | 'about'>('chat');
  const [initialPromptForChat, setInitialPromptForChat] = useState<string | null>(null);

  // Guarantee page loads at the very top (never jump to footer)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Persistent checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('guia_menopausa_checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse checklist', e);
      }
    }
    return INITIAL_CHECKLIST;
  });

  useEffect(() => {
    localStorage.setItem('guia_menopausa_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleResetChecklist = () => {
    if (window.confirm('Deseja desmarcar todos os itens para iniciar uma nova semana?')) {
      setChecklist(INITIAL_CHECKLIST.map((item) => ({ ...item, completed: false })));
    }
  };

  const handleAskInChat = (prompt: string) => {
    setInitialPromptForChat(prompt);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-stone-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        checklistCount={completedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Medical Disclaimer Banner */}
        <MedicalDisclaimer />

        {/* Quick Highlights Strip */}
        <section aria-label="Destaques rápidos" className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          <div
            onClick={() => setActiveTab('steps')}
            className="cursor-pointer bg-white hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E76F51]/15 text-[#E76F51] flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium">Prioridade</div>
              <div className="text-xs font-bold text-stone-900 truncate">Força 2x/Semana</div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('steps')}
            className="cursor-pointer bg-white hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-900/15 text-[#0A1A2B] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium">Saúde Óssea</div>
              <div className="text-xs font-bold text-stone-900 truncate">Densidade & Carga</div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('checklist')}
            className="cursor-pointer bg-white hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium">Metas</div>
              <div className="text-xs font-bold text-stone-900 truncate">{completedCount} de 7 Feitos</div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('anamnese');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer bg-white hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E76F51]/15 text-[#E76F51] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium">Passo 1</div>
              <div className="text-xs font-bold text-stone-900 truncate">Anamnese Inicial</div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('about')}
            className="cursor-pointer bg-white hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2.5 col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0A1A2B]/10 text-[#0A1A2B] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-[#E76F51]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium">Bruno Freire</div>
              <div className="text-xs font-bold text-stone-900 truncate">Avaliação Personal</div>
            </div>
          </div>
        </section>

        {/* Tab Content Rendering */}
        {activeTab === 'chat' && (
          <section aria-label="Assistente Virtual" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Assistente Virtual do Guia
                </h1>
                <p className="text-xs sm:text-sm text-stone-600">
                  Tire dúvidas em tempo real sobre os 7 passos, rotina de exercícios e cuidados na menopausa.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('steps')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200/80 hover:bg-stone-300 text-stone-800 transition-all"
                >
                  Ver os 7 Passos
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-all"
                >
                  Abrir Checklist
                </button>
              </div>
            </div>

            <ChatAssistant
              initialPrompt={initialPromptForChat}
              onClearInitialPrompt={() => setInitialPromptForChat(null)}
              onNavigateToChecklist={() => setActiveTab('checklist')}
            />
          </section>
        )}

        {activeTab === 'steps' && (
          <section aria-label="Os 7 Passos">
            <StepsExplorer onAskStepInChat={handleAskInChat} />
          </section>
        )}

        {activeTab === 'checklist' && (
          <section aria-label="Checklist da Semana">
            <WeeklyChecklist
              checklist={checklist}
              onToggleItem={handleToggleChecklistItem}
              onResetChecklist={handleResetChecklist}
              onAskInChat={handleAskInChat}
            />
          </section>
        )}

        {activeTab === 'anamnese' && (
          <section aria-label="Conversa Inicial & Anamnese">
            <AnamneseForm />
          </section>
        )}

        {activeTab === 'about' && (
          <section aria-label="Sobre o Bruno Freire e Avaliação">
            <AboutBruno
              onNavigateToAnamnese={() => {
                setActiveTab('anamnese');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </section>
        )}
      </main>

      {/* Floating WhatsApp Action for Quick Access */}
      <aside aria-label="Contato Rápido WhatsApp" className="fixed bottom-5 right-5 z-30">
        <a
          href={BRUNO_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
          title="Falar com Bruno Freire no WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Falar com Bruno Freire
          </span>
        </a>
      </aside>

      {/* Footer */}
      <footer className="mt-12 bg-stone-900 text-stone-300 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <span className="font-serif font-bold text-lg text-white">
                  Guia 7 Passos - Menopausa e Movimento
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1 max-w-md">
                Criado pelo Personal Trainer Bruno Freire para acolher, fortalecer e guiar mulheres com base na melhor ciência do exercício.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppButton
                label="WhatsApp do Bruno"
                variant="compact"
                customMessage="Olá Bruno! Estou no App Guia 7 Passos e gostaria de mais informações."
              />
              <span className="text-xs text-stone-400 font-mono">
                {BRUNO_INFO.phoneDisplay}
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-400 leading-relaxed max-w-3xl space-y-2">
            <p>
              <strong>Aviso Médico Legal:</strong> Todo o conteúdo deste aplicativo e as orientações fornecidas pelo assistente virtual têm finalidade exclusivamente educativa e motivacional. Não substituem diagnóstico clínico, consulta ginecológica, avaliação cardiológica ou prescrição médica individualizada.
            </p>
            <p>
              Atendimento presencial na Zona Sul do Rio de Janeiro e Consultoria Online para todo o Brasil e exterior.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
            <div>
              © {new Date().getFullYear()} Guia 7 Passos - Menopausa e Movimento • Bruno Freire
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('chat')} className="hover:text-white transition-colors">
                Assistente Virtual
              </button>
              <button onClick={() => setActiveTab('steps')} className="hover:text-white transition-colors">
                Os 7 Passos
              </button>
              <button onClick={() => setActiveTab('checklist')} className="hover:text-white transition-colors">
                Checklist Semanal
              </button>
              <button onClick={() => setActiveTab('anamnese')} className="hover:text-white transition-colors">
                Anamnese Inicial
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
