import { AlertCircle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <aside aria-label="Aviso Médico" className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-4 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
      <div className="p-1.5 bg-amber-200/80 text-amber-900 rounded-lg shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="leading-relaxed">
        <strong className="font-semibold text-amber-900">Aviso Médico & Educativo:</strong>{' '}
        Este guia e assistente têm caráter exclusivamente educativo e informativo. O exercício físico apoia a saúde física, metabólica e mental, mas não cura sintomas hormonais nem substitui acompanhamento médico, exames clínicos (como densitometria óssea) ou prescrição individualizada. Consulte sempre seu médico antes de iniciar novos treinos.
      </div>
    </aside>
  );
}
