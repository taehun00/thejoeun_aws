// sagas/petdisease/petdiseaseSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchPetdiseaseListRequest,
  fetchPetdiseaseListSuccess,
  fetchPetdiseaseListFailure,

  searchPetdiseaseRequest,
  searchPetdiseaseSuccess,
  searchPetdiseaseFailure,

  fetchPetdiseaseDetailRequest,
  fetchPetdiseaseDetailSuccess,
  fetchPetdiseaseDetailFailure,

  createPetdiseaseRequest,
  createPetdiseaseSuccess,
  createPetdiseaseFailure,

  updatePetdiseaseRequest,
  updatePetdiseaseSuccess,
  updatePetdiseaseFailure,

  deletePetdiseaseRequest,
  deletePetdiseaseSuccess,
  deletePetdiseaseFailure,
} from "../../reducers/petdisease/petdiseaseReducer";

// API

// /petdisease/list
function apiFetchPetdiseaseList({ pettypeid, page = 1, size = 10, condition = "new" }) {
  return axios.get("/api/petdisease/list", {
    params: { pettypeid, page, size, condition },
  });
}

// /petdisease/search
function apiSearchPetdisease({ pettypeid, keyword = "", page = 1, size = 10, condition = "new" }) {
  return axios.get("/api/petdisease/search", {
    params: { pettypeid, keyword, page, size, condition },
  });
}

// /petdisease/{disno}
function apiFetchPetdiseaseDetail(disno) {
  return axios.get(`/api/petdisease/${disno}`);
}

// POST /petdisease (ModelAttribute -> FormData)
function apiCreatePetdisease({ pettypeid, dto }) {
  const formData = new FormData();
  formData.append("disname", dto.disname ?? "");
  formData.append("definition", dto.definition ?? "");
  formData.append("cause", dto.cause ?? "");
  formData.append("symptom", dto.symptom ?? "");
  formData.append("treatment", dto.treatment ?? "");
  formData.append("tip", dto.tip ?? "");

  return axios.post("/api/petdisease", formData, {
    params: { pettypeid },
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// PUT /petdisease/{disno}
function apiUpdatePetdisease({ disno, pettypeid, dto }) {
  const formData = new FormData();
  formData.append("disname", dto.disname ?? "");
  formData.append("definition", dto.definition ?? "");
  formData.append("cause", dto.cause ?? "");
  formData.append("symptom", dto.symptom ?? "");
  formData.append("treatment", dto.treatment ?? "");
  formData.append("tip", dto.tip ?? "");

  return axios.put(`/api/petdisease/${disno}`, formData, {
    params: { pettypeid },
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// DELETE /petdisease/{disno}
function apiDeletePetdisease(disno) {
  return axios.delete(`/api/petdisease/${disno}`);
}

// SAGA
// 목록
function* fetchPetdiseaseList(action) {
  try {
    const { pettypeid, pageNo = 1, pageSize = 10, condition = "new" } = action.payload || {};

    if (!pettypeid) {
      throw new Error("pettypeid 누락");
    }

    const { data } = yield call(apiFetchPetdiseaseList, {
      pettypeid,
      page: pageNo,
      size: pageSize,
      condition,
    });

    yield put(fetchPetdiseaseListSuccess(data));
  } catch (err) {
    yield put(fetchPetdiseaseListFailure(err?.response?.data || err.message));
  }
}

// 검색
function* searchPetdisease(action) {
  try {
    const { pettypeid, keyword = "", pageNo = 1, pageSize = 10, condition = "new" } = action.payload || {};

    if (!pettypeid) {
      throw new Error("pettypeid 누락");
    }

    const { data } = yield call(apiSearchPetdisease, {
      pettypeid,
      keyword,
      page: pageNo,
      size: pageSize,
      condition,
    });

    yield put(searchPetdiseaseSuccess(data));
  } catch (err) {
    yield put(searchPetdiseaseFailure(err?.response?.data || err.message));
  }
}

// 상세
function* fetchPetdiseaseDetail(action) {
  try {
    const { disno } = action.payload || {};
    if (!disno) throw new Error("disno 누락");

    const { data } = yield call(apiFetchPetdiseaseDetail, disno);
    yield put(fetchPetdiseaseDetailSuccess(data));
  } catch (err) {
    yield put(fetchPetdiseaseDetailFailure(err?.response?.data || err.message));
  }
}

// 등록
function* createPetdisease(action) {
  try {
    const { pettypeid, dto } = action.payload || {};
    if (!pettypeid) throw new Error("pettypeid 누락");
    if (!dto) throw new Error("dto 누락");

    const { data } = yield call(apiCreatePetdisease, { pettypeid, dto });
    yield put(createPetdiseaseSuccess(data));
  } catch (err) {
    yield put(createPetdiseaseFailure(err?.response?.data || err.message));
  }
}

// 수정
function* updatePetdisease(action) {
  try {
    const { disno, pettypeid, dto } = action.payload || {};
    if (!disno) throw new Error("disno 누락");
    if (!pettypeid) throw new Error("pettypeid 누락");
    if (!dto) throw new Error("dto 누락");

    const { data } = yield call(apiUpdatePetdisease, { disno, pettypeid, dto });
    yield put(updatePetdiseaseSuccess(data));
  } catch (err) {
    yield put(updatePetdiseaseFailure(err?.response?.data || err.message));
  }
}

// 삭제
function* deletePetdisease(action) {
  try {
    const { disno } = action.payload || {};
    if (!disno) throw new Error("disno 누락");

    yield call(apiDeletePetdisease, disno);
    yield put(deletePetdiseaseSuccess({ disno }));
  } catch (err) {
    yield put(deletePetdiseaseFailure(err?.response?.data || err.message));
  }
}

// watcher
export default function* petdiseaseSaga() {
  yield takeLatest(fetchPetdiseaseListRequest.type, fetchPetdiseaseList);
  yield takeLatest(searchPetdiseaseRequest.type, searchPetdisease);
  yield takeLatest(fetchPetdiseaseDetailRequest.type, fetchPetdiseaseDetail);

  yield takeLatest(createPetdiseaseRequest.type, createPetdisease);
  yield takeLatest(updatePetdiseaseRequest.type, updatePetdisease);
  yield takeLatest(deletePetdiseaseRequest.type, deletePetdisease);
}
