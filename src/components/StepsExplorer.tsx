import React, { useState } from 'react';
import { STEPS_DATA } from '../data/stepsData';
import {
  Dumbbell,
  Shield,
  HeartPulse,
  Compass,
  Moon,
  Sparkles,
  Target,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  HelpCircle,
  BookOpen,
  Check,
  ChevronDown,
} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface StepsExplorerProps {
  onAskStepInChat: (stepTitle: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Shield,
  HeartPulse,
  Compass,
  Moon,
  Sparkles,
  Target,
};

export default function StepsExplorer({ onAskStepInChat }: StepsExplorerProps) {
  const [selectedStepId, setSelectedStepId] = useState<number>(1);

  const handleSelectStep = (stepId: number) => {
    setSelectedStepId(stepId);

    // Scroll smoothly to the detail explanation section with header offset
    setTimeout(() => {
      const detailElement = document.getElementById('detalhes-passo-container');
      if (detailElement) {
        const headerOffset = 90;
        const elementPosition = detailElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const handleScrollToGrid = () => {
    const gridElement = document.getElementById('grid-dos-7-passos');
    if (gridElement) {
      const headerOffset = 90;
      const elementPosition = gridElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const activeStep = STEPS_DATA.find((s) => s.id === selectedStepId) || STEPS_DATA[0];
  const ActiveIcon = iconMap[activeStep.icon] || Dumbbell;

  return (
    <div className="space-y-8">
      {/* Introduction Header */}
      <div className="bg-gradient-to-r from-[#0A1A2B] via-[#0D2538] to-[#13324d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-cyan-900/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E76F51]/20 border border-[#E76F51]/40 text-[#ff8a70] text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Base Científica & Prática Clínica</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white mb-2">
            Os 7 Passos para a Menopausa em Movimento
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            A menopausa é uma transição natural, e a sua força pode e deve continuar crescendo. Clique em qualquer um dos cards abaixo para abrir a explicação completa, embasamento científico e orientações práticas.
          </p>
        </div>
      </div>

      {/* Grid of Steps */}
      <div id="grid-dos-7-passos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-mt-24">
        {STEPS_DATA.map((step) => {
          const Icon = iconMap[step.icon] || Dumbbell;
          const isSelected = selectedStepId === step.id;

          return (
            <a
              key={step.id}
              href={`#detalhe-passo-${step.id}`}
              id={`card-passo-${step.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleSelectStep(step.id);
              }}
              role="button"
              className={`block text-left rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E76F51] ${
                isSelected
                  ? 'bg-gradient-to-br from-[#0A1A2B] to-[#112d45] text-white border-cyan-500/60 shadow-lg ring-2 ring-[#E76F51]'
                  : 'bg-white border-stone-200/90 hover:border-[#E76F51] hover:shadow-md text-stone-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#E76F51] text-white shadow-md'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Passo {step.id} de 7
                  </span>
                </div>

                <h3
                  className={`font-serif font-bold text-base sm:text-lg leading-snug mb-1.5 ${
                    isSelected ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 ${
                    isSelected ? 'text-cyan-100/80' : 'text-stone-600'
                  }`}
                >
                  {step.tagline}
                </p>
              </div>

              {/* Action trigger row */}
              <div
                className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                  isSelected ? 'border-cyan-900/60 text-[#ff8a70]' : 'border-stone-100 text-[#E76F51]'
                }`}
              >
                <span>
                  {isSelected ? 'Explicação aberta abaixo ↓' : 'Clique para ver detalhes →'}
                </span>
                {isSelected ? (
                  <ChevronDown className="w-4 h-4 text-[#ff8a70] animate-bounce" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1" />
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Detailed View of Selected Step */}
      <div
        id="detalhes-passo-container"
        className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md space-y-6 scroll-mt-24"
      >
        {/* Navigation Step Pills (Quick Step Switcher) */}
        <div className="pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Alternar entre os 7 passos:
            </span>
            <button
              onClick={handleScrollToGrid}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Ver todos os cards ↑</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STEPS_DATA.map((s) => {
              const isCurrent = s.id === activeStep.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStep(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#E76F51] text-white shadow-sm shadow-[#E76F51]/30 ring-2 ring-[#E76F51]/30'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Passo {s.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header of Detail with anchor target */}
        <div
          id={`detalhe-passo-${activeStep.id}`}
          className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1A2B] text-[#E76F51] border border-cyan-900/60 flex items-center justify-center shadow-md">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E76F51]">
                Detalhamento Completo • Passo {activeStep.id} de 7
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {activeStep.title}
              </h3>
            </div>
          </div>

          {/* Chat action button */}
          <button
            onClick={() => onAskStepInChat(activeStep.title)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>Tirar dúvida com o Assistente</span>
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Why & How */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Por que este passo é essencial na menopausa?
              </h4>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
                {activeStep.whyItMatters}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Como aplicar no seu dia a dia
              </h4>
              <ul className="space-y-2">
                {activeStep.howToApply.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Evidence, Quote & Reflection */}
          <div className="space-y-5">
            {/* Scientific Evidence */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>O que diz a ciência</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
                {activeStep.scientificEvidence}
              </p>
            </div>

            {/* Bruno Quote */}
            <div className="bg-[#0A1A2B] text-white border border-cyan-900/50 rounded-2xl p-4 sm:p-5 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff8a70] block mb-1">
                Palavra do Personal Bruno Freire
              </span>
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                "{activeStep.brunoQuote}"
              </p>
            </div>

            {/* Reflective Question */}
            <div className="bg-stone-100/90 border border-stone-200 rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Pergunta reflexiva para você:
              </h4>
              <p className="text-xs sm:text-sm font-medium text-stone-900">
                {activeStep.reflectiveQuestion}
              </p>
              <button
                onClick={() =>
                  onAskStepInChat(
                    `Gostaria de responder a reflexão do Passo ${activeStep.id}: "${activeStep.reflectiveQuestion}"`
                  )
                }
                className="mt-3 text-xs font-semibold text-[#E76F51] hover:text-[#d85e42] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Conversar com o assistente sobre isso &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step Prev / Next Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          {activeStep.id > 1 ? (
            <button
              onClick={() => handleSelectStep(activeStep.id - 1)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Passo {activeStep.id - 1}</span>
            </button>
          ) : (
            <div />
          )}

          {activeStep.id < 7 ? (
            <button
              onClick={() => handleSelectStep(activeStep.id + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#E76F51] hover:bg-[#d85e42] transition-all cursor-pointer shadow-xs"
            >
              <span>Passo {activeStep.id + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleScrollToGrid}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Voltar ao início</span>
            </button>
          )}
        </div>

        {/* Bottom CTA for step */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            Quer prescrever o {activeStep.title.toLowerCase()} com segurança máxima para a sua rotina?
          </div>
          <WhatsAppButton
            label={`Avaliação Personalizada (Passo ${activeStep.id})`}
            customMessage={`Olá Bruno! Estive estudando o Passo ${activeStep.id} ("${activeStep.title}") no App Guia 7 Passos e quero uma avaliação personalizada para o meu caso.`}
          />
        </div>
      </div>
    </div>
  );
}
