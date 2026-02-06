/**
 * Logger Example Script
 * Usage: npm run script:logger-example
 *
 * Winston 로거 사용 예제
 */

import { logger, createLogger } from '../../utils/logger';

async function loggerExample() {
  console.log('='.repeat(50));
  console.log('Winston Logger Example');
  console.log('='.repeat(50));
  console.log('');

  // 기본 로거 사용
  logger.info('애플리케이션 시작');
  logger.debug('디버그 정보입니다', { userId: 123, action: 'login' });
  logger.warn('경고 메시지입니다');

  // 메타데이터와 함께 로그
  logger.info('사용자 로그인', {
    userId: 12345,
    username: 'hong',
    ip: '192.168.1.1',
    timestamp: new Date().toISOString(),
  });

  // Child logger 사용 (특정 모듈용)
  const dbLogger = createLogger('Database');
  dbLogger.info('데이터베이스 연결 성공');
  dbLogger.debug('쿼리 실행', { query: 'SELECT * FROM users', rows: 100 });

  const apiLogger = createLogger('API');
  apiLogger.info('API 요청 수신', { endpoint: '/api/users', method: 'GET' });
  apiLogger.warn('요청 속도 제한 초과', { ip: '192.168.1.1', limit: 100 });

  // 에러 로깅
  try {
    throw new Error('의도적인 에러 예제');
  } catch (error) {
    logger.error('에러가 발생했습니다', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // 다양한 레벨
  logger.error('심각한 에러');
  logger.warn('주의가 필요합니다');
  logger.info('일반 정보');
  logger.debug('디버그 정보 (개발 환경에서만 표시)');

  console.log('');
  console.log('='.repeat(50));
  console.log('로그는 다음 위치에 저장됩니다:');
  console.log('  - logs/combined.log (모든 로그)');
  console.log('  - logs/error.log (에러만)');
  console.log('='.repeat(50));
}

// Execute the script
loggerExample()
  .then(() => {
    logger.info('로거 예제 완료');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('로거 예제 실패', { error }); //키와 변수명이 같을 때 작성가능한 방식
    process.exit(1);
  });
