import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../api/axios";
import { message } from "antd";
import {
  fetchReportsRequest,
  fetchReportsSuccess,
  fetchReportsFailure,
  handleReportRequest,
  handleReportSuccess,
  handleReportFailure,
} from "../../reducers/admin/reportReducer";

const fetchReportsApi = ({ type, page, size }) => {
  if (type === "REVIEW") return api.get(`/api/admin/reports/review?page=${page}&size=${size}`);
  if (type === "TESTER") return api.get(`/api/admin/reports/tester?page=${page}&size=${size}`);
  return api.get(`/api/admin/reports?page=${page}&size=${size}`);
};

const handleReportApi = ({ reportId, status, action, note }) => {
  return api.post(
    `/api/admin/reports/${reportId}/handle`,
    { status, action, note },
    { headers: { "Content-Type": "application/json" } }
  );
};

function* fetchReports(action) {
  try {
    const { data } = yield call(fetchReportsApi, action.payload);
    console.log("fetchReports API data:", data); // 확인용
    yield put(fetchReportsSuccess(data));
  } catch (err) {
    yield put(fetchReportsFailure(err.message));
    message.error("신고 목록 조회 실패");
  }
}

function* handleReport(action) {
  try {
    yield call(handleReportApi, action.payload);
    yield put(handleReportSuccess());
    message.success("신고 처리 완료");
  } catch (err) {
    yield put(handleReportFailure(err.message));
    message.error("신고 처리 실패");
  }
}

export default function* adminReportSaga() {
  yield takeLatest(fetchReportsRequest.type, fetchReports);
  yield takeLatest(handleReportRequest.type, handleReport);
}
