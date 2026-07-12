import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { chatId } = req.query;
  const { data, error } = await supabase
    .from('chat_memory')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  res.status(200).json(data);
}
