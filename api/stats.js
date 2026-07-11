import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { userId } = req.query;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('chat_memory')
    .select('tag')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo)
    .not('tag', 'is', null);

  const stats = { Productivo: 0, Creativo: 0, Desviado: 0 };
  data.forEach(item => { if (stats.hasOwnProperty(item.tag)) stats[item.tag]++; });

  return res.status(200).json(stats);
}
