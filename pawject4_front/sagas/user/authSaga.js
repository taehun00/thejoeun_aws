import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import Cookies from "js-cookie";
import api from "../../api/axios";
import Router from "next/router";
import {
  signupRequest, signupSuccess, signupFailure,
  loginRequest, loginSuccess, loginFailure,
  refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure,
  logoutRequest, logout, logoutFailure,
  updateMeRequest,
  updateMeSuccess,
  updateMeFailure,
  updateProfileImageRequest, updateProfileImageSuccess, updateProfileImageFailure,
} from "../../reducers/user/authReducer";

/* =========================
   회원가입 API
========================= */
function signupApi(formData) {
  return api.post("/api/users/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function* signup(action) {
  try {
    yield call(signupApi, action.payload);
    yield put(signupSuccess());
    message.success("회원가입 성공!");
    //Router.push("user/login");   // http://localhost:3000/user/user/login
    //Router.push("/user/login");  // http://localhost:3000/user/user/login
    //Router.push("/login");       //http://localhost:3000/user/user/login
    Router.push("login");          // http://localhost:3000/login
  } catch (err) {
    yield put(signupFailure(err.response?.data?.error || err.message));
    message.error("회원가입 실패");
  }
}

/* =========================
   로그인 API
========================= */
function loginApi(payload) {
  return api.post("/api/users/login", payload);
}

export function* login(action) {
  try {
    const { data } = yield call(loginApi, action.payload);
    const { accessToken, refreshToken, ...user } = data;

    if (user && accessToken) {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        console.log("[LOGIN] accessToken saved:", accessToken);
  console.log(
    "[LOGIN] localStorage check:",
    localStorage.getItem("accessToken")
  );
        Cookies.set("refreshToken", refreshToken);
      }
      yield put(loginSuccess({ user, accessToken }));
      message.success(`${user.nickname}님 환영합니다!`);
      Router.push("/mainpage");
      setTimeout(() => {
  console.log(
    "[AFTER LOGIN] accessToken:",
    localStorage.getItem("accessToken")
  );
}, 500);
    } else {
      yield put(loginFailure("로그인 실패"));
      message.error("아이디/비밀번호를 확인하세요.");
    }
  } catch (err) {
    yield put(loginFailure(err.response?.data?.error || err.message));
    message.error("로그인 실패");
  }
}

/* =========================
   토큰 재발급 API
========================= */
function refreshApi() {
  return api.post("/api/users/refresh"); // refreshToken은 HttpOnly 쿠키에서 자동 포함
}

export function* refresh(action) {
  try {
    const { data } = yield call(refreshApi);
    const newAccessToken = data?.accessToken;

    if (typeof window !== "undefined" && newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }

    yield put(refreshTokenSuccess({ accessToken: newAccessToken }));
  } catch (err) {
    yield put(refreshTokenFailure(err.response?.data?.error || err.message));
    yield put(logout());
  }
}


/* =========================
   로그아웃 API
========================= */
function logoutApi(email) {
  return api.delete(`/api/users?email=${email}`);
}

export function* logoutFlow(action) {
  try {
    yield call(logoutApi, action.payload.email);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
    }
    yield put(logout());
    message.success("로그아웃 완료");
    Router.push("/user/login");
  } catch (err) {
    yield put(logoutFailure(err.response?.data?.error || err.message));
  }
}

function updateMeApi(payload) {
  return api.put("/api/users/me", payload);
}

function* updateMe(action) {
  try {
    const { data } = yield call(updateMeApi, action.payload);
    yield put(updateMeSuccess({ user: data }));
    message.success("내 정보 수정 완료");
  } catch (err) {
    yield put(updateMeFailure(err.response?.data?.error || err.message));
    message.error("내 정보 수정 실패");
  }
}

function updateProfileImageApi(file) {
  const formData = new FormData();
  formData.append("ufile", file);

  return api.post("/api/users/me/profile-image", formData);
}

function* updateProfileImage(action) {
  try {
    const { file } = action.payload; // 🔥 핵심
    const { data } = yield call(updateProfileImageApi, file);
    yield put(updateProfileImageSuccess({ user: data }));
    message.success("프로필 이미지 변경 완료");
  } catch (err) {
    yield put(
      updateProfileImageFailure(err.response?.data?.error || err.message)
    );
    message.error("프로필 이미지 변경 실패");
  }
}


/* =========================
   Root Saga
========================= */
export default function* authSaga() {
  yield takeLatest(signupRequest.type, signup);
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(refreshTokenRequest.type, refresh);
  yield takeLatest(logoutRequest.type, logoutFlow);
  yield takeLatest(updateMeRequest.type, updateMe);
  yield takeLatest(updateProfileImageRequest.type, updateProfileImage);
}
