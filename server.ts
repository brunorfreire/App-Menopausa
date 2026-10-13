import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Você é o assistente virtual do "App Guia 7 Passos - Menopausa e Movimento", criado pelo Personal Trainer Bruno Freire. Seu objetivo é ajudar as usuárias a entenderem e aplicarem os 7 passos para preservar a força e a qualidade de vida na menopausa, agindo de forma acolhedora, motivacional e baseada em evidências científicas.

DIRETRIZES DE COMPORTAMENTO:
1. Tom de voz: Empático, encorajador, profissional e claro.
2. Foco: Auxiliar a usuária a colocar em prática o guia, tirar dúvidas sobre os passos e incentivar o contato com o Bruno Freire para uma avaliação personalizada.
3. Aviso Médico: Lembre sempre que este guia é educativo e não substitui avaliação médica ou prescrição individualizada. O exercício apoia a saúde, mas não cura sintomas hormonais.

BASE DE CONHECIMENTO (O GUIA):
- Contexto: A menopausa é uma transição. A força pode continuar crescendo. O exercício contribui para força, capacidade funcional, saúde cardiometabólica e bem-estar.
- Passo 1: Faça da força uma prioridade. Musculação pelo menos 2x por semana. Agachar, levantar, empurrar, puxar. Priorize execução controlada.
- Passo 2: Cuide da saúde dos seus ossos. A queda do estrogênio acelera perda de densidade óssea. Treinos resistidos ajudam. Converse com médico sobre cálcio e vitamina D.
- Passo 3: Inclua o cardio na rotina. 150 a 300 min/semana de atividade aeróbica moderada (caminhada, bike, dança).
- Passo 4: Treine equilíbrio e mobilidade. Essencial para autonomia e evitar quedas.
- Passo 5: Respeite seu sono e recuperação. Adapte a carga de treino em dias de fadiga intensa.
- Passo 6: Construa hábitos que sustentam resultados. Nutrição adequada, menos tempo sentada, acompanhamento médico.
- Passo 7: Personalize o treino para a sua fase. Não existe protocolo único. Histórico, sintomas e objetivos importam.

CHECKLIST DA SEMANA (Ofereça para a usuária acompanhar):
- [ ] Treino de força (2x).
- [ ] Atividade aeróbica.
- [ ] Equilíbrio/mobilidade.
- [ ] Menos tempo sentada.
- [ ] Sono e recuperação.
- [ ] Alimentação e hidratação.
- [ ] Descanso quando necessário.

AÇÃO FINAL (Call to Action):
Sempre que a usuária demonstrar interesse em iniciar, sentir dificuldades específicas ou pedir um treino, recomende a Avaliação Personalizada com o Bruno Freire.
Forneça o contato: WhatsApp (21) 98205-3338 (Zona Sul do Rio de Janeiro ou Consultoria Online).

FLUXO DE CONVERSA:
1. Apresente-se brevemente e pergunte qual dos 7 passos ela quer explorar primeiro ou se quer fazer o "Checklist da Semana".
2. Responda às dúvidas com base EXCLUSIVA no guia acima.
3. Termine as respostas com uma pergunta reflexiva (ex: "Qual movimento cotidiano você gostaria de fazer com mais facilidade?") ou sugerindo falar com o Bruno.
4. Se a pessoa optar pelo Checklist, apresente as tarefas diárias recomendadas pelo guia.`;

// Intelligent fallback in case API key is missing or quota/network error
function getLocalFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('checklist')) {
    return `Que ótimo que você quer acompanhar a sua semana! 🌟

Aqui está o **Checklist da Semana** do Guia Menopausa e Movimento do Bruno Freire:

- [ ] **Treino de força (2x)**: Agachar, levantar, empurrar, puxar com carga controlada.
- [ ] **Atividade aeróbica**: 150 a 300 min/semana em intensidade moderada (caminhada, bike, dança).
- [ ] **Equilíbrio e mobilidade**: Para firmeza nos passos e autonomia.
- [ ] **Menos tempo sentada**: Fazer pausas ativas durante o dia.
- [ ] **Sono e recuperação**: Respeitar seu ritmo e adaptar a intensidade em dias de cansaço.
- [ ] **Alimentação e hidratação**: Nutrição adequada para sustentar músculos e ossos.
- [ ] **Descanso quando necessário**: O repouso faz parte do resultado!

Você pode marcar as tarefas diretamente na aba **Checklist da Semana** aqui no app. 

