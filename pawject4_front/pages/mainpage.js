import React, { useEffect, useState } from "react";
import MainPage from "../components/MainPage";
import api from "../api/axios"; // axios 설정

export default function MainPagePage() {
  const [reviewList, setReviewList] = useState([]);
  const [smartList, setSmartList] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reviews, smart, disease] = await Promise.all([
          api.get("/reviews/latest"),
          api.get("/smart/latest"),
          api.get("/disease/latest")
        ]);
        setReviewList(reviews.data);
        setSmartList(smart.data);
        setDiseaseList(disease.data);
      } catch (e) {
        console.error("MainPage 데이터 fetch 실패", e);
      }
    }
    fetchData();
  }, []);

  return <MainPage reviewList={reviewList} smartList={smartList} diseaseList={diseaseList} />;
}
