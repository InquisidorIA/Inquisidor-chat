import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { chatId, newTitle } = req.body;
  
  const { error } = await supabase
    .from('chat_memory')
    .update({ title: newTitle })
    .eq('chat_id', chatId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ success: true });
}
