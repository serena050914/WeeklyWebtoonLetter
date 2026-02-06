/**
 * select-items.ts
 * Usage:
 *   npm run script:select-items
 *
 */

import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type NewsletterRow = {
  id: number;
  issue: number | null;
  comment: string | null;
  created_at: string; // timestamptz
  is_sent: boolean | null;
};

function mustEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

/**
 * 로컬 시간 기준 "이번 주 월요일 00:00:00" ~ "다음 주 월요일 00:00:00" 범위
 */
function getWeekRangeLocal(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);

  // JS: 일=0, 월=1, ... 토=6
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7; // 월요일이면 0, 화=1 ... 일=6
  const start = new Date(d);
  start.setDate(d.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

async function getOrCreateThisWeekNewsletter(supabase: SupabaseClient): Promise<NewsletterRow> {
  const { start, end } = getWeekRangeLocal();

  // 이번 주에 생성된 newsletter 1개 찾기 (가장 먼저 생성된 것 기준)
  const { data, error } = await supabase
    .from('newsletter')
    .select('id,issue,comment,created_at,is_sent')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw new Error(`Failed to query newsletter: ${error.message}`);

  if (data && data.length > 0) {
    return data[0] as NewsletterRow;
  }

  // 없으면 새로 생성 (issue/comment null, is_sent false)
  const { data: inserted, error: insErr } = await supabase
    .from('newsletter')
    .insert([{ issue: null, comment: null, is_sent: false }])
    .select('id,issue,comment,created_at,is_sent')
    .limit(1);

  if (insErr) throw new Error(`Failed to insert newsletter: ${insErr.message}`);
  if (!inserted || inserted.length === 0)
    throw new Error('Failed to insert newsletter: no row returned');

  return inserted[0] as NewsletterRow;
}

async function countSelectedPosts(supabase: SupabaseClient, newsletterId: number): Promise<number> {
  const { count, error } = await supabase
    .from('newsletter_post')
    .select('*', { count: 'exact', head: true })
    .eq('newsletter_id', newsletterId);

  if (error) throw new Error(`Failed to count newsletter_post: ${error.message}`);
  return count ?? 0;
}

async function getSelectedPostIds(
  supabase: SupabaseClient,
  newsletterId: number
): Promise<number[]> {
  const { data, error } = await supabase
    .from('newsletter_post')
    .select('rss_item_id')
    .eq('newsletter_id', newsletterId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to read selected posts: ${error.message}`);

  const ids = (data ?? []).map((r: any) => Number(r.rss_item_id)).filter((n) => Number.isFinite(n));

  return ids;
}

async function insertNewsletterPost(
  supabase: SupabaseClient,
  newsletterId: number,
  rssItemId: number
): Promise<{ ok: boolean; skipped?: boolean; reason?: string }> {
  // 중복이면 에러 날 수 있음(유니크 제약이 있다면). 그 경우는 스킵 처리.
  const { error } = await supabase.from('newsletter_post').insert([
    {
      newsletter_id: newsletterId,
      rss_item_id: rssItemId,
    },
  ]);

  if (!error) return { ok: true };

  // 중복/제약 위반 등은 "스킵"으로 처리해도 됨
  // (정확한 코드/메시지는 환경마다 다를 수 있으니 메시지 포함)
  if (String(error.message).toLowerCase().includes('duplicate')) {
    return { ok: false, skipped: true, reason: error.message };
  }
  return { ok: false, skipped: false, reason: error.message };
}

async function main() {
  const SUPABASE_URL = mustEnv('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = mustEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const newsletter = await getOrCreateThisWeekNewsletter(supabase);
  const newsletterId = newsletter.id;

  let selectedCount = await countSelectedPosts(supabase, newsletterId);

  const rl = createInterface({ input, output });

  try {
    const answer = await rl.question(
      `선택할 아이템들의 id를 입력해주세요.(현재까지 선택된 아이템 ${selectedCount}/7 개)\n> `
    );

    const tokens = answer.trim().split(/\s+/).filter(Boolean);
    const ids = tokens.map((t) => Number(t)).filter((n) => Number.isInteger(n) && n > 0);

    if (ids.length === 0) {
      const finalIds = await getSelectedPostIds(supabase, newsletterId);
      console.log(
        `현재까지 선택된 아이템은 ${finalIds.length}/7 개입니다.\n선택된 아이템 아이디 : ${finalIds.join(
          ' '
        )}\n실행을 종료합니다.`
      );
      return;
    }

    // 4) 하나하나 처리 + 7개 차면 중단
    for (const rssItemId of ids) {
      if (selectedCount >= 7) break;

      console.log(`아이템 아이디 : ${rssItemId} 인 포스트 선택중`);

      const res = await insertNewsletterPost(supabase, newsletterId, rssItemId);
      if (res.ok) {
        selectedCount += 1;
      } else if (res.skipped) {
        // 중복은 카운트 증가 없음
        // 필요하면 로그를 더 자세히 찍어도 됨
      } else {
        // 진짜 오류는 중단시키는 편이 안전
        throw new Error(res.reason ?? 'Unknown insert error');
      }
    }

    // 6) 최종 출력
    const finalIds = await getSelectedPostIds(supabase, newsletterId);
    console.log(
      `현재까지 선택된 아이템은 ${finalIds.length}/7 개입니다.\n현재까지 선택된 아이템 아이디 : ${finalIds.join(
        ' '
      )}\n실행을 종료합니다.`
    );
  } finally {
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
