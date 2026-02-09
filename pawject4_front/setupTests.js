// <rootDir>/setupTests.js

// 1. React Testing Library용 DOM matcher 확장
// 예: expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// 2. React Testing Library cleanup 자동 실행
// 테스트가 끝날 때마다 DOM을 정리해줍니다.
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
});

// 3. axios mock (선택)
// 네트워크 요청을 테스트에서 막고 싶을 때 사용합니다.
// import axios from 'axios';
// jest.mock('axios');

// 4. console.error / console.warn 무시 (선택)
// 테스트 중 불필요한 에러 로그를 숨기고 싶을 때
// beforeAll(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
// afterAll(() => {
//   console.error.mockRestore();
//   console.warn.mockRestore();
// });

// 5. fetch mock (선택)
// 브라우저 환경에서 fetch를 사용하는 경우
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// );
