/**
 * select-items.ts
 * Usage:
 *   npm run script:select-items
 *
 */

import 'dotenv/config'; //.env 파일에 적어둔 환경변수들을 process.env 안으로 자동 로딩해주는 라이브러리
import { createClient, SupabaseClient } from '@supabase/supabase-js'; //supabase와 통신하기 위한 라이브러리
//createClient() = 수파베이스와 통신하기 위한 클라이언트 객체를 만들어주는 함수
//SupabaseClient = 위 함수의 반환 값으로, 클라이언트 객체의 타입(클래스)임.

import { createInterface } from 'readline/promises'; //node.js의 기본 라이브러리로, 터미널에서 입력,출력 다룸, 이건 /promises 가 붙어서 async-await 용으로 만든 애임
//createInterface는 터미널 입력을 받을 수 있는 인터페이스 객체를 만들어주는 함수임
//얘는 js라서 타입을 안 받아오는 거임

import { stdin as input, stdout as output } from 'node:process'; //node:process는 Node.js 내장모듈에서 process 객체를 명시적으로 import하는 작성방식
//여기서 as는 ES모듈의 문법으로, 왼쪽으로 export 된 걸, 오른쪽으로 import 하겠다는 뜻임
//process.stdin, process.stdout 임.
// 각각 표준 입력과 표준 출력 객체프로퍼티임.
// process = {
//   stdin: ReadableStream 객체, <- 스트림 객체임.
//   stdout: WritableStream 객체,
//   ...
// }

type NewsletterRow = {
  //newsletter 타입을 만듦
  id: number;
  issue: number | null;
  comment: string | null;
  created_at: string; // timestamptz
  is_sent: boolean | null;
};

function mustEnv(key: string): string {
  //dotenv가 process.env에 추가해준 env 값이 잘 있는지 확인하는 함수. 중요한 env 값이라 없는 경우 바로 에러 던짐.
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`); //걍 mustENV를 전역 호출한 경우 바로 프로그램 중단되는 것이지
  return v;
}
//

function getWeekRangeLocal(
  now = new Date() /*받아온 값이 있으면 그게 now고, 없으면 새로 현재 데이트를 받아서 now로 사용함*/
) {
  const d = new Date(now); //매개변수의 의미를 지닌 변수를 그대로 사용하지 않기 위해, 복사본을 하나 만듦
  d.setHours(0, 0, 0, 0);   //데이트의 메서드로 시간을 0시 0분으로 맞춤

  // JS: 일=0, 월=1, ... 토=6
  const day = d.getDay();   //요일을 숫자값으로 반환하는 함수
  const diffToMonday = (day + 6) % 7; // 오늘의 요일에 6 더한 걸 7일로 나눈 나머지값.
  const start = new Date(d);    //d를 기준으로 새 데이트 생성
  start.setDate(d.getDate() - diffToMonday);    // d로부터 날짜를 가져온 후, 거기서 월요일로부터의 거리를 빼고, 그걸로 스타트의 데이트 정하기
  //date는 날짜가 0이하가 돼도 자동으로 지난달로 가서 계산해줌
  start.setHours(0, 0, 0, 0);

  const end = new Date(start); //스타트 기준으로 새 데이트 생성
  end.setDate(start.getDate() + 7); //스타트에서 날짜 가져온 후 7 더하기

  return { start, end };    //이번주의 시작일과 마지막일의 날짜를 담은 객체를 반환함
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
