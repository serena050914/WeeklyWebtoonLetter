/**
 * Simple Hello World Script
 * Usage: npm run script:hello -- [options]
 * 
 * Examples:
 *   npm run script:hello
 *   npm run script:hello -- --name "홍길동"
 *   npm run script:hello -- -n "John" -t 3
 */

import { Command } from 'commander';

// Commander로 CLI 옵션 파싱
// 옵션 파싱 : 사용자가 입력한 문자열을 분석하고 변수로 만드는 것
const program = new Command();

program
  .name('hello')
  .description('간단한 Hello World 스크립트')
  .version('1.0.0')
  .option('-n, --name <name>', '이름', 'World')
  .option('-t, --times <number>', '반복 횟수', '1')
  .parse();

const opts = program.opts();

async function helloScript() { //비동기함수 helloScript()
  const name = opts.name as string;
  const times = parseInt(opts.times as string, 10);

  console.log('👋 Hello from TypeScript script!');
  console.log(`Current time: ${new Date().toISOString()}\n`);
  
  for (let i = 0; i < times; i++) {
    console.log(`Hello, ${name}! (${i + 1}/${times})`); //time 값 만큼 반복 출력
  }
  
  return { //리턴값으로 객체 반환
    status: 'success', 
    name,
    times,
    timestamp: new Date().toISOString() 
  };
}

// Execute the script
helloScript()
  .then((result) => {
    console.log('\n✅ Script completed:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
