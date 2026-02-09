import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import api from "../../api/axios";
import {
  reportRequest,
  reportSuccess,
  reportFailure,
} from "../../reducers/report/reportReducer";

/* API */
const reportApi = ({ targetType, targetId, reason, details }) => {
  const url =
    targetType === "REVIEW"
      ? `/api/reports/review?reviewId=${targetId}`
      : `/api/reports/tester?testerId=${targetId}`;

  return api.post(url, { reason, details });
};

/* Saga */
function* report(action) {
  try {
    yield call(reportApi, action.payload);
    yield put(reportSuccess());
    message.success("신고가 접수되었습니다");
  } catch (err) {
    yield put(reportFailure(err.response?.data?.message || err.message));
    message.error("이미 신고한 대상입니다");
  }
}

export default function* reportSaga() {
  yield takeLatest(reportRequest.type, report);
}
