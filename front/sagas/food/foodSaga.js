// sagas/foodSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchFoodsRequest, fetchFoodsSuccess, fetchFoodsFailure,
  searchFoodsRequest, searchFoodsSuccess,  searchFoodsFailure,
  fetchFoodDetailRequest,  fetchFoodDetailSuccess,  fetchFoodDetailFailure,
  fetchFoodFormRequest,  fetchFoodFormSuccess, fetchFoodFormFailure,
  foodOcrRequest, foodOcrSuccess, foodOcrFailure,
  createFoodRequest, createFoodSuccess, createFoodFailure,
  updateFoodRequest, updateFoodSuccess, updateFoodFailure,
  deleteFoodRequest, deleteFoodSuccess, deleteFoodFailure,
  quickDeleteFoodRequest, quickDeleteFoodSuccess, quickDeleteFoodFailure,

   fetchFoodSelectListRequest, fetchFoodSelectListSuccess, fetchFoodSelectListFailure ,
} from "../../reducers/food/foodReducer";

// 목록 조회
// payload: { pageNo, condition }
function* fetchFoods(action) {
  try {
    const { pageNo = 1, condition = "" } = action.payload || {};

    const { data } = yield call(() => axios.get("/api/foodboard/foodselectForList", {
        params: {
          pageNo, ...(condition ? { condition } : {}),
        },
      })
    );

    yield put(
      fetchFoodsSuccess({ ...data, pageNo,}));
  } catch (err) {
    yield put(fetchFoodsFailure(err.response?.data?.message || err.message));
  }
}

// 검색 + 페이징 
// payload: { keyword, searchType, pageNo, condition }
function* searchFoods(action) {
  try {
    const {
      keyword = "",
      searchType = "all",
      pageNo = 1,
      condition = "",
    } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/foodboard/foodsearch", {
        params: {
          keyword,
          searchType,
          pageNo,
          ...(condition ? { condition } : {}),
        },
      })
    );

    yield put(
      searchFoodsSuccess({...data, pageNo,}));
  } catch (err) {
    yield put(searchFoodsFailure(err.response?.data?.message || err.message));
  }
}

// 상세
// payload: { foodid }
function* fetchFoodDetail(action) {
  try {
    const { foodid } = action.payload;

    const { data } = yield call(() => axios.get(`/api/foodboard/detail/${foodid}`));

    // data: { fdto, nutrientList }
    yield put(fetchFoodDetailSuccess(data));
  } catch (err) {
    yield put(fetchFoodDetailFailure(err.response?.data?.message || err.message));
  }
}

// 입력/수정용 폼 데이터
// payload: { foodid? }
function* fetchFoodForm(action) {
  try {
    const { foodid } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/foodboard/form", {
        params: foodid ? { foodid } : {},
      })
    );

    yield put(fetchFoodFormSuccess(data));
  } catch (err) {
    yield put(fetchFoodFormFailure(err.response?.data?.message || err.message));
  }
}

// OCR  - payload: { file } //multipart
function* foodOcr(action) {
  try {
    const { file } = action.payload;
    const formData = new FormData();
    formData.append("ocrfile", file);

    const { data } = yield call(() =>
      axios.post("/api/foodboard/naverocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    // data: String (OCR 결과)
    yield put(foodOcrSuccess(data));
  } catch (err) {
    yield put(foodOcrFailure(err.response?.data?.message || err.message));
  }
}


// 등록 - multipart
// payload: { dto, nutrientid[], amount[], file }
function* createFood(action) {
  try {
    const { dto, nutrientid, amount, file } = action.payload;

    const formData = new FormData();

    // dto fields
    Object.entries(dto || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v);
    });

    // nutrientid / amount : List<String> 형태로 보내야 함
    if (Array.isArray(nutrientid)) {
      nutrientid.forEach((v) => formData.append("nutrientid", v));
    }
    if (Array.isArray(amount)) {
      amount.forEach((v) => formData.append("amount", v));
    }

    if (file) {
      formData.append("file", file);
    }

    const { data } = yield call(() =>
      axios.post("/api/foodboard/foodwrite", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    // data: { success, foodid }
    yield put(createFoodSuccess(data));
  } catch (err) {
    yield put(createFoodFailure(err.response?.data?.message || err.message));
  }
}

// 수정 - multipart
// payload: { foodid, dto, nutrientid[], amount[], file }
function* updateFood(action) {
  try {
    const { foodid, dto, nutrientid, amount, file } = action.payload;
    const formData = new FormData();

    Object.entries(dto || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v);
    });

    if (Array.isArray(nutrientid)) {
      nutrientid.forEach((v) => formData.append("nutrientid", v));
    }
    if (Array.isArray(amount)) {
      amount.forEach((v) => formData.append("amount", v));
    }

    if (file) {
      formData.append("file", file);
    }

    const { data } = yield call(() =>
      axios.put(`/api/foodboard/edit/${foodid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    // data: { success, foodid }
    yield put(updateFoodSuccess(data));
  } catch (err) {
    yield put(updateFoodFailure(err.response?.data?.message || err.message));
  }
}

// 일반 삭제 - DELETE
// payload: { foodid }
function* deleteFood(action) {
  try {
    const { foodid } = action.payload;

    yield call(() => axios.delete("/api/foodboard", {params: { foodid },}));

    yield put(deleteFoodSuccess(foodid));
  } catch (err) {
    yield put(deleteFoodFailure(err.response?.data?.message || err.message));
  }
}

// 빠른삭제 - POST
// payload: { foodid }
function* quickDeleteFood(action) {
  try {
    const { foodid } = action.payload;

    yield call(() =>
      axios.post("/api/foodboard/foodquikdelete", null, {params: { foodid },}));

    yield put(quickDeleteFoodSuccess(foodid));
  } catch (err) {
    yield put(quickDeleteFoodFailure(err.response?.data?.message || err.message));
  }
}

// 테스터 연동 - 사료명 리스트
function* fetchFoodSelectListSaga() {
  try {
    const { data } = yield call(() => axios.get("/api/tester/food/selectfoodlist"));
    yield put(fetchFoodSelectListSuccess(data));
  } catch (e) {
    const msg = e?.response?.data || e?.message || "사료 리스트 불러오기 실패";
    yield put(fetchFoodSelectListFailure(msg));
  }
}

//
export default function* foodSaga() {
  yield takeLatest(fetchFoodsRequest.type, fetchFoods);
  yield takeLatest(searchFoodsRequest.type, searchFoods);

  yield takeLatest(fetchFoodDetailRequest.type, fetchFoodDetail);
  yield takeLatest(fetchFoodFormRequest.type, fetchFoodForm);

  yield takeLatest(foodOcrRequest.type, foodOcr);

  yield takeLatest(createFoodRequest.type, createFood);
  yield takeLatest(updateFoodRequest.type, updateFood);

  yield takeLatest(deleteFoodRequest.type, deleteFood);
  yield takeLatest(quickDeleteFoodRequest.type, quickDeleteFood);
  yield takeLatest(fetchFoodSelectListRequest.type, fetchFoodSelectListSaga);
}