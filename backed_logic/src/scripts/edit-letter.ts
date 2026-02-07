/**
 * edit-letter.ts
 * Usage:
 *   npm run script:edit-letter
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
  created_at: string;
  is_sent: boolean | null;
};

function mustEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

function getWeekRangeLocal(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

async function getThisWeekNewsletter(supabase: SupabaseClient): Promise<NewsletterRow | null> {
  const { start, end } = getWeekRangeLocal();

  const { data, error } = await supabase
    .from('newsletter')
    .select('id,issue,comment,created_at,is_sent')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw new Error(`Failed to query newsletter: ${error.message}`);
  if (!data || data.length === 0) return null;

  return data[0] as NewsletterRow;
}

async function updateIssue(supabase: SupabaseClient, newsletterId: number, issueId: number | null) {
  const { error } = await supabase
    .from('newsletter')
    .update({ issue: issueId })
    .eq('id', newsletterId);

  if (error) throw new Error(`Failed to update issue: ${error.message}`);
}

async function updateComment(
  supabase: SupabaseClient,
  newsletterId: number,
  comment: string | null
) {
  const { error } = await supabase.from('newsletter').update({ comment }).eq('id', newsletterId);

  if (error) throw new Error(`Failed to update comment: ${error.message}`);
}

function parsePositiveIntOrNull(s: string): number | null {
  const n = Number(s);
  if (Number.isInteger(n) && n > 0) return n;
  return null;
}

async function main() {
  const SUPABASE_URL = mustEnv('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = mustEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const newsletter = await getThisWeekNewsletter(supabase);

  if (!newsletter) {
    console.log('아직 이번주에 생성된 뉴스레터가 없습니다');
    return;
  }

  if (newsletter.is_sent === true) {
    console.log('이번주의 뉴스레터는 이미 발송되었습니다.');
    return;
  }

  const newsletterId = newsletter.id;

  const rl = createInterface({ input, output });

  try {
    while (true) {
      // 항상 최신 상태로 읽어오면 좋음(다른 스크립트가 바꿀 수도)
      const current = await getThisWeekNewsletter(supabase);
      if (!current) {
        console.log('아직 이번주에 생성된 뉴스레터가 없습니다');
        return;
      }
      if (current.is_sent === true) {
        console.log('이번주의 뉴스레터는 이미 발송되었습니다.');
        return;
      }

      const menu = await rl.question(
        'issue 아이템을 선택하려면 i를 종합코멘트를 작성하려면 c를 입력하라고 종료하시려면 x를 입력하라고도\n> '
      );

      const choice = menu.trim().toLowerCase();

      if (choice === 'x') {
        console.log('실행을 종료합니다');
        return;
      }

      if (choice !== 'i' && choice !== 'c') {
        console.error('에러:', new Error('invalid input'));
        console.log('잘못된 입력입니다');
        return;
      }

      if (choice === 'i') {
        // issue 처리
        if (current.issue == null) {
          const ans = await rl.question('issue 아이템으로 선택할 아이템아이디를 입력해주세요\n> ');
          const v = ans.trim().toLowerCase();

          if (v === 'x') {
            // 메뉴로 복귀
            continue;
          }

          const id = parsePositiveIntOrNull(v);
          if (id == null) {
            console.error('에러:', new Error('invalid input'));
            console.log('잘못된 입력입니다');
            return;
          }

          await updateIssue(supabase, newsletterId, id);
          // 저장 후 메뉴로
          continue;
        } else {
          const ans = await rl.question(
            `현재 선택된 아이템의 아이디는 ${current.issue} 입니다. 바꾸시려면 새로 선택할 아이템 아이디를 입력해주세요. 유지하시려면 x를 입력해주세요\n> `
          );
          const v = ans.trim().toLowerCase();

          if (v === 'x') {
            // 유지 -> 메뉴로
            continue;
          }

          const id = parsePositiveIntOrNull(v);
          if (id == null) {
            console.error('에러:', new Error('invalid input'));
            console.log('잘못된 입력입니다');
            return;
          }

          await updateIssue(supabase, newsletterId, id);
          continue;
        }
      }

      if (choice === 'c') {
        // comment 처리
        if (current.comment == null) {
          const ans = await rl.question('작성할 코멘트를 입력해주세요\n> ');
          const v = ans.trim();

          if (v.toLowerCase() === 'x') {
            // 메뉴로 복귀
            continue;
          }

          if (!v) {
            console.error('에러:', new Error('invalid input'));
            console.log('잘못된 입력입니다');
            return;
          }

          await updateComment(supabase, newsletterId, v);
          continue;
        } else {
          const ans = await rl.question(
            `현재 작성된 코멘트는 ${current.comment}입니다. 새로 작성하시려면 작성할 코멘트를 입력해주세요. 유지하시려면 x를 입력해주세요.\n> `
          );
          const v = ans.trim();

          if (v.toLowerCase() === 'x') {
            // 유지 -> 메뉴로
            continue;
          }

          if (!v) {
            console.error('에러:', new Error('invalid input'));
            console.log('잘못된 입력입니다');
            return;
          }

          await updateComment(supabase, newsletterId, v);
          continue;
        }
      }
    }
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
