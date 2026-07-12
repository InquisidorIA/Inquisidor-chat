import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { chatId } = req.query;
  
  // Selección dinámica de tabla
  const table = chatId === 'public' ? 'public_chats' : 'chat_memory';

  const { data } = await supabase
    .from(table)
    .select('role, message')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
    
  res.status(200).json(data || []);
}
