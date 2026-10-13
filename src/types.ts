export interface StepItem {
  id: number;
  title: string;
  tagline: string;
  icon: string;
  summary: string;
  whyItMatters: string;
  howToApply: string[];
  scientificEvidence: string;
  brunoQuote: string;
  reflectiveQuestion: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  target: string;
  tip: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  showCta?: boolean;
}

export interface AnamneseData {
  nome: string;
  idade: string;
  historicoEsportivo: string;
  historicoCirurgias: string;
  dores: string;
  laudosExames: string;
  sintomasHormonais: string;
  objetivoPrincipal: string;
}

