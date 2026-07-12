import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { userId } = req.query;
  const { data } = await supabase
    .from('chat_memory')
    .select('chat_id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const unique = Array.from(new Map(data.map(item => [item.chat_id, item])).values());
  res.status(200).json(unique);
}
