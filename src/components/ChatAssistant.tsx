import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { BRUNO_INFO } from '../data/stepsData';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

interface ChatAssistantProps {
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
  onNavigateToChecklist?: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou o assistente virtual do **Guia 7 Passos - Menopausa e Movimento**, criado pelo Personal Trainer **Bruno Freire**. 

Estou aqui para te apoiar a entender e aplicar esses 7 passos essenciais para preservar sua força, saúde óssea e vitalidade com muito acolhimento e respaldo científico!

*(Lembrando sempre que este guia é educativo e não substitui a avaliação do seu médico).*

Qual dos 7 passos você gostaria de explorar primeiro ou prefere conhecer o nosso **Checklist da Semana**?`,
  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  showCta: false,
};

export default function ChatAssistant({
  initialPrompt,
  onClearInitialPrompt,
  onNavigateToChecklist,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('guia_menopausa_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('guia_menopausa_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll only the internal chat container down when user sends or receives messages (never scroll the outer window)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Keep chat container at the top or neutral on initial load
      if (chatMessagesContainerRef.current) {
        chatMessagesContainerRef.current.scrollTop = 0;
      }
      return;
    }

    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  // Handle external prompt passed from steps or checklist
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Text to speech
  const handleToggleSpeak = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for smoother speech
    const cleanText = msg.content
      .replace(/\*\*/g, '')
      .replace(/\[\s*\]/g, '')
      .replace(/[#*_-]/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      const replyText = data.reply || 'Desculpe, tive uma oscilação na resposta. Pode repetir sua dúvida?';

      const mentionsBruno =
        replyText.toLowerCase().includes('bruno') ||
        replyText.toLowerCase().includes('avaliação') ||
        replyText.toLowerCase().includes('98205-3338') ||
        replyText.toLowerCase().includes('whatsapp');

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        showCta: mentionsBruno,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Graceful local reply
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Obrigada pela sua mensagem! O exercício resistido e os hábitos saudáveis apoiam muito seu bem-estar na menopausa. 

Para estruturar um plano de treino individualizado e seguro para você, recomendo uma **Avaliação Personalizada com o Personal Bruno Freire** pelo WhatsApp **(21) 98205-3338** (Zona Sul do Rio de Janeiro ou Consultoria Online).

*Qual movimento cotidiano você gostaria de fazer com mais facilidade hoje?*`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        showCta: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Deseja reiniciar a conversa com o assistente?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeakingId(null);
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('guia_menopausa_chat_history');
    }
  };

  // Helper to render basic markdown formatting cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Checkbox list items: - [ ]
      if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]')) {
        const isDone = line.trim().startsWith('- [x]');
        const text = line.replace(/- \[[ x]\]\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-1 text-xs sm:text-sm">
            <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              isDone ? 'bg-rose-700 border-rose-700 text-white' : 'border-stone-400 bg-white'
            }`}>
              {isDone && <CheckCircle className="w-3 h-3 text-white" />}
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </div>
        );
      }

      // Normal bullet list: -
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const text = line.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-1">
            <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </li>
        );
      }

      // Numbered list: 1.
      if (/^\d+\.\s+/.test(line.trim())) {
        return (
          <div key={idx} className="ml-2 font-medium text-xs sm:text-sm leading-relaxed my-1">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }

      // Italic reflection question line at the end: *Qual...*
      if (line.trim().startsWith('*') && line.trim().endsWith('*') && line.trim().length > 10) {
        return (
          <div key={idx} className="my-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-950 font-medium text-xs sm:text-sm italic">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-stone-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-stone-700">$1</em>');
  };

  const quickPrompts = [
    { label: 'Passo 1: Força como prioridade', query: 'Gostaria de explorar o Passo 1: Como fazer da força uma prioridade na menopausa?' },
    { label: 'Passo 2: Saúde dos Ossos', query: 'Como o treino protege meus ossos e combate a perda de densidade na menopausa?' },
    { label: 'Passo 3: Cardio na Rotina', query: 'Qual o tempo e tipo de cardio recomendado para a saúde na menopausa?' },
    { label: 'Passo 4: Equilíbrio & Quedas', query: 'Por que treinar equilíbrio e mobilidade é tão importante nessa fase?' },
    { label: 'Passo 5: Sono & Fadiga', query: 'Como adaptar o treino em dias em que durmo mal ou sinto muita fadiga?' },
    { label: 'Fazer Checklist da Semana', query: 'Quero fazer o Checklist da Semana!' },
    { label: 'Avaliação com Bruno Freire', query: 'Como funciona a Avaliação Personalizada com o Personal Trainer Bruno Freire?' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-4 bg-[#0A1A2B] text-white border-b border-cyan-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#E76F51] text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0A1A2B] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
                Assistente Guia 7 Passos
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-cyan-200/80">
              Personal Bruno Freire • Evidências científicas e acolhimento
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 text-cyan-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          title="Reiniciar conversa"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div ref={chatMessagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-stone-800 text-white'
                    : 'bg-rose-700 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 sm:p-5 text-stone-800 space-y-2 text-sm shadow-2xs ${
                  isUser
                    ? 'bg-[#E76F51] text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200/90 rounded-tl-xs'
                }`}
              >
                <div className={`prose-sm ${isUser ? 'text-white' : 'text-stone-800'}`}>
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    renderFormattedContent(msg.content)
                  )}
                </div>

                {/* Bottom actions on assistant message */}
                {!isUser && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 text-[11px] text-stone-400">
                    <span className="font-mono">{msg.timestamp}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(msg)}
                        className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-700 transition-colors"
                        title={speakingId === msg.id ? 'Parar áudio' : 'Ouvir resposta'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                            <span className="text-rose-600 font-semibold">Parar áudio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Ouvir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct CTA card inside assistant message if Bruno is recommended */}
                {!isUser && msg.showCta && (
                  <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-emerald-900 leading-snug">
                      <strong className="block font-semibold">Avaliação com Bruno Freire</strong>
                      Zona Sul do Rio de Janeiro ou Consultoria Online
                    </div>
                    <a
                      href={`https://wa.me/${BRUNO_INFO.phoneClean}?text=${encodeURIComponent(
                        'Olá Bruno! O assistente do Guia 7 Passos me recomendou a Avaliação Personalizada. Gostaria de agendar!'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Falar no WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-rose-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">
                Consultando as diretrizes do Guia 7 Passos...
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-stone-50/90 border-t border-stone-200/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap pl-1">
            Sugestões:
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              disabled={isLoading}
              onClick={() => handleSendMessage(p.query)}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 border border-stone-200 text-stone-700 transition-all shrink-0 font-medium disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida sobre os passos, exercícios ou menopausa..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-100 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:bg-white transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-2xl bg-[#E76F51] hover:bg-[#d85e42] disabled:opacity-40 disabled:hover:bg-[#E76F51] text-white font-semibold transition-all shadow-xs"
            aria-label="Enviar mensagem"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
          <span>Educação e movimento com base científica.</span>
          <span>•</span>
          <button
            type="button"
            onClick={onNavigateToChecklist}
            className="text-rose-700 hover:underline font-semibold"
          >
            Abrir Checklist da Semana
          </button>
        </div>
      </div>
    </div>
  );
}
