import { getClarenceResponse } from './clarence';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 1. AÑADE 'chatId' aquí para recibirlo desde el frontend
  const { messages, userId, chatId } = req.body; 
  
  if (!messages || messages.length === 0 || !chatId) {
    return res.status(400).json({ content: "Faltan datos de la conversación." });
  }

  const userMessage = messages[messages.length - 1].content;

  try {
    // 2. AÑADE 'chat_id: chatId' en la inserción del mensaje del usuario
    const { error: userError } = await supabase
      .from('chat_memory')
      .insert({ 
        user_id: userId, 
        message: userMessage, 
        role: 'user',
        chat_id: chatId // <--- ESTO ES LO QUE FALTA
      });

    if (userError) throw new Error("Error guardando en Supabase (user): " + userError.message);

    const result = await getClarenceResponse(messages, userId);
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error("Respuesta inválida desde el modelo de IA.");
    }

    const aiMessage = result.choices[0].message.content;

    // 3. AÑADE 'chat_id: chatId' en la inserción de la respuesta de la IA
    const { error: aiError } = await supabase
      .from('chat_memory')
      .insert({ 
        user_id: userId, 
        message: aiMessage, 
        role: 'assistant',
        chat_id: chatId // <--- ESTO ES LO QUE FALTA
      });

    if (aiError) throw new Error("Error guardando en Supabase (ai): " + aiError.message);

    return res.status(200).json({ content: aiMessage });

  } catch (error) {
    console.error("ERROR CRÍTICO EN CHAT.JS:", error.message);
    return res.status(500).json({ 
      content: "Clarence está ocupado ignorando problemas triviales. (Error técnico: " + error.message + ")" 
    });
  }
}
