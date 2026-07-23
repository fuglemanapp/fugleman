import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Webhook que o Evolution API vai chamar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // O Evolution API envia eventos, queremos apenas mensagens novas
    if (body.event !== 'messages.upsert') {
      return NextResponse.json({ status: 'ignored' });
    }

    const messageData = body.data.messages[0];
    if (!messageData.message || messageData.key.fromMe) {
      return NextResponse.json({ status: 'ignored' });
    }

    const phone = messageData.key.remoteJid.split('@')[0];
    const text = messageData.message.conversation || messageData.message.extendedTextMessage?.text || "";

    if (!text) {
      return NextResponse.json({ status: 'no_text' });
    }

    console.log(`Mensagem de ${phone}: ${text}`);

    // 1. Achar o usuário no banco
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, name: body.data.pushName || 'Usuário WhatsApp' } });
    }

    // 2. Chamar a IA (Groq - Llama 3) para entender a intenção
    const aiResponse = await processWithGroq(text);

    // 3. Salvar no banco baseado na intenção (Simulação)
    if (aiResponse.intent === 'EXPENSE') {
      await prisma.transaction.create({
        data: {
          amount: aiResponse.amount || 0,
          description: text,
          category: aiResponse.category || 'Outros',
          type: 'EXPENSE',
          userId: user.id
        }
      });
    }

    // 4. Aqui você chamaria o Evolution API de volta para responder o usuário
    // sendWhatsAppMessage(phone, aiResponse.reply);

    return NextResponse.json({ success: true, aiResponse });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Função para chamar a API da Groq (Gratuita)
async function processWithGroq(text: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY não configurada. Simulando resposta.");
    return { intent: 'EXPENSE', amount: 45, category: 'Transporte', reply: "Missão cumprida! Gasto registrado." };
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { 
          role: 'system', 
          content: 'Você é o Fugleman, um assessor pessoal de WhatsApp. Analise a mensagem e retorne um JSON com: "intent" (EXPENSE, EVENT, QUESTION), "amount" (se for gasto, em número), "category", e "reply" (sua resposta carismática).' 
        },
        { role: 'user', content: text }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return { intent: 'UNKNOWN', reply: 'Não entendi direito, pode repetir?' };
  }
}
