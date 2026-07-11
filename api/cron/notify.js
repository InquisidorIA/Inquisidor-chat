import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const pool = [
    "¿Has avanzado en tus metas hoy o te estás distrayendo?",
    "La inacción es la forma más cara de perder el tiempo. ¿Qué tienes para mí?",
    "Te noto silencioso. ¿Estás siendo productivo o evitando el trabajo?",
    "El éxito no se construye con buenas intenciones. ¿Qué has logrado hoy?"
  ];
  
  const msg = pool[Math.floor(Math.random() * pool.length)];

  await supabase.from('notifications').insert({ 
    user_id: 'user_123', 
    message: msg, 
    read: false 
  });
  
  return res.status(200).json({ status: "Notificación enviada" });
}
