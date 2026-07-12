import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { userId } = req.query;
  
  // Seleccionamos los IDs de chat únicos para este usuario
  const { data, error } = await supabase
    .from('chat_memory')
    .select('chat_id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Filtramos para obtener una lista limpia de chats
  const uniqueChats = [];
  const seen = new Set();
  
  data.forEach(item => {
    if (!seen.has(item.chat_id)) {
      uniqueChats.push(item);
      seen.add(item.chat_id);
    }
  });

  res.status(200).json(uniqueChats);
}
