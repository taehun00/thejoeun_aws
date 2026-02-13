// sagas/food/foodSearchSaga.js
import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchInitRequest,
  fetchInitSuccess,
  fetchInitFailure,

  searchFilterPagingRequest,
  searchFilterPagingSuccess,
  searchFilterPagingFailure,

  foodApiRequest,
  foodApiSuccess,
  foodApiFailure,

  openModal,
  fetchModalCardRequest,
  fetchModalCardSuccess,
  fetchModalCardFailure,

  setPstartno,
  setFilters,
} from "../../reducers/food/foodSearchReducer";

// init
function initApi() {
  return axios.get("/api/petfoodsearcher/init");
}

// search + paging
function searchFilterPagingApi(params) {
  return axios.get("/api/petfoodsearcher/searchfilterPaging", { params });
}

// ai filter
function foodApiApi(userMessage) {
  return axios.post("/api/petfoodsearcher/foodapi", null, {
    params: { userMessage },
  });
}

// modal card
function modalCardApi(foodid) {
  return axios.get(`/api/petfoodsearcher/modalcard/${foodid}`);
}

/**
 * 공통 유틸: 쿼리 파라미터 정리
 * - null/undefined/"" 인 값은 key 자체를 삭제
 * - axios 직렬화 이슈 방지
 */
function cleanParams(obj) {
  const out = { ...(obj || {}) };

  Object.keys(out).forEach((k) => {
    const v = out[k];

    if (typeof v === "string" && v.trim() === "") {
      delete out[k];
      return;
    }

    if (v === null || v === undefined) {
      delete out[k];
      return;
    }
  });

  return out;
}

/**
 * AI가 내려준 filters(JSON)를
 * UI filters(state.search.filters) 구조로 변환
 *
 * AI: { pettype:"고양이", brandname:"로얄캐닌", rangelabel:"체중관리", ... }
 * UI: { pettypeid:1, brandid:3, rangeid:2, ... }
 */
function mapAiFiltersToUiFilters(aiFilters, initData) {
  const out = {};
  const f = aiFilters || {};

  const brandList = initData?.brandList || [];
  const rangeList = initData?.rangeList || [];

  // pettype (문자 -> pettypeid)
  if (f.pettype) {
    const v = String(f.pettype).trim();

    if (v.includes("고양이") || v.toLowerCase().includes("cat")) out.pettypeid = 1;
    else if (
      v.includes("강아지") ||
      v.includes("개") ||
      v.toLowerCase().includes("dog") ||
      v.toLowerCase().includes("puppy")
    ) {
      out.pettypeid = 2;
    }
  }

  // brandname (문자 -> brandid)
  if (f.brandname) {
    const v = String(f.brandname).trim().toLowerCase();
    const found = brandList.find(
      (b) => String(b?.brandname || "").trim().toLowerCase() === v
    );
    if (found?.brandid !== undefined && found?.brandid !== null) {
      out.brandid = found.brandid;
    }
  }

  // foodtype/category/petagegroup/isgrainfree/origin (그대로)
  if (f.foodtype) out.foodtype = String(f.foodtype).trim();
  if (f.category) out.category = String(f.category).trim();
  if (f.petagegroup) out.petagegroup = String(f.petagegroup).trim();
  if (f.isgrainfree) out.isgrainfree = String(f.isgrainfree).trim(); // "Y"/"N"
  if (f.origin) out.origin = String(f.origin).trim();

  // rangelabel (문자 -> rangeid)
  if (f.rangelabel) {
    const v = String(f.rangelabel).trim().toLowerCase();
    const found = rangeList.find(
      (r) => String(r?.rangelabel || "").trim().toLowerCase() === v
    );
    if (found?.rangeid !== undefined && found?.rangeid !== null) {
      out.rangeid = found.rangeid;
    }
  }

  return out;
}

// init
function* fetchInit() {
  try {
    const { data } = yield call(initApi);
    yield put(fetchInitSuccess(data));
  } catch (e) {
    yield put(fetchInitFailure(e?.response?.data || e.message));
  }
}

// 검색+페이징
function* searchFilterPaging(action) {
  try {
    const payload = action.payload || {};

    const stateFilters = yield select((state) => state.search?.filters || {});
    const statePstartno = yield select((state) => state.search?.pstartno || 1);

    const merged = {
      ...stateFilters,
      ...(payload.filters || {}),
    };

    const nextPstartno =
      payload.pstartno !== undefined && payload.pstartno !== null
        ? payload.pstartno
        : statePstartno || 1;

    // store 페이지번호 동기화
    yield put(setPstartno(nextPstartno));

    // params 정리해서 전송
    const params = cleanParams({
      keyword: merged.keyword ?? null,
      pettypeid: merged.pettypeid ?? null,
      foodtype: merged.foodtype ?? null,
      brandid: merged.brandid ?? null,
      foodid: merged.foodid ?? null,
      category: merged.category ?? null,
      petagegroup: merged.petagegroup ?? null,
      isgrainfree: merged.isgrainfree ?? null,
      origin: merged.origin ?? null,
      rangeid: merged.rangeid ?? null,
      minvalue: merged.minvalue ?? null,
      maxvalue: merged.maxvalue ?? null,
      condition: merged.condition ?? null,
      pstartno: nextPstartno,
    });

    const { data } = yield call(() => searchFilterPagingApi(params));
    yield put(searchFilterPagingSuccess(data));
  } catch (e) {
    yield put(searchFilterPagingFailure(e?.response?.data || e.message));
  }
}

// AI 필터 변환 (검색 실행 X, 필터만 state에 반영)
function* foodApi(action) {
  try {
    const { userMessage } = action.payload || {};
    if (!userMessage) throw new Error("userMessage 누락");

    const { data } = yield call(() => foodApiApi(userMessage));

    // AI 결과 저장 (메시지 표시용)
    yield put(foodApiSuccess(data));

    //  initData 가져오기 (브랜드/라벨 -> id 매핑용)
    const initData = yield select((state) => state.search?.initData);

    //  AI filters -> UI filters
    const aiFilters = data?.filters || {};
    const uiFilters = mapAiFiltersToUiFilters(aiFilters, initData);

    //필터만 반영 (검색은 사용자가 버튼 눌러서 실행)
    if (uiFilters && Object.keys(uiFilters).length > 0) {
      yield put(setFilters(uiFilters));
    }
  } catch (e) {
    yield put(foodApiFailure(e?.response?.data || e.message));
  }
}

// 모달 상세 오픈 - 상세카드 호출
function* openModalAndFetch(action) {
  try {
    const foodid = action.payload;
    if (!foodid) return;

    yield put(fetchModalCardRequest());

    const { data } = yield call(() => modalCardApi(foodid));

    // 레이스 가드
    const modal = yield select((state) => state.search?.modal);
    if (!modal?.open) return;
    if (modal?.foodid !== foodid) return;

    yield put(fetchModalCardSuccess(data));
  } catch (e) {
    yield put(fetchModalCardFailure(e?.response?.data || e.message));
  }
}

export default function* foodSearchSaga() {
  yield takeLatest(fetchInitRequest.type, fetchInit);
  yield takeLatest(searchFilterPagingRequest.type, searchFilterPaging);
  yield takeLatest(foodApiRequest.type, foodApi);
  yield takeLatest(openModal.type, openModalAndFetch);
}