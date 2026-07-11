import { getClarenceResponse } from './clarence';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { messages, userId } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    // Guardar input del usuario
    await supabase.from('chat_memory').insert({ user_id: userId, message: userMessage, role: 'user' });

    // Obtener respuesta
    const result = await getClarenceResponse(messages, userId);
    const aiMessage = result.choices[0].message.content;

    // Guardar respuesta de Clarence
    await supabase.from('chat_memory').insert({ user_id: userId, message: aiMessage, role: 'assistant' });

    return res.status(200).json({ content: aiMessage });
  } catch (error) {
    return res.status(500).json({ content: "Clarence está ocupado ignorando problemas triviales." });
  }
}
