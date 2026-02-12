// pages/mainpage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Redux hooks 추가
import MainPage from "../components/MainPage";
import api from "../api/axios"; // axios 설정
import { fetchLatestAdsRequest } from "../reducers/ad/adReducer"; // ✅ 사가 액션 import

export default function MainPagePage() {
  const dispatch = useDispatch();

  // ✅ Redux store에서 최신 광고 상태 가져오기
  const { latestAds, loading, error } = useSelector((state) => state.ad);

  const [reviewList, setReviewList] = useState([]);
  const [smartList, setSmartList] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);

  useEffect(() => {
    // ✅ 광고 목록 불러오기 (예: 최신 20개)
    dispatch(fetchLatestAdsRequest({ start: 1, end: 3 }));
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reviews, smart, disease] = await Promise.all([
          api.get("/reviews/latest"),
          api.get("/smart/latest"),
          api.get("/disease/latest"),
        ]);

        setReviewList(reviews.data);
        setSmartList(smart.data);
        setDiseaseList(disease.data); 

      } catch (e) {
        console.error("MainPage 데이터 fetch 실패", e);
      }
    }
    fetchData();
  }, []); // ✅ dispatch 의존성 추가

  return (
    <MainPage
      reviewList={reviewList}
      smartList={smartList}
      diseaseList={diseaseList}
      adList={latestAds} // ✅ 사가에서 가져온 최신 광고 전달
      loading={loading}
      error={error}
    />
  );
}
