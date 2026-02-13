import reducer, {
  signupRequest, signupSuccess, signupFailure,
  loginRequest, loginSuccess, loginFailure,
  refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure,
  logoutRequest, logout, logoutFailure,
  updateNicknameRequest, updateNicknameSuccess, updateNicknameFailure,
  updateProfileImageRequest, updateProfileImageSuccess, updateProfileImageFailure,
} from "../authReducer";

describe("auth reducer", () => {
  const initialState = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    success: false,
  };

  it("handles signupRequest", () => {
    const state = reducer(initialState, signupRequest());
    expect(state.loading).toBe(true);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it("handles signupSuccess", () => {
    const state = reducer(initialState, signupSuccess());
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
  });

  it("handles loginSuccess", () => {
    const payload = { user: { nickname: "tester" }, accessToken: "abc123" };
    const state = reducer(initialState, loginSuccess(payload));
    expect(state.user.nickname).toBe("tester");
    expect(state.accessToken).toBe("abc123");
  });

  it("handles refreshTokenSuccess", () => {
    const state = reducer(initialState, refreshTokenSuccess({ accessToken: "newToken" }));
    expect(state.accessToken).toBe("newToken");
  });

  it("handles logout", () => {
    const prevState = { ...initialState, user: { nickname: "tester" }, accessToken: "abc123" };
    const state = reducer(prevState, logout());
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it("handles updateProfileImageSuccess", () => {
    const state = reducer(initialState, updateProfileImageSuccess({ user: { ufile: "path.png" } }));
    expect(state.user.ufile).toBe("path.png");
  });
});