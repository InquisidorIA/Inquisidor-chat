import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Falta userId" });

  // Usamos RPC o una consulta optimizada. 
  // Nota: Para obtener solo chats únicos, filtramos por user_id y ordenamos.
  const { data, error } = await supabase
    .from('chat_memory')
    .select('chat_id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Eliminar duplicados en memoria usando Map
  const uniqueChats = Array.from(new Map(data.map(item => [item.chat_id, item])).values());
  
  res.status(200).json(uniqueChats);
}
