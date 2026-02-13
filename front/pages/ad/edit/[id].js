// pages/ad/edit/[id].js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchAdRequest } from "../../../reducers/ad/adReducer"; // ✅ 광고 단건 조회 액션 import
import AdWritePage from "../AdWritePage"; // ✅ 글쓰기 컴포넌트 재사용

export default function AdEditPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // ✅ URL에서 adId 추출
  const { currentAd, loading, error } = useSelector((state) => state.ad);

  useEffect(() => {
    if (id) {
      // ✅ 광고 단건 조회 → currentAd 상태에 저장
      dispatch(fetchAdRequest({ adId: id }));
    }
  }, [id, dispatch]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>에러: {error}</p>;

  return (
    <AdWritePage
      isEditing={true} // ✅ 수정 모드로 설정
      currentAd={currentAd} // ✅ 기존 광고 데이터 전달
      setIsEditing={() => router.push("/ad")} // ✅ 수정 완료/취소 시 목록으로 이동
    />
  );
}

