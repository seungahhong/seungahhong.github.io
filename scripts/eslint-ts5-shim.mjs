/**
 * ESLint가 TypeScript 5를 쓰도록 모듈 해석을 우회하는 shim.
 *
 * TypeScript 7은 Go 네이티브 포트라 기존 JS 컴파일러 API를 export하지 않는다.
 * typescript-eslint는 모듈 로드 시점에 `ts.ModuleKind.Cjs`를 참조하므로
 * TS7이 해석되면 규칙 설정과 무관하게 즉시 크래시한다.
 * (typescript-eslint의 TS7 지원은 TS 7.1의 stable API 출시까지 보류 상태)
 *
 * pnpm overrides는 peer dependency의 해석을 바꾸지 못해 사용할 수 없었다.
 * 그래서 ESLint 프로세스 안에서만 `typescript` 요청을 `typescript-5` 별칭으로 돌린다.
 * 타입 검사(`pnpm typecheck`)와 `next build`는 그대로 TS7을 사용한다.
 *
 * typescript-eslint가 TS7을 지원하면 이 파일과 typescript-5 별칭을 함께 제거한다.
 */
import Module from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ts5 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', 'typescript-5');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, ...rest) {
  if (request === 'typescript' || request.startsWith('typescript/')) {
    return originalResolveFilename.call(this, ts5 + request.slice('typescript'.length), ...rest);
  }
  return originalResolveFilename.call(this, request, ...rest);
};