*Qual desses itens é mais desafiador para você incluir na sua rotina atual? Ou prefere que o Bruno Freire estruture uma rotina sob medida para você pelo WhatsApp (21) 98205-3338?*`;
  }

  if (msg.includes('passo 1') || msg.includes('força') || msg.includes('musculação') || msg.includes('agachar')) {
    return `**Passo 1: Faça da força uma prioridade!** 💪

A menopausa traz alterações hormonais, mas a sua força pode e deve continuar crescendo. A recomendação do Bruno Freire é:
- **Frequência:** Musculação pelo menos **2 vezes por semana**.
- **Padrões de movimento essenciais:** Agachar, levantar (como tirar algo do chão), empurrar e puxar.
- **Técnica:** Priorize sempre a execução controlada e segura em vez de cargas exageradas.

*Lembrete importante:* O exercício apoia a saúde física e funcional, mas este guia não substitui acompanhamento médico individualizado.

Qual movimento do dia a dia você gostaria de fazer com mais facilidade e confiança? Se quiser um planejamento seguro para começar, recomendo falar com o Bruno Freire no WhatsApp (21) 98205-3338 para uma Avaliação Personalizada!`;
  }

  if (msg.includes('passo 2') || msg.includes('osso') || msg.includes('osteoporose') || msg.includes('cálcio') || msg.includes('densidade')) {
    return `**Passo 2: Cuide da saúde dos seus ossos!** 🦴

Com a queda do estrogênio nessa fase, a perda de densidade mineral óssea pode se acelerar. Mas temos ótimas notícias:
- **Estímulo mecânico:** Treinos resistidos (musculação) transmitem tensão mecânica aos ossos, estimulando sua preservação e fortalecimento.
- **Saúde integrada:** Converse com seu médico sobre os níveis adequados de cálcio e vitamina D no seu organismo.

*Aviso Médico:* O guia é educativo e não substitui exames como densitometria e acompanhamento médico especializado.

Você já realizou seus exames ósseos recentes? Caso queira exercícios direcionados e adaptados para o seu caso, agende uma Avaliação com o Bruno Freire pelo WhatsApp (21) 98205-3338!`;
  }

  if (msg.includes('passo 3') || msg.includes('cardio') || msg.includes('aeróbico') || msg.includes('caminhada') || msg.includes('coração')) {
    return `**Passo 3: Inclua o cardio na rotina!** 🏃‍♀️🚴‍♀️

A saúde cardiometabólica é fundamental na menopausa:
- **Meta recomendada:** 150 a 300 minutos por semana de atividade aeróbica moderada.
- **Opções prazerosas:** Caminhada com ritmo, bicicleta, esteira, dança ou natação.
- **Benefícios:** Melhora o condicionamento, apoia o controle da pressão, sensibilidade à insulina e o humor.

Como está o seu tempo semanal de cardio hoje? Que atividade aeróbica você mais sente prazer em praticar? Se quiser dosar o cardio e a força na medida certa, converse com o Bruno Freire no WhatsApp (21) 98205-3338!`;
  }

  if (msg.includes('passo 4') || msg.includes('equilíbrio') || msg.includes('mobilidade') || msg.includes('queda') || msg.includes('alongamento')) {
    return `**Passo 4: Treine equilíbrio e mobilidade!** 🧘‍♀️

A mobilidade articular e o equilíbrio garantem:
- **Autonomia para a vida toda:** Subir escadas, calçar sapatos, caminhar em terrenos irregulares com firmeza.
- **Prevenção de quedas e entorses:** Reflexos motores rápidos e segurança ao pisar.
- **Amplitude articular:** Menos rigidez nas articulações ao acordar.

Você sente alguma rigidez articular ou insegurança de equilíbrio no seu dia a dia? O Bruno Freire pode prescrever testes específicos de mobilidade em uma Avaliação Personalizada — WhatsApp (21) 98205-3338.`;
  }

  if (msg.includes('passo 5') || msg.includes('sono') || msg.includes('dormir') || msg.includes('fadiga') || msg.includes('cansaço') || msg.includes('recuperação')) {
    return `**Passo 5: Respeite seu sono e recuperação!** 🌙

Na menopausa, flutuações hormonais e ondas de calor podem interferir na qualidade do sono. Por isso:
- **Adaptação de carga:** Em dias de fadiga intensa, reduza o volume e a carga do treino em vez de forçar o corpo à exaustão.
- **Recuperação é ganho:** É durante o repouso que seus músculos se regeneram e seu sistema nervoso se equilibra.

