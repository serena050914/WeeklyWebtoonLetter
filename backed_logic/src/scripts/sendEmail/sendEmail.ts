import dotenv from 'dotenv';
import emailjs from '@emailjs/nodejs';
import { EditedData } from './types';

// .env 예시 (Vite 기준)
// VITE_EMAILJS_SERVICE_ID=...
// VITE_EMAILJS_TEMPLATE_ID=...
// VITE_EMAILJS_PUBLIC_KEY=...

// .env 파일의 환경 변수를 로드
dotenv.config();

// 1. 환경 변수 타입 선언
const SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY as string;
const PRIVATE_KEY = process.env.VITE_EMAILJS_PRIVATE_KEY as string; // 백엔드에서만 사용하는 키, Vite 환경 변수로는 노출하지 않음

// 2. 환경 변수 체크
if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
  throw new Error(
    'EmailJS env missing: VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY/ VITE_EMAILJS_PRIVATE_KEY'
  );
}

// 3. EmailJS 초기화
emailjs.init({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
});

// 4. 템플릿 파라미터의 타입 지정
/**
 * EmailJS 템플릿에 변수 객체를 그대로 주입해서 메일 전송
 * @param {Record<string, any>} templateParams - 템플릿의 {{...}} 변수명과 동일한 key들
 * @returns {Promise<any>}
 */
export function sendEmailWithEmailJS(templateParams: EditedData): Promise<any> {
  return emailjs
    .send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then((response) => {
      // 이메일 전송 성공 시
      console.log(`이메일 전송 성공: ${templateParams.email}`);
      console.log('Response:', response);
      return response; // 필요 시 응답 객체 반환
    })
    .catch((error) => {
      // 이메일 전송 실패 시
      console.error(`이메일 전송 실패: ${templateParams.email}`);
      console.error('Error:', error);
      throw error; // 에러를 다시 던져서 호출한 곳에서 처리하도록 할 수도 있음
    });
}
