import { SupabaseClient } from '@supabase/supabase-js';
import { EmailData } from './types';

// getLetterData 함수
export async function GetEmail(supabase: SupabaseClient): Promise<EmailData[]> {
  const { data, error } = await supabase
    .from('subscriber') // 테이블 이름: subscriber
    .select('email')
    .is('unsubscribe_at', null); // is_subscribed가 true인 데이터만 조회

  if (error) {
    throw new Error('Error fetching data from Supabase: ' + error.message);
  }

  console.log('GetEmail function loaded successfully.');
  console.log('Loaded email data:', data);

  return data as EmailData[];
}
