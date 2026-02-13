import { call, put, takeLatest } from "redux-saga/effects";
import {
  getPetRequest,
  getPetSuccess,
  getPetFailure,
  updatePetRequest,
  updatePetSuccess,
  updatePetFailure,
  deletePetRequest,
  deletePetSuccess,
  deletePetFailure,
} from "../../reducers/pet/petReducer";
import {
  getPetDetailApi,
  updatePetApi,
  deletePetApi,
} from "../../api/pet";
import Router from "next/router";
import { message } from "antd";

function* getPet(action) {
  try {
    const { data } = yield call(getPetDetailApi, action.payload);
    yield put(getPetSuccess(data));
  } catch (err) {
    yield put(getPetFailure(err.message));
  }
}

function* updatePet(action) {
  try {
    const { petId, formData } = action.payload;
    const { data } = yield call(updatePetApi, { petId, formData });
    yield put(updatePetSuccess(data));
    message.success("펫 정보 수정 완료");
    Router.push("/user/mypage");
  } catch (err) {
    yield put(updatePetFailure(err.message));
    message.error("수정 실패");
  }
}

function* deletePet(action) {
  try {
    yield call(deletePetApi, action.payload);
    yield put(deletePetSuccess());
    message.success("펫 삭제 완료");
    Router.push("/user/mypage");
  } catch (err) {
    yield put(deletePetFailure(err.message));
    message.error("삭제 실패");
  }
}

export default function* petSaga() {
  yield takeLatest(getPetRequest.type, getPet);
  yield takeLatest(updatePetRequest.type, updatePet);
  yield takeLatest(deletePetRequest.type, deletePet);
}
