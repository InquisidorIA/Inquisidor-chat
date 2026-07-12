import { getClarenceResponse } from './clarence';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { messages, userId, chatId, title } = req.body; 
  
  if (!messages || messages.length === 0 || !chatId) {
    return res.status(400).json({ content: "Faltan datos de la conversación." });
  }

  // Obtenemos el último mensaje enviado por el usuario
  const userMessage = messages[messages.length - 1].content;

  try {
    // 1. Guardar mensaje del usuario
    const { error: userError } = await supabase
      .from('chat_memory')
      .insert({ 
        user_id: userId, 
        message: userMessage, 
        role: 'user',
        chat_id: chatId,
        title: title || 'Nueva Charla'
      });

    if (userError) throw new Error("Error al guardar mensaje de usuario: " + userError.message);

    // 2. Traer el historial completo de este chat para que la IA tenga memoria
    const { data: history, error: historyError } = await supabase
      .from('chat_memory')
      .select('role, message')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (historyError) throw new Error("Error al recuperar historial: " + historyError.message);

    // 3. Obtener la respuesta de Clarence usando el historial completo
    const result = await getClarenceResponse(history, userId);
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error("Respuesta inválida desde el modelo de IA.");
    }

    const aiMessage = result.choices[0].message.content;

    // 4. Guardar la respuesta de la IA
    const { error: aiError } = await supabase
      .from('chat_memory')
      .insert({ 
        user_id: userId, 
        message: aiMessage, 
        role: 'assistant',
        chat_id: chatId,
        title: title || 'Nueva Charla'
      });

    if (aiError) throw new Error("Error al guardar respuesta de la IA: " + aiError.message);

    return res.status(200).json({ content: aiMessage });

  } catch (error) {
    console.error("ERROR CRÍTICO EN CHAT.JS:", error.message);
    return res.status(500).json({ 
      content: "Clarence está ocupado ignorando problemas triviales. (Error: " + error.message + ")" 
    });
  }
}
