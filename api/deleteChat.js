import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { chatId } = req.query;
  if (req.method !== 'DELETE') return res.status(405).end();

  const { error } = await supabase
    .from('chat_memory')
    .delete()
    .eq('chat_id', chatId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Chat eliminado" });
}
