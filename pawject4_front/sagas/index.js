// sagas/index.js 
import { all,fork } from 'redux-saga/effects';

import foodSaga      from './food/foodSaga';
import reviewSaga      from './review/reviewSaga';
import foodSearchSaga      from './food/foodSearchSaga';
import authSaga from "./user/authSaga";
import faqSaga from "./support/faqSaga";
import csSaga from "./support/csSaga";
import likeSaga from "./like/likeSaga";
import petSaga from "./pet/petSaga";
import adminReportSaga from "./admin/reportSaga";
import reportSaga from "./report/reportSaga"
import petdiseaseSaga from "./petdisease/petdiseaseSaga";
import adSaga from "./ad/adSaga";
import testerSaga from "./tester/testerSaga";
import testerCommentSaga from "./tester/testerCommentSaga";


export default  function * rootSaga(){
  yield all([
    fork( foodSaga ) ,
    fork( reviewSaga ) ,
    fork(foodSearchSaga),
    fork(authSaga), 
    fork(faqSaga),
    fork(csSaga),
    fork(likeSaga),
    fork(petSaga),
    fork(adminReportSaga),
    fork(reportSaga),
    fork(petdiseaseSaga),
    fork(adSaga), 
    fork(testerSaga),
    fork(testerCommentSaga)
  ]);  
}

