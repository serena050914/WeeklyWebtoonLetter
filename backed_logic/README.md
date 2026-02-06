# Node.js TypeScript Boilerplate

GitHub Actions로 스크립트를 실행하는 Node.js + TypeScript 보일러플레이트입니다.

## 🚀 Features

- **TypeScript** - 타입 안정성을 위한 TypeScript 설정
- **ESLint & Prettier** - 코드 품질 및 포맷팅
- **GitHub Actions** - 자동화된 스크립트 실행
- **샘플 스크립트** - 바로 사용 가능한 예제 스크립트
- **환경 변수** - dotenv를 통한 환경 설정
- **Winston 로거** - 프로덕션급 로깅 시스템
- **Commander** - 간편한 CLI 인자 파싱

## 📦 Installation

```bash
npm install
```

## 🛠️ Available Scripts

### Development

```bash
# TypeScript 빌드
npm run build

# 메인 애플리케이션 실행
npm start

# 개발 모드 (ts-node 사용)
npm run dev

# 빌드 결과물 삭제
npm run clean
```

### Scripts

```bash
# Hello 스크립트 실행
npm run script:hello
npm run script:hello -- --name "홍길동"
npm run script:hello -- -n "John" -t 3
npm run script:hello -- --help

# 데이터 처리 스크립트 실행
npm run script:data-process
npm run script:data-process -- --multiplier 3
npm run script:data-process -- -m 5 -c 10
npm run script:data-process -- --format json
npm run script:data-process -- --help

# Winston 로거 예제
npm run script:logger-example
```

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
```

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── ci.yml          # CI/CD pipeline
│       ├── run-script.yml  # 스크립트 실행
│       └── scheduled-task.yml  # 스케줄 작업
├── src/
│   ├── index.ts           # 메인 애플리케이션
│   ├── scripts/           # 실행 가능한 스크립트들
│   │   ├── hello.ts       # 간단한 예제 스크립트
│   │   ├── data-processor.ts  # 데이터 처리 스크립트
│   │   └── logger-example.ts  # Winston 로거 예제
│   └── utils/             # 유틸리티 함수들
│       └── logger.ts      # Winston 로거 설정
├── logs/                  # 로그 파일 (생성됨)
│   ├── combined.log       # 모든 로그
│   └── error.log          # 에러 로그만
├── dist/                  # 빌드 결과물 (생성됨)
├── .env.example           # 환경 변수 예제
├── .eslintrc.json         # ESLint 설정
├── .prettierrc.json       # Prettier 설정
├── tsconfig.json          # TypeScript 설정
└── package.json           # 프로젝트 설정
```

## 🤖 GitHub Actions Workflows

### 1. CI Pipeline (`ci.yml`)
- Push/PR 시 자동 실행
- Linting, Formatting, Build 검사
- Node.js 18.x, 20.x 버전 테스트

### 2. Run Scripts (`run-script.yml`)
- 수동 실행 가능 (workflow_dispatch)
- 매일 자동 실행 (cron schedule)
- 실행할 스크립트 선택 가능

### 3. Scheduled Tasks (`scheduled-task.yml`)
- 매시간 자동 실행
- 수동 실행 가능

## 🔧 Configuration

### Environment Variables

`.env.example`을 복사하여 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

필요한 환경 변수를 `.env`에 설정하세요.

### TypeScript Configuration

`tsconfig.json`에서 TypeScript 설정을 조정할 수 있습니다.

### GitHub Actions Secrets

민감한 정보는 GitHub Secrets에 저장하고 workflows에서 사용하세요:

1. GitHub Repository → Settings → Secrets and variables → Actions
2. New repository secret 추가
3. Workflow에서 `${{ secrets.YOUR_SECRET }}` 형태로 사용

## 📝 Creating New Scripts

새로운 스크립트를 추가하려면:

1. `src/scripts/` 디렉토리에 새 파일 생성
2. `package.json`의 `scripts` 섹션에 명령어 추가
3. 필요시 GitHub Actions workflow 업데이트

예제:

```typescript
// src/scripts/my-script.ts
async function myScript() {
  console.log('My custom script');
  // Your logic here
}

myScript()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

```json
// package.json
{
  "scripts": {
    "script:my-script": "ts-node src/scripts/my-script.ts"
  }
}
```

## 🚀 Deployment

이 보일러플레이트는 GitHub Actions를 통한 자동화된 스크립트 실행에 최적화되어 있습니다.

### Manual Execution

GitHub Actions 탭에서 "Run Scripts" workflow를 선택하고 "Run workflow"를 클릭하여 수동으로 실행할 수 있습니다.

### Scheduled Execution

`scheduled-task.yml`의 cron 설정을 수정하여 실행 주기를 변경할 수 있습니다:

```yaml
schedule:
  - cron: '0 * * * *'  # 매시간
  # - cron: '0 0 * * *'  # 매일 자정
  # - cron: '0 0 * * 0'  # 매주 일요일
```

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!
