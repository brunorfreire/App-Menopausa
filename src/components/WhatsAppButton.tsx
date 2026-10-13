import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRUNO_INFO } from '../data/stepsData';

interface WhatsAppButtonProps {
  customMessage?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  label?: string;
  className?: string;
}

export default function WhatsAppButton({
  customMessage,
  variant = 'primary',
  label = 'Falar com Bruno Freire',
  className = '',
}: WhatsAppButtonProps) {
  const messageText = customMessage
    ? encodeURIComponent(customMessage)
    : encodeURIComponent('Olá Bruno! Estou no App Guia 7 Passos e gostaria de saber mais sobre a Avaliação Personalizada.');

  const href = `https://wa.me/${BRUNO_INFO.phoneClean}?text=${messageText}`;

  if (variant === 'compact') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs hover:shadow ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current" />
        <span>{label}</span>
      </a>
    );
  }

  if (variant === 'secondary') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600/30 text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/90 font-medium text-sm transition-all ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
        <span>{label}</span>
        <span className="text-xs text-emerald-700 font-mono">({BRUNO_INFO.phoneDisplay})</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${className}`}
    >
      <MessageCircle className="w-5 h-5 fill-current shrink-0" />
      <div className="text-left">
        <div className="text-sm font-semibold leading-tight">{label}</div>
        <div className="text-[11px] text-emerald-100 opacity-90 leading-tight">WhatsApp {BRUNO_INFO.phoneDisplay}</div>
      </div>
    </a>
  );
}
