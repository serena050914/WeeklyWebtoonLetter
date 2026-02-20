// editLetter.ts (수정된 부분)
import 'dotenv/config'; // dotenv를 추가하여 환경 변수를 로드
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createSupabaseClient } from './supabaseClient';
import { getThisWeekNewsletter } from './getThisWeekNewsletter';
import { updateIssue } from './updateIssue';
import { updateComment } from './updateComment';
import { MENU_OPTIONS } from './constants';

async function editLetter() {
  const supabase = createSupabaseClient();
  const rl = createInterface({ input, output });

  try {
    const newsletter = await getThisWeekNewsletter(supabase);

    if (!newsletter) {
      console.log('이번 주 뉴스레터가 없습니다.');
      return;
    }

    if (newsletter.is_sent === true) {
      console.log('이번 주 뉴스레터는 이미 발송되었습니다.');
      return;
    }

    const newsletterId = newsletter.id;

    while (true) {
      const menuChoice = await rl.question(
        'issue 아이템을 선택하려면 i를, 종합코멘트를 작성하려면 c를, 종료하려면 x를 입력하세요.\n> '
      );

      const choice = menuChoice.trim().toLowerCase();

      if (choice === MENU_OPTIONS.EXIT) {
        console.log('실행을 종료합니다');
        break;
      }

      if (choice === MENU_OPTIONS.ISSUE) {
        const newIssueId = await rl.question('새 아이템 아이디를 입력하세요.\n> ');
        const issueId = parseInt(newIssueId, 10);
        await updateIssue(supabase, newsletterId, issueId);
      } else if (choice === MENU_OPTIONS.COMMENT) {
        const newComment = await rl.question('새 코멘트를 입력하세요.\n> ');
        await updateComment(supabase, newsletterId, newComment);
      } else {
        console.log('잘못된 입력입니다.');
      }
    }
  } finally {
    await rl.close(); // readline 인터페이스 종료 후 반드시 await
    process.exit(0); // 정상 종료 후 프로세스 종료
  }
}

// 실행 부분: 이 파일을 실행하려면 직접 호출
editLetter().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
