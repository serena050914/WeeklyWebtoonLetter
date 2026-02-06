/**
 * RSS Sync Script (Supabase)
 * Usage:
 *   npm run script:rss-parsing
 *   npm run script:rss-sync -- --dry-run
 *   npm run script:rss-sync -- --source-id 1
 *
 */

import 'dotenv/config'; //dotenv/config가 로드되면서 .env를 읽고 process.env에 환경벼수를 넣어줌
import { Command } from 'commander';
import RSSParser from 'rss-parser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
//

type RssSourceRow = {
  id: number;
  title: string | null;
  link: string; // RSS URL
  is_active: boolean | null;
};

type RssItemInsert = {
  title: string;
  link: string; // guid
  published_at: string | null; // timestamptz (ISO string)
  source_id: number;
  truncated: string | null; // description text
  img: string | null; // image src extracted from description/html
};

//도구성 함수들 정의 (유틸 함수들)
function mustEnv(key: string): string {
  const v = process.env[key]; //객체 프로퍼티를 대괄호 접근으로 읽는 문법
  if (!v) throw new Error(`Missing env: ${key}`); //예외 던지고 즉시 종료 후 상위 catch로 감
  return v;
}

function toISOorNull(dateLike: unknown /*타입 모르겠다, any보다 안전*/): string | null {
  if (!dateLike) return null; //조기 반환 패턴
  const d = new Date(String(dateLike)); //일단 문자열화 한뒤 데이트로 바꿈
  if (Number.isNaN(d.getTime())) return null; //NaN인지 검사
  return d.toISOString(); // 걍 Date보다 Supabase timestamptz에 잘 들어감
}

function stripHtml(html: string): string {
  //html 태그를 제거하는 함수
  // very simple stripping; enough for "truncated" text
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim(); //앞뒤 공백 제거
}

function extractImgSrcFromHtml(html: string): string | null {
  //이미지 주소 뽑는 함수
  if (!html) return null;

  // Try <img ... src="...">
  const m1 = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (m1?.[1]) return m1[1];

  // Try data-src
  const m2 = html.match(/<img[^>]+data-src=["']([^"']+)["'][^>]*>/i);
  if (m2?.[1]) return m2[1];

  return null;
}

async function fetchActiveSources(supabase: SupabaseClient, sourceId? /*없을 수도 있음*/ : number) {
  //수파베이스 데이터 가져오기
  let q = supabase
    .from('rss_source') //나중에 재할당하려고 let
    .select('id,title,link,is_active') //supabase 쿼리는 메서드 체이닝으로 조건을 붙임
    .eq('is_active', true);

  if (sourceId != null) q = q.eq('id', sourceId);

  const { data, error } = await q; //구조분해 할당, await이 끝날 때까지 기다리고 결과 받음
  if (error) throw new Error(`Failed to fetch rss_source: ${error.message}`);

  return (data ?? []) as RssSourceRow[]; //타입단언
}

/**
 * title 기반 중복 체크 (source_id + title)
 * - 있으면 true, 없으면 false
 */
async function existsByTitle( //타이틀이 중복인지 체크하는 함수
  supabase: SupabaseClient, //
  sourceId: number,
  title: string
): Promise<boolean> {
  const { data, error } = await supabase //구조분해할당
    .from('rss_item')
    .select('id')
    .eq('source_id', sourceId)
    .eq('title', title)
    .limit(1);

  if (error) throw new Error(`Failed to query rss_item: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

/**
 * 한 소스의 RSS를 파싱하고 "새 아이템"만 수집
 * - 최신부터 내려오다가 "이미 저장된 title"을 만나면 즉시 중단
 */
async function collectNewItemsForSource( //새아이템만 수집하는 함수
  supabase: SupabaseClient,
  parser: RSSParser,
  source: RssSourceRow,
  maxItems?: number
): Promise<RssItemInsert[]> {
  const feed = await parser.parseURL(source.link);

  // rss-parser item typing은 느슨함 → 안전하게 문자열 처리
  const items = (feed.items ?? []).slice(0, maxItems ?? feed.items.length);

  const newItems: RssItemInsert[] = [];

  for (const it of items) {
    const rawTitle = String((it as any).title ?? '').trim();
    if (!rawTitle) continue;

    // 2) "매번 다 가져오기 전에 title만 가져온 채로 검색"
    const already = await existsByTitle(supabase, source.id, rawTitle); //반환값을 넣어줌
    if (already) {
      // "이미 저장된 아이템이 나오면 2번 중단하고 3번으로"
      break;
    }

    // guid(없으면 link)
    const guid = String((it as any).guid ?? (it as any).id ?? (it as any).link ?? '').trim();

    // description/content
    const rawDesc = String(
      (it as any).content ??
        (it as any)['content:encoded'] ??
        (it as any).summary ??
        (it as any).contentSnippet ??
        (it as any).description ??
        ''
    ).trim();

    const img = extractImgSrcFromHtml(rawDesc);

    // pubDate -> timestamptz
    const publishedAtISO = toISOorNull(
      (it as any).pubDate ?? (it as any).isoDate ?? (it as any).published
    );

    // description을 텍스트로 저장 (너 테이블 컬럼명이 truncated라서 여기에 넣음)
    const descText = rawDesc ? stripHtml(rawDesc) : null;

    newItems.push({
      title: rawTitle,
      link: guid || String((it as any).link ?? '').trim(), // 너가 말한대로 "사실은 guid"
      published_at: publishedAtISO,
      source_id: source.id,
      truncated: descText,
      img,
    });
  }

  return newItems;
}

async function insertItems(supabase: SupabaseClient, items: RssItemInsert[], dryRun: boolean) {
  //아이템을 수파베이스에 insert 하는 함수
  if (items.length === 0) return { inserted: 0 };

  if (dryRun) {
    console.log(`[dry-run] Would insert ${items.length} items`);
    return { inserted: 0 };
  }

  // id는 넣지 않음 -> DB에서 자동 생성(Identity/Serial 설정이 되어 있어야 함)
  const { error } = await supabase.from('rss_item').insert(items);

  if (error) throw new Error(`Failed to insert rss_item: ${error.message}`);
  return { inserted: items.length };
}

/////////////////////////////////////////////////여기까지가 유틸함수들이었음/////////
async function main() {
  const program = new Command();

  program
    .name('rss-parsing')
    .description('Fetch RSS sources and store new RSS items into Supabase')
    .option('--dry-run', 'Parse but do not insert into DB', false)
    .option('--source-id <number>', 'Only run for a single rss_source.id', (v) => parseInt(v, 10))
    .option(
      '--max-items <number>',
      'Limit number of items read from each feed (for testing)',
      (v) => parseInt(v, 10)
    )
    .parse();

  const opts = program.opts<{
    dryRun: boolean;
    sourceId?: number;
    maxItems?: number;
  }>();

  const SUPABASE_URL = mustEnv('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = mustEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const parser = new RSSParser({
    timeout: 20_000,
    headers: {
      'User-Agent': 'rss-sync/1.0 (+github-actions)',
    },
  });

  console.log('🔎 Fetching active rss_source...');
  const sources = await fetchActiveSources(supabase, opts.sourceId);

  if (sources.length === 0) {
    console.log('No active sources found.');
    return;
  }

  console.log(`Found ${sources.length} active source(s)\n`);

  let totalInserted = 0;

  for (const source of sources) {
    console.log(`🧩 Source #${source.id}: ${source.title ?? '(no title)'}  ->  ${source.link}`);

    try {
      const newItems = await collectNewItemsForSource(supabase, parser, source, opts.maxItems);

      console.log(`  New items collected: ${newItems.length}`);

      // 새 아이템이 "최신→과거" 순서로 모였을 가능성이 높음.
      // DB에서 시간 오름차순이 필요하면 reverse 해서 넣어도 됨.
      // (원하는 정렬이 있으면 여기서 바꾸면 됨)
      // newItems.reverse();

      const res = await insertItems(supabase, newItems, Boolean(opts.dryRun));
      totalInserted += res.inserted;

      console.log(`  ✅ Inserted: ${res.inserted}\n`);
    } catch (err) {
      console.error(`  ❌ Failed for source #${source.id}:`, err);
      console.log(''); // spacing
    }
  }

  console.log(`🏁 Done. Total inserted: ${totalInserted}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
