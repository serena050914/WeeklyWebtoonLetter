//editDataType.ts
import { createSupabaseClient } from './supabaseClient';
import { GetLetterData } from './getLetterData';
import { GetPostsData } from './getPostsData';
import { EditedData } from './types';

async function GetEditedData(): Promise<EditedData> {
  // supabase 클라이언트 생성
  const supabase = createSupabaseClient();

  // GetLetterData에서 뉴스레터 객체 1개를 가져옵니다.
  const newsletterRow = await GetLetterData(supabase);

  // GetPostsData를 사용하여 해당 뉴스레터에 대한 포스트 데이터 가져오기
  const postsData = await GetPostsData(supabase);

  // EditedData 객체 초기화
  const editedData: EditedData = {
    issue_img_src: '',
    issue_title: '',
    issue_summary: '',
    issue_link: '',
    img_src1: '',
    title1: '',
    summary1: '',
    link1: '',
    img_src2: '',
    title2: '',
    summary2: '',
    link2: '',
    img_src3: '',
    title3: '',
    summary3: '',
    link3: '',
    img_src4: '',
    title4: '',
    summary4: '',
    link4: '',
    img_src5: '',
    title5: '',
    summary5: '',
    link5: '',
    img_src6: '',
    title6: '',
    summary6: '',
    link6: '',
    subscribe_link: 'https://example.com/subscribe', // 더미값
    email: '',
  };

  // GetPostsData에서 0번 인덱스부터 순차적으로 포스트 데이터를 채움
  for (let i = 0; i < postsData.length; i++) {
    const post = postsData[i];

    // 이슈인 포스트를 찾았다면 issue_타이틀, issue_슈머리를 채움
    if (post.id === newsletterRow.issue) {
      editedData.issue_img_src = post.img_src || '';
      editedData.issue_title = post.title || '';
      editedData.issue_summary = post.summary || '';
      editedData.issue_link = post.link || '';
    } else {
      // 하드코딩 방식으로 각 포스트의 인덱스에 맞게 값 채우기
      if (i === 0) {
        editedData.img_src1 = post.img_src || '';
        editedData.title1 = post.title || '';
        editedData.summary1 = post.summary || '';
        editedData.link1 = post.link || '';
      } else if (i === 1) {
        editedData.img_src2 = post.img_src || '';
        editedData.title2 = post.title || '';
        editedData.summary2 = post.summary || '';
        editedData.link2 = post.link || '';
      } else if (i === 2) {
        editedData.img_src3 = post.img_src || '';
        editedData.title3 = post.title || '';
        editedData.summary3 = post.summary || '';
        editedData.link3 = post.link || '';
      } else if (i === 3) {
        editedData.img_src4 = post.img_src || '';
        editedData.title4 = post.title || '';
        editedData.summary4 = post.summary || '';
        editedData.link4 = post.link || '';
      } else if (i === 4) {
        editedData.img_src5 = post.img_src || '';
        editedData.title5 = post.title || '';
        editedData.summary5 = post.summary || '';
        editedData.link5 = post.link || '';
      } else if (i === 5) {
        editedData.img_src6 = post.img_src || '';
        editedData.title6 = post.title || '';
        editedData.summary6 = post.summary || '';
        editedData.link6 = post.link || '';
      }
    }
  }

  return editedData;
}

export { GetEditedData };
