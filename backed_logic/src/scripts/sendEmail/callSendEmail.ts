import { createSupabaseClient } from './supabaseClient';
import { GetEmail } from './getEmail';
import { GetEditedData } from './editDataType';
import { sendEmailWithEmailJS } from './sendEmail';

export async function CallSendEmail() {
  console.log('CallSendEmail called');

  try {
    console.log('Starting CallSendEmail function...');
    // supabase 클라이언트 생성
    const supabase = createSupabaseClient();

    // 이메일과 데이터 로드
    const emailData = await GetEmail(supabase); // supabase 인자 전달
    const editedData = await GetEditedData();

    console.log('Loaded email data:', emailData);
    console.log('Loaded edited data:', editedData);

    emailData.forEach((element) => {
      editedData.email = element.email;
      console.log('Sending email to:', editedData.email);
      sendEmailWithEmailJS(editedData);
    });
  } catch (error) {
    console.error('Error in CallSendEmail:', error);
  }
}

CallSendEmail().catch((e) => {
  console.error('Fatal error in CallSendEmail:', e);
  process.exit(1);
});
