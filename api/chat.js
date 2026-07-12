import { getClarenceResponse } from './clarence';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, userId, chatId, title } = req.body;
  if (!messages || !chatId) return res.status(400).json({ content: "Faltan datos." });

  try {
    // 1. Guardar mensaje usuario
    await supabase.from('chat_memory').insert({ 
      user_id: userId, message: messages[messages.length - 1].content, role: 'user', chat_id: chatId, title: title 
    });

    // 2. Traer historial y formatearlo para la IA
    const { data: dbData } = await supabase
      .from('chat_memory')
      .select('role, message')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    const history = dbData.map(item => ({ role: item.role, content: item.message }));

    // 3. Respuesta IA
    // Pasamos el historial completo para que la IA tenga contexto, tal como definimos en clarence.js
    const result = await getClarenceResponse(history, userId);
    
    // Verificación de seguridad básica por si la API falla
    if (!result.choices || result.choices.length === 0) throw new Error("Respuesta vacía de la IA");
    
    const aiMessage = result.choices[0].message.content;

    // 4. Guardar respuesta IA
    await supabase.from('chat_memory').insert({ 
      user_id: userId, message: aiMessage, role: 'assistant', chat_id: chatId, title: title 
    });

    return res.status(200).json({ content: aiMessage });
  } catch (e) {
    return res.status(500).json({ content: "Clarence está ocupado: " + e.message });
  }
}
