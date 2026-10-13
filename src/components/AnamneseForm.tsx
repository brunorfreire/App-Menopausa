import React, { useState, useEffect } from 'react';
import { AnamneseData } from '../types';
import { BRUNO_INFO } from '../data/stepsData';
import {
  ClipboardCheck,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  HeartPulse,
} from 'lucide-react';

const STORAGE_KEY = 'guia_menopausa_anamnese_draft';

const INITIAL_FORM: AnamneseData = {
  nome: '',
  idade: '',
  historicoEsportivo: '',
  historicoCirurgias: '',
  dores: '',
  laudosExames: '',
  sintomasHormonais: '',
  objetivoPrincipal: '',
};

export default function AnamneseForm() {
  const [formData, setFormData] = useState<AnamneseData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading anamnese draft', e);
      }
    }
    return INITIAL_FORM;
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  // Auto-save draft in localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage && name === 'nome' && value.trim()) {
      setErrorMessage(null);
    }
  };

  const handleReset = () => {
    if (window.confirm('Deseja limpar todos os campos preenchidos da anamnese?')) {
      setFormData(INITIAL_FORM);
      localStorage.removeItem(STORAGE_KEY);
      setErrorMessage(null);
      setIsSent(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setErrorMessage('Por favor, preencha pelo menos o seu nome completo antes de enviar.');
      return;
    }

    setErrorMessage(null);

    const clean = (val: string | undefined) => (val ? val.trim() : '');

    // Format text with line breaks and sections
    const textLines = [
      '📋 *ANAMNESE & DIAGNÓSTICO CLÍNICO FUNCIONAL*',
      '_Passo 1 da Avaliação - Personal Trainer Bruno Freire_',
      '',
      `👤 *Nome completo:* ${formData.nome.trim()}`,
      `🎂 *Idade:* ${clean(formData.idade) ? `${clean(formData.idade)} anos` : 'Não informada'}`,
      '',
      '🏃‍♀️ *1. Rotina de Exercícios Atual / Histórico:*',
      `${clean(formData.historicoEsportivo) || 'Não informado'}`,
      '',
      '🏥 *2. Histórico de Cirurgias e Lesões:*',
      `${clean(formData.historicoCirurgias) || 'Nenhuma informada'}`,
      '',
      '⚡ *3. Dores Prévias ou Atuais (Articulações/Músculos):*',
      `${clean(formData.dores) || 'Nenhuma dor relatada'}`,
      '',
      '🩺 *4. Laudos e Exames Recentes (Densitometria/Cardio):*',
      `${clean(formData.laudosExames) || 'Não informados'}`,
      '',
      '🌸 *5. Sintomas da Menopausa mais Impactantes:*',
      `${clean(formData.sintomasHormonais) || 'Não informados'}`,
      '',
      '🎯 *6. Objetivo Principal nos Próximos 90 Dias:*',
      `${clean(formData.objetivoPrincipal) || 'Ganhar força e qualidade de vida'}`,
      '',
      '----------------------------------',
      '_Enviado pelo App Guia 7 Passos - Menopausa e Movimento_',
    ];

    const formattedMessage = textLines.join('\n');
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${BRUNO_INFO.phoneClean}?text=${encodedMessage}`;

    setIsSent(true);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#071626] via-[#0A1A2B] to-[#0D2840] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-cyan-900/50">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-[#E76F51]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E76F51]/25 border border-[#E76F51]/40 text-coral-200 text-xs font-semibold mb-3">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#E76F51]" />
            <span>Passo 1 da Avaliação • Personal Bruno Freire</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white mb-2">
            Conversa Inicial & Anamnese
          </h2>

          <p className="text-cyan-100/90 text-sm sm:text-base leading-relaxed">
            Preencha seu <strong>Diagnóstico Clínico Funcional</strong> abaixo para que o Personal Trainer Bruno Freire conheça seu histórico de saúde, lesões e sintomas hormonais antes de prescrever seu treino individualizado.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-cyan-200 font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">
              Zona Sul do Rio de Janeiro
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">
              Consultoria Online Nacional & Global
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Container (Dark Theme as requested) */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0A1A2B] border border-cyan-900/50 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-900/60">
          <div className="flex items-center gap-2 text-sm text-cyan-200 font-medium">
            <HeartPulse className="w-4 h-4 text-[#E76F51]" />
            <span>Suas respostas são salvas automaticamente no seu navegador.</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 hover:text-white transition-all"
            title="Limpar respostas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Formulário</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/80 text-rose-200 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success / already sent banner */}
        {isSent && (
          <div className="bg-emerald-950/70 border border-emerald-500/80 text-emerald-200 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Anamnese enviada para o WhatsApp! Se precisar ajustar algo, edite os campos e clique novamente.
            </span>
          </div>
        )}

        {/* Fields Grid */}
        <div className="space-y-5">
          {/* Row: Nome & Idade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="nome" className="block text-xs sm:text-sm font-semibold text-slate-200">
                Nome Completo <span className="text-[#E76F51]">*</span>
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Maria da Silva"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="idade" className="block text-xs sm:text-sm font-semibold text-slate-200">
                Idade
              </label>
              <input
                type="number"
                id="idade"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                placeholder="Ex: 52"
                min="18"
                max="100"
                className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all"
              />
            </div>
          </div>

          {/* Campo 1: Histórico Esportivo / Atividade Atual */}
          <div className="space-y-1.5">
            <label htmlFor="historicoEsportivo" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Histórico Esportivo / Atividade Atual
            </label>
            <span className="block text-xs text-cyan-200/70">
              "Como é a sua rotina de exercícios hoje?"
            </span>
            <textarea
              id="historicoEsportivo"
              name="historicoEsportivo"
              value={formData.historicoEsportivo}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Faço caminhada 2x por semana há 6 meses, mas nunca fiz musculação com pesos livres..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>

          {/* Campo 2: Histórico de Cirurgias e Lesões */}
          <div className="space-y-1.5">
            <label htmlFor="historicoCirurgias" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Histórico de Cirurgias e Lesões
            </label>
            <span className="block text-xs text-cyan-200/70">
              "Já passou por alguma cirurgia ou teve lesões graves?"
            </span>
            <textarea
              id="historicoCirurgias"
              name="historicoCirurgias"
              value={formData.historicoCirurgias}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Cirurgia de menisco no joelho direito há 5 anos, sem outras cirurgias..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>

          {/* Campo 3: Dores Prévias ou Atuais */}
          <div className="space-y-1.5">
            <label htmlFor="dores" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Dores Prévias ou Atuais
            </label>
            <span className="block text-xs text-cyan-200/70">
              "Sente dor em alguma articulação ou músculo atualmente?"
            </span>
            <textarea
              id="dores"
              name="dores"
              value={formData.dores}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Desconforto na lombar após muito tempo sentada e dor leve no ombro esquerdo ao levantar peso..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>

          {/* Campo 4: Laudos e Exames */}
          <div className="space-y-1.5">
            <label htmlFor="laudosExames" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Laudos e Exames
            </label>
            <span className="block text-xs text-cyan-200/70">
              "Fez densitometria óssea ou exames cardiológicos recentes? Como estão os resultados?"
            </span>
            <textarea
              id="laudosExames"
              name="laudosExames"
              value={formData.laudosExames}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Densitometria acusou osteopenia no colo do fêmur. Exames cardíacos e pressão controlados..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>

          {/* Campo 5: Sintomas Hormonais / Menopausa */}
          <div className="space-y-1.5">
            <label htmlFor="sintomasHormonais" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Sintomas Hormonais / Menopausa
            </label>
            <span className="block text-xs text-cyan-200/70">
              "Quais sintomas da menopausa mais impactam sua rotina hoje? (Ex: sono, ondas de calor, fadiga)"
            </span>
            <textarea
              id="sintomasHormonais"
              name="sintomasHormonais"
              value={formData.sintomasHormonais}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Insônia frequente, fogachos à noite e sensação de cansaço pela manhã..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>

          {/* Campo 6: Objetivo Principal */}
          <div className="space-y-1.5">
            <label htmlFor="objetivoPrincipal" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Objetivo Principal
            </label>
            <span className="block text-xs text-cyan-200/70">
              "O que você mais deseja alcançar nos próximos 90 dias?"
            </span>
            <textarea
              id="objetivoPrincipal"
              name="objetivoPrincipal"
              value={formData.objetivoPrincipal}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Fortalecer pernas e costas para não ter dores, proteger meus ossos e ter mais energia no dia a dia..."
              className="w-full px-4 py-3 rounded-2xl bg-[#06121e] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51] transition-all resize-y"
            />
          </div>
        </div>

        {/* Warning notice above submit button as requested */}
        <div className="p-4 rounded-2xl bg-[#06121e] border border-cyan-800/40 text-xs sm:text-sm text-cyan-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Aviso de Envio:</strong> Ao clicar em enviar, seu WhatsApp será aberto com suas respostas prontas para envio direto ao Personal Trainer Bruno Freire.
          </p>
        </div>

        {/* Large Prominent Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 fill-current shrink-0" />
            <span>Enviar Anamnese pelo WhatsApp</span>
          </button>
        </div>

        <div className="text-center text-xs text-slate-400">
          WhatsApp direto: <strong className="text-white font-mono">{BRUNO_INFO.phoneDisplay}</strong> • Atendimento Presencial na Zona Sul do Rio e Consultoria Online
        </div>
      </form>
    </div>
  );
}