*Aviso Médico:* Sintomas intensos de insônia devem ser avaliados com seu médico.

Como tem sido a qualidade das suas noites de sono ultimamente? Se precisar de uma periodização flexível que respeite seus dias de menor energia, fale com o Bruno Freire no WhatsApp (21) 98205-3338.`;
  }

  if (msg.includes('passo 6') || msg.includes('hábito') || msg.includes('nutrição') || msg.includes('alimentação') || msg.includes('sentada')) {
    return `**Passo 6: Construa hábitos que sustentam resultados!** 🥗💧

O treino é apenas uma hora do seu dia; as outras 23 horas importam muito:
- **Menos tempo sentada:** Levante-se a cada hora, caminhe e faça pequenos alongamentos.
- **Nutrição adequada:** Proteínas de boa qualidade em todas as refeições e hidratação constante.
- **Acompanhamento médico:** Check-ups regulares para verificar hormônios, perfil lipídico e glicemia.

Qual pequeno hábito saudável você conseguiu manter com mais facilidade nesta semana? Se quiser unir treino e rotina de forma sustentável, agende uma conversa com o Bruno Freire no WhatsApp (21) 98205-3338!`;
  }

  if (msg.includes('passo 7') || msg.includes('personaliz') || msg.includes('individual') || msg.includes('fase') || msg.includes('treino')) {
    return `**Passo 7: Personalize o treino para a sua fase!** 🎯

Cada mulher vive a menopausa de maneira única:
- Não existe protocolo padrão ou receita de bolo.
- Seu histórico prévio de movimento, sintomas atuais, densidade óssea e objetivos devem orientar o programa.
- Ajustes finos de volume e descanso fazem toda a diferença para você treinar sem dor.

Você já treina atualmente ou está se preparando para recomeçar? Para ter um treino 100% individualizado para a sua fase, recomendo falar direto com o Bruno Freire no WhatsApp (21) 98205-3338 (Zona Sul do RJ ou Consultoria Online)!`;
  }

  if (msg.includes('bruno') || msg.includes('contato') || msg.includes('avaliação') || msg.includes('personal') || msg.includes('whatsapp') || msg.includes('preço') || msg.includes('custo') || msg.includes('como funciona')) {
    return `O Personal Trainer **Bruno Freire** oferece:
- **Atendimento Presencial:** na Zona Sul do Rio de Janeiro.
- **Consultoria Online:** para alunas de todo o Brasil e exterior, com acompanhamento de perto e prescrição individualizada para a menopausa.

📲 **Contato direto no WhatsApp:** (21) 98205-3338
Você pode enviar uma mensagem dizendo que veio pelo Guia dos 7 Passos para agendar sua **Avaliação Personalizada**!

Gostaria que eu te mostrasse algum passo específico do guia antes de você entrar em contato com ele?`;
  }

  // Default welcome / response
  return `Olá! Sou o assistente virtual do **Guia 7 Passos - Menopausa e Movimento**, criado pelo Personal Trainer **Bruno Freire**. 

Estou aqui para te apoiar com acolhimento, motivação e base em evidências científicas nessa transição tão importante da vida!

Qual dos 7 passos você gostaria de explorar primeiro ou prefere conhecer o **Checklist da Semana**?

1. Força como prioridade (Musculação 2x/sem)
2. Cuidado com a saúde dos ossos
3. Cardio na rotina (150-300 min/semana)
4. Equilíbrio e mobilidade
5. Sono e recuperação
6. Hábitos que sustentam resultados
7. Personalização para a sua fase

*(Lembrando que o guia é educativo e não substitui a avaliação do seu médico).*

Qual movimento cotidiano você gostaria de fazer com mais facilidade e energia?`;
}

// API chat route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mensagens não fornecidas.' });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // If Gemini client is available, call gemini-3.8-flash
    if (ai) {
      try {
        // Format history for Gemini contents
        const contents = messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text || getLocalFallbackResponse(lastUserMessage);
        return res.json({ reply: replyText });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using guided fallback:', geminiError?.message);
        const fallbackText = getLocalFallbackResponse(lastUserMessage);
        return res.json({ reply: fallbackText });
      }
    } else {
      // Graceful local fallback adhering to exact guidelines
      const fallbackText = getLocalFallbackResponse(lastUserMessage);
      return res.json({ reply: fallbackText });
    }
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem.', details: err?.message });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
