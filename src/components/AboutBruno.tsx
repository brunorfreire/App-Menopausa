import React from 'react';
import { BRUNO_INFO } from '../data/stepsData';
import WhatsAppButton from './WhatsAppButton';
import {
  UserCheck,
  MapPin,
  Globe2,
  CalendarCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Phone,
  Heart,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react';

interface AboutBrunoProps {
  onNavigateToAnamnese?: () => void;
}

export default function AboutBruno({ onNavigateToAnamnese }: AboutBrunoProps) {
  const faqs = [
    {
      q: 'Nunca fiz musculação na vida. É seguro começar agora na menopausa?',
      a: 'Sim, e é um dos melhores momentos! Nunca é tarde para construir força. O treinamento resistido começa com movimentos básicos, controle motor e cargas leves que aumentam gradativamente conforme seu corpo se adapta. O mais importante é a orientação profissional personalizada.',
    },
    {
      q: 'Tenho diagnóstico de osteopenia ou osteoporose. Posso levantar pesos?',
      a: 'Não só pode como deve! A musculação bem orientada gera a tensão mecânica necessária para ativar as células que mantêm os ossos fortes. O que deve ser evitado são movimentos bruscos e de alta torção da coluna sem suporte, por isso a avaliação prévia com o Bruno e liberação do seu médico são fundamentais.',
    },
    {
      q: 'Em dias de insônia ou ondas de calor intensas, devo treinar ou faltar?',
      a: 'Conforme ensina o Passo 5 do guia, respeitamos sua recuperação. Em dias de cansaço agudo, não force um treino de alta intensidade; faça uma sessão regenerativa com foco em mobilidade ou caminhada leve, ou reduza o peso. O Bruno ajusta a planilha para que o exercício seja um aliado, não um fardo.',
    },
    {
      q: 'Como funciona a Consultoria Online do Bruno Freire?',
      a: 'Você recebe um plano de treino 100% individualizado através de aplicativo com vídeos explicativos gravados, correção de movimentos por vídeo e suporte direto no WhatsApp para tirar dúvidas e calibrar cargas semanalmente.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Bio Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* Avatar / Badge */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-[#0A1A2B] via-cyan-900 to-[#E76F51] p-1 shadow-lg overflow-hidden">
              <img
                src="/1000745804.jpg"
                alt="Bruno Freire Personal Trainer"
                className="w-full h-full object-cover rounded-[22px] bg-[#081726]"
                onError={(e) => {
                  e.currentTarget.src = '/logo.svg';
                }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-1.5 w-full">
              <div className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-700" />
                <span>Zona Sul do Rio de Janeiro</span>
              </div>
              <div className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
                <Globe2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Consultoria Online Global</span>
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criador do Guia 7 Passos - Menopausa e Movimento</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Bruno Freire
              </h2>
              <p className="text-sm font-semibold text-rose-800">
                {BRUNO_INFO.specialty}
              </p>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              O Bruno Freire desenvolveu o <strong>Guia 7 Passos</strong> para desmistificar o envelhecimento feminino e comprovar que a menopausa é um momento potente de renovação de força. Com uma abordagem humanizada, empática e rigidamente baseada na fisiologia do exercício, ele orienta alunas a conquistarem ossos densos, postura alinhada e autonomia plena.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Treino Sem Dor:</strong> progressão articular segura respeitando suas queixas.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100 text-left">
                <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Acolhimento Real:</strong> sintonia com o seu ciclo, sono e energia do dia.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <WhatsAppButton
                label="Agendar Avaliação Personalizada"
                customMessage="Olá Bruno! Gostaria de agendar uma Avaliação Personalizada com você para iniciar meus treinos com foco na menopausa."
              />
              <a
                href={`tel:${BRUNO_INFO.phoneClean}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-all"
              >
                <Phone className="w-4 h-4 text-stone-500" />
                <span>Ligar: {BRUNO_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona a Avaliação Personalizada */}
      <div className="bg-gradient-to-br from-stone-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
            Passo a Passo
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Como funciona a Avaliação com o Bruno Freire
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">
            Do primeiro contato até seu primeiro mês de evolução, tudo é planejado com precisão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h4 className="font-semibold text-white text-base">Conversa Inicial & Anamnese</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Mapeamento de histórico esportivo, cirurgias, dores prévias, laudos de densitometria e sintomas hormonais.
            </p>
            {onNavigateToAnamnese && (
              <button
                type="button"
                onClick={onNavigateToAnamnese}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E76F51] hover:bg-[#d85e42] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Preencher Anamnese Online</span>
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h4 className="font-semibold text-white text-base">Análise de Movimento</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Avaliação dos 4 movimentos fundamentais: agachar, levantar, empurrar e puxar, testando estabilidade e mobilidade.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h4 className="font-semibold text-white text-base">Prescrição & Acompanhamento</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Periodização flexível (2x na semana de força + cardio moderado) com ajustes contínuos e comunicação via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              Dúvidas Frequentes sobre Menopausa & Exercício
            </h3>
            <p className="text-xs text-stone-500">
              Respostas baseadas nas diretrizes do guia e evidências científicas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-100 space-y-2">
              <h4 className="font-semibold text-stone-900 text-sm leading-snug">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-100 text-center">
          <p className="text-xs sm:text-sm text-stone-600 mb-3">
            Tem uma pergunta específica sobre seu caso? O Bruno Freire responde pessoalmente no WhatsApp.
          </p>
          <WhatsAppButton
            label="Conversar com Bruno Freire no WhatsApp"
            customMessage="Olá Bruno! Tenho uma dúvida sobre treino na menopausa e gostaria de conversar com você."
          />
        </div>
      </div>
    </div>
  );
}
