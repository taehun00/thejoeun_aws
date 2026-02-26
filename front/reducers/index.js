// import { combineReducers }  from  'redux';
import { combineReducers } from "@reduxjs/toolkit";
import foodReducer from "./food/foodReducer";
import reviewReducer from "./review/reviewReducer";
import foodSearchReducer from "./food/foodSearchReducer";
import authReducer from "./user/authReducer";
import faqReducer from "./support/faqReducer";
import csReducer from "./support/csReducer";
import likeReducer from "./like/likeReducer";
import petReducer from "./pet/petReducer";
import petdiseaseReducer from "./petdisease/petdiseaseReducer";
import adReducer from "./ad/adReducer";
import testerReducer from "./tester/testerReducer";
import reportReducer from "./report/reportReducer";
import adminReportReducer from "./admin/reportReducer";
import testerCommentReducer from "./tester/testerCommentReducer";
import execCommentReducer from "./exec/execCommentReducer";
import execFollowReducer from "./exec/execFollowReducer";
import execLikeReducer from "./exec/execLikeReducer";
import execPostReducer from "./exec/execPostReducer";
import execRetweetReducer from "./exec/execRetweetReducer";


const rootReducer = combineReducers({
  food: foodReducer,
  review: reviewReducer,
  search: foodSearchReducer,
  auth: authReducer,
  faq: faqReducer,
  cs: csReducer,
  likes: likeReducer,
  pet: petReducer,
  petdisease: petdiseaseReducer,
  ad: adReducer,
  tester: testerReducer,
  report: reportReducer,
  adminReport: adminReportReducer,
  testerComment: testerCommentReducer,
  execComment: execCommentReducer,
  execFollow: execFollowReducer,
  execLike: execLikeReducer,
  execPost: execPostReducer,
  execRetweet: execRetweetReducer,


});

export default rootReducer;