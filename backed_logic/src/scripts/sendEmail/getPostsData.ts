import { SupabaseClient } from '@supabase/supabase-js';
import { PostsData } from './types';
import { GetLetterData } from './getLetterData';

// getPostsData 함수
async function GetPostsData(supabase: SupabaseClient): Promise<PostsData> {
  try {
    const newsletterRow = await GetLetterData(supabase); // 현재 주차 뉴스레터 데이터 가져오기
    // `newsletterRow`에서 `id` 가져오기
    const newsletterId = newsletterRow.id;

    // `newsletter_post` 테이블에서 `newsletter_id`가 주어진 ID인 데이터 조회
    const { data, error } = await supabase
      .from('newsletter_post') // 테이블 이름: newsletter_post
      .select('rss_item_id') // 필요한 컬럼: rss_item_id
      .eq('newsletter_id', newsletterId); // `newsletter_id`가 주어진 `newsletterId`와 일치하는 데이터만 필터링

    if (error) {
      throw new Error('Error fetching newsletter post data: ' + error.message);
    }

    // `rss_item_id`들을 배열로 저장
    const rssItemIds = data.map((item) => item.rss_item_id);

    // `rss_item` 테이블에서 `rss_item_id`들을 이용해 데이터 조회
    const { data: rssData, error: rssError } = await supabase
      .from('rss_item') // 테이블 이름: rss_item
      .select('id, title, link, summary, published_at, img_src') // 필요한 컬럼: id, title, link, summary, published_at, img_src
      .in('id', rssItemIds); // `rss_item_id`가 `rssItemIds` 배열에 포함된 데이터만 조회

    if (rssError) {
      throw new Error('Error fetching rss item data: ' + rssError.message);
    }

    return rssData; // 최종 결과 반환 (id, title, link)
  } catch (err: unknown) {
    throw new Error('Failed to get posts data: ' + (err as Error).message);
  }
}

export { GetPostsData };
