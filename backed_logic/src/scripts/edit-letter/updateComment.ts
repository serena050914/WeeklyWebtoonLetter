// updateComment.ts
import { SupabaseClient } from '@supabase/supabase-js';

export async function updateComment(
  supabase: SupabaseClient,
  newsletterId: number,
  comment: string | null
) {
  const { error } = await supabase.from('newsletter').update({ comment }).eq('id', newsletterId);

  if (error) throw new Error(`Failed to update comment: ${error.message}`);
}
