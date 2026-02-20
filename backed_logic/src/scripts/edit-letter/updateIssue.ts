// updateIssue.ts
import { SupabaseClient } from '@supabase/supabase-js';

export async function updateIssue(
  supabase: SupabaseClient,
  newsletterId: number,
  issueId: number | null
) {
  const { error } = await supabase
    .from('newsletter')
    .update({ issue: issueId })
    .eq('id', newsletterId);

  if (error) throw new Error(`Failed to update issue: ${error.message}`);
}
