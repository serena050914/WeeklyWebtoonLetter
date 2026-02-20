// getThisWeekNewsletter.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { getWeekRangeLocal } from './getWeekRangeLocal';
import { NewsletterRow } from './types';

export async function getThisWeekNewsletter(supabase: SupabaseClient): Promise<NewsletterRow | null> {
  const { start, end } = getWeekRangeLocal();

  const { data, error } = await supabase
    .from('newsletter')
    .select('id, issue, comment, created_at, is_sent')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw new Error(`Failed to query newsletter: ${error.message}`);
  if (!data || data.length === 0) return null;

  return data[0] as NewsletterRow;
}
