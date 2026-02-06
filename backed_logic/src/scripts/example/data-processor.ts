/**
 * Data Processing Script Example
 * Usage: npm run script:data-process -- [options]
 *
 * Examples:
 *   npm run script:data-process
 *   npm run script:data-process -- --multiplier 3
 *   npm run script:data-process -- -m 5 -c 10
 *   npm run script:data-process -- --format json
 */

import { Command } from 'commander'; //ES 모듈 import문, 코드 구조화 목적
//npm 패키지에 있는 라이브러리임
//nodejs에서 CLI (커맨드 라인 인터페이스) 프로그램 만드는 걸 도와주는 라이브러리임

interface DataItem {
  //type 이랑 비슷한 건데, 객체 형태에 특화된 키워드임
  id: number;
  name: string;
  value: number;
}

interface ProcessOptions {
  multiplier: number;
  count: number;
  format: 'json' | 'table';
}

// Commander로 CLI 옵션 파싱
const program = new Command();
//commander 라이브러리에서 제공해주는 실행엔진 객체임.

program
  .name('data-processor') //program._name = 'data-processor'
  .description('데이터 처리 스크립트') //program._name = '데이터 처리 스크립트'
  .version('1.0.0') //program._version = '1.0.0'
  .option('-m, --multiplier <number>', '곱할 값', '2') //설명서일뿐, 아직 값을 할당하거나 한 게 아님.(이런 옵션이 있을 수 있다고 등록한것)
  .option('-c, --count <number>', '처리할 아이템 개수', '3')
  .option('-f, --format <type>', '출력 포맷 (json|table)', 'table')
  .parse(); //여기서 실행. 안 준 옵션은 등록된 기본값 사용
//parse가 끝난 직후 상태 : program 내부에 이 옵션값들이 저장된 객체가 생김

const opts = program.opts(); //opts()는 위에서 저장한 객체를 꺼내는 메서드임, 값 임시 저장용 객체로 쓰기 위함.
const options: ProcessOptions = {
  //opts 객체를 사용해, 값들을 정제해서 저장 (타입도 강제해줌)
  multiplier: parseFloat(opts.multiplier), //문자열 값이 숫자로 바뀌어 꺼내짐->저장
  count: parseInt(opts.count, 10),
  format: opts.format as 'json' | 'table', //ts 문법, 타입 둘 중에 하나 맞으니까 걱정 ㄴㄴ
};

/**
 * Generate sample data
 */
function generateData(count: number): DataItem[] {
  //숫자 매개변수 받아와서 숫자 만큼의 길이인 객체 배열을 만드는 함수 정의 (더미데이터)
  const items: DataItem[] = [];
  const names = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
  ];

  for (let i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: `Item ${names[i] || String.fromCharCode(65 + i)}`, //앞이 falsy면 뒤를 쓴다
      value: (i + 1) * 100,
    });
  }

  return items;
}

async function processData(options: ProcessOptions): Promise<void> {
  //비동기 함수, 매개변수로 옵션스를 받아옴, promise 값을 반환함.
  console.log('📊 Starting data processing...'); // 로딩중 콘솔부터 찍기
  console.log(
    `Options: multiplier=${options.multiplier}, count=${options.count}, format=${options.format}\n`
  ); //옵션스의 프로퍼티 값들을 찍어주기

  // Generate data based on count argument
  const data = generateData(options.count); //옵션스의 카운트 값만큼 더미데이터 생성해서 data 변수에 할당

  console.log(`Processing ${data.length} items...`); //길이가 ~인 아이템 생성중 이라고 콘솔 찍기

  // Process data with the specified multiplier
  const processed = data.map((item) => ({
    //processed 라는 변수를 선언, data 변수를 매핑한 걸 할당할 예정
    ...item, //스프레드 문법
    processedValue: item.value * options.multiplier,
    processedAt: new Date().toISOString(), //데이트 찍고 문자열로 변환, 얘네만 추가로 넣어줌
  }));

  // Display results based on format
  if (options.format === 'json') {
    //만약 옵션스의 포맷이 제이슨이면,
    console.log('\n📈 Processed Results (JSON):');
    console.log(JSON.stringify(processed, null, 2)); //이 콘솔들 찍고~
  } else {
    console.log('\n📈 Processed Results:');
    processed.forEach((item) => {
      //각 아이템 마다 아래 내용을 수행해주기~
      console.log(
        `  - ${item.name}: ${item.value} × ${options.multiplier} = ${item.processedValue}`
      );
    });
  }

  // Calculate summary
  const total = processed.reduce((sum, item) => sum + item.processedValue, 0);
  const average = total / processed.length; //값들 총합이랑 평균을 변수에 할당

  console.log(`\n📊 Summary:`);
  console.log(`  💰 Total: ${total}`);
  console.log(`  📊 Average: ${average.toFixed(2)}`);
  console.log(`  📦 Items processed: ${processed.length}`); //템플릿 리터럴~, 콘솔에 찍어주기

  // Simulate async operation (e.g., API call or file writing)
  await new Promise((resolve) => setTimeout(resolve, 500)); //Promise 생성자함수의 인자(executer 화살표 함수)의 매개변수로 resolve자리만 채워져있고, 뒤의 reject 자리는 비움.

  console.log('\n✅ Data processing completed!'); //완료됐다고 콘솔 찍기
}

// Execute the script
processData(options) //Node.js가 제공하는 내장 객체, CLI 프로그램에서 성공/실패 상태를 운영체제나 스크립트에 전달 시 사용함.
  .then(() => {
    process.exit(0); //프로그램을 정상종료함
  })
  .catch((error) => {
    console.error('❌ Error during data processing:', error);
    process.exit(1); //오류종료함
  });
