import React from 'react';
import { ChecklistItem } from '../types';
import { BRUNO_INFO } from '../data/stepsData';
import { CheckCircle2, Circle, RotateCcw, Share2, Sparkles, MessageSquareQuote, Flame } from 'lucide-react';

interface WeeklyChecklistProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onResetChecklist: () => void;
  onAskInChat: (question: string) => void;
}

export default function WeeklyChecklist({
  checklist,
  onToggleItem,
  onResetChecklist,
  onAskInChat,
}: WeeklyChecklistProps) {
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getProgressMessage = () => {
    if (completedCount === 0) return 'Comece marcando o primeiro hábito de autocuidado da sua semana!';
    if (completedCount <= 2) return 'Ótimo começo! Cada movimento conta para sua força e vitalidade.';
    if (completedCount <= 4) return 'Mais da metade do caminho percorrido! Sua consistência está construindo longevidade.';
    if (completedCount < totalCount) return 'Quase lá! Semana fantástica de cuidado com seus ossos e mente.';
    return 'Parabéns! Semana completa cumprida com autonomia e dedicação!';
  };

  const handleShareToWhatsApp = () => {
    const lines = [
      'Olá Bruno! Segue meu progresso da semana no App Guia 7 Passos - Menopausa e Movimento:',
      '',
      `Progresso: ${completedCount}/${totalCount} (${progressPercent}%)`,
      ...checklist.map((item) => `${item.completed ? '✅' : '⬜'} ${item.label}`),
      '',
      'Gostaria de tirar uma dúvida sobre meus treinos e agendar minha Avaliação Personalizada!',
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${BRUNO_INFO.phoneClean}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0A1A2B] via-[#0D2538] to-[#13324d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-cyan-900/40">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#E76F51]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E76F51]/25 border border-[#E76F51]/40 text-coral-200 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-[#E76F51]" />
            <span className="text-white">Acompanhamento Semanal de Hábitos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white mb-2">
            Checklist da Semana
          </h2>
          <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
            Pequenas escolhas diárias protegem sua densidade óssea, preservam sua massa magra e trazem vitalidade para viver a menopausa com plenitude.
          </p>

          {/* Progress Bar & Status */}
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
              <span className="text-rose-100">{getProgressMessage()}</span>
              <span className="font-bold text-amber-300">{completedCount} de {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-300 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-100/80 p-3 sm:p-4 rounded-2xl border border-stone-200/80">
        <div className="text-xs sm:text-sm text-stone-600 font-medium">
          Dica: marque as caixas conforme for cumprindo suas metas ao longo dos dias.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetChecklist}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-2xs"
            title="Reiniciar semana"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar Semana</span>
          </button>
          <button
            onClick={handleShareToWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
            title="Enviar progresso para o Bruno no WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar no WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {checklist.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex items-start gap-4 ${
              item.completed
                ? 'bg-rose-50/70 border-rose-300/80 shadow-xs'
                : 'bg-white border-stone-200/80 hover:border-rose-300 hover:shadow-xs'
            }`}
          >
            {/* Check icon */}
            <button
              type="button"
              className="mt-0.5 shrink-0 focus:outline-none"
              aria-label={`Marcar ${item.label}`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-6 h-6 text-rose-700 fill-rose-100" />
              ) : (
                <Circle className="w-6 h-6 text-stone-300 hover:text-rose-400" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-base font-semibold ${item.completed ? 'text-rose-950 line-through decoration-rose-400' : 'text-stone-900'}`}>
                  {index + 1}. {item.label}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
                  {item.target}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                {item.description}
              </p>
              
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                <div className="text-xs text-stone-500 italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{item.tip}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskInChat(`Como posso cumprir melhor o objetivo: "${item.label}" nesta semana?`);
                  }}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-800 hover:underline inline-flex items-center gap-1"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  <span>Tirar dúvida no chat</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encouragement Card */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-center">
        <h3 className="font-serif font-bold text-amber-950 text-base mb-1">
          Sentindo dificuldade para encaixar os 7 pontos na sua rotina?
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mb-3">
          O Bruno Freire monta uma periodização sob medida para sua rotina na Zona Sul do Rio ou em Consultoria Online, dosando o esforço de acordo com seus sintomas e nível atual.
        </p>
        <button
          onClick={handleShareToWhatsApp}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          <span>Agendar Avaliação com Bruno Freire (WhatsApp)</span>
        </button>
      </div>
    </div>
  );
}
