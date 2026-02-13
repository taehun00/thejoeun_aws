import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";
import api from "../../../api/axios";
import {
  signup, login, refresh, logoutFlow, updateNickname, updateProfileImage
} from "../authSaga";
import {
  signupRequest, signupSuccess,
  loginRequest, loginSuccess,
  refreshTokenRequest, refreshTokenSuccess,
  logoutRequest, logout,
  updateNicknameRequest, updateNicknameSuccess,
  updateProfileImageRequest, updateProfileImageSuccess,
} from "../../../reducers/user/authReducer";

//axios 모듈 mock 처리
jest.mock("../../../api/axios", () => ({
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

// --- 회원가입 Saga 테스트 ---
describe("signup saga", () => {
  it("dispatches signupSuccess when API succeeds", () => {
    api.post.mockResolvedValue({ data: { email: "test@test.com" } });

    return expectSaga(signup, signupRequest({ user: { email: "test@test.com" } }))
      .put(signupSuccess())
      .run();
  });
});

// // --- 로그인 Saga 테스트 ---
// describe("login saga", () => {
//   it("dispatches loginSuccess when API succeeds", () => {
//     api.post.mockResolvedValue({
//       data: { accessToken: "abc123", refreshToken: "def456", nickname: "tester" }
//     });

//     return expectSaga(login, loginRequest({ email: "test@test.com", password: "1234" }))
//       .put(loginSuccess({ user: { nickname: "tester" }, accessToken: "abc123" }))
//       .run();
//   });
// });

// // --- 토큰 재발급 Saga 테스트 ---
// describe("refresh saga", () => {
//   it("dispatches refreshTokenSuccess when API succeeds", () => {
//     api.post.mockResolvedValue({ data: { accessToken: "newToken" } });

//     return expectSaga(refresh, refreshTokenRequest())
//       .put(refreshTokenSuccess({ accessToken: "newToken" }))
//       .run();
//   });
// });

// // --- 로그아웃 Saga 테스트 ---
// describe("logout saga", () => {
//   it("dispatches logout when API succeeds", () => {
//     api.delete.mockResolvedValue({ data: {} });

//     return expectSaga(logoutFlow, logoutRequest({ email: "test@test.com" }))
//       .put(logout())
//       .run();
//   });
// });

// // --- 닉네임 변경 Saga 테스트 ---
// describe("updateNickname saga", () => {
//   it("dispatches updateNicknameSuccess when API succeeds", () => {
//     api.patch.mockResolvedValue({ data: { nickname: "newName" } });

//     return expectSaga(updateNickname, updateNicknameRequest({ userId: 1, nickname: "newName" }))
//       .put(updateNicknameSuccess({ user: { nickname: "newName" } }))
//       .run();
//   });
// });

// // --- 프로필 이미지 변경 Saga 테스트 ---
// describe("updateProfileImage saga", () => {
//   it("dispatches updateProfileImageSuccess when API succeeds", () => {
//     api.post.mockResolvedValue({ data: { ufile: "new.png" } });

//     return expectSaga(updateProfileImage, updateProfileImageRequest({ userId: 1, file: new File([], "test.png") }))
//       .put(updateProfileImageSuccess({ user: { ufile: "new.png" } }))
//       .run();
//   });
//});