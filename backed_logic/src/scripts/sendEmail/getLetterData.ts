import { SupabaseClient } from '@supabase/supabase-js';
import { getWeekRangeLocal } from './getWeekRangeLocal';
import { NewsletterRow } from './types';

const { start, end } = getWeekRangeLocal();

// getLetterData 함수
async function GetLetterData(supabase: SupabaseClient): Promise<NewsletterRow> {
  const { data, error } = await supabase
    .from('newsletter')
    .select('id, issue, comment, created_at, is_sent')
    .gte('created_at', start)
    .lte('created_at', end);

  if (error) {
    throw new Error('Error fetching data from Supabase: ' + error.message);
  }

  // is_sent가 true인 경우 에러 던짐
  if (data && data.length > 0 && data[0].is_sent === true) {
    throw new Error('Some newsletters have already been sent.');
  }

  return data[0];
}

export { GetLetterData };
