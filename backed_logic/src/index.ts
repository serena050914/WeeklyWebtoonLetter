import { config } from 'dotenv'; // dotenv 패키지에서 가져옴
import { logger } from './utils/logger'; //유틸의 로거파일에서 가져옴

// Load environment variables
config(); // dotenv에서 가져온 함수
//프로젝트루트의 .env 파일을 읽어서 process.env에 값을 넣어줌
//이게 먼저 실행돼야 아래에서 process.env.NODE_ENV 같은 걸 읽을 때 값이 있음

async function main() {
  //비동기 함수 정의
  logger.info('🚀 Node.js TypeScript Boilerplate'); //logger 객체의 info 메서드 호출
  logger.info('================================');
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Node version: ${process.version}`);

  // Your main application logic here
  logger.info('✅ Application started successfully!');
}

// Run the main function
main() //실제로 함수를 호출
  .then(() => {
    //main이 반환한 promise가 resolve 되면 실행하는 콜백 함수(즉시실행함수)
    logger.info('✅ Completed successfully');
    process.exit(0);
  })
  .catch((error /*에러 객체를 받음*/) => {
    logger.error('❌ Error occurred', { error }); //{error: error}를 단축 표기로 쓴 상태, 키와 변수 이름이 같으면 {error}로 줄일 수 있음.
    process.exit(1);
  });
