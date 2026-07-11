import { getClarenceResponse } from './clarence';
import { createClient } from '@supabase/supabase-js';

// Inicialización de Supabase con tus variables de entorno configuradas en Vercel
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  // Aseguramos que solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  console.log("Servidor: Procesando nueva interacción de chat...");

  const { messages, userId } = req.body;
  
  // Validamos que existan mensajes
  if (!messages || messages.length === 0) {
    return res.status(400).json({ content: "No hay historial de mensajes." });
  }

  const userMessage = messages[messages.length - 1].content;

  try {
    // 1. Guardar mensaje del usuario en Supabase
    const { error: userError } = await supabase
      .from('chat_memory')
      .insert({ user_id: userId, message: userMessage, role: 'user' });

    if (userError) throw new Error("Error guardando en Supabase (user): " + userError.message);

    // 2. Obtener la respuesta de Clarence (pasando el historial y userId)
    const result = await getClarenceResponse(messages, userId);
    
    // Verificamos si Groq respondió correctamente
    if (!result.choices || result.choices.length === 0) {
      throw new Error("Respuesta inválida desde el modelo de IA.");
    }

    const aiMessage = result.choices[0].message.content;

    // 3. Guardar la respuesta de la IA en Supabase
    const { error: aiError } = await supabase
      .from('chat_memory')
      .insert({ user_id: userId, message: aiMessage, role: 'assistant' });

    if (aiError) throw new Error("Error guardando en Supabase (ai): " + aiError.message);

    // 4. Devolver la respuesta al frontend
    return res.status(200).json({ content: aiMessage });

  } catch (error) {
    console.error("ERROR CRÍTICO EN CHAT.JS:", error.message);
    return res.status(500).json({ 
      content: "Clarence está ocupado ignorando problemas triviales. (Error técnico: " + error.message + ")" 
    });
  }
}
