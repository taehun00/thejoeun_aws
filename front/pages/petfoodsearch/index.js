// pages/petfoodsearch/index.js
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Spin } from "antd";
import BoardCard from "../../components/common/BoardCard";

// 부품 5개
import PetfoodSearchFilters from "../../components/petfoodsearch/PetfoodSearchFilters";
import PetfoodSearchAiBox from "../../components/petfoodsearch/PetfoodSearchAiBox";
import PetfoodSearchResultList from "../../components/petfoodsearch/PetfoodSearchResultList";
import PetfoodDetailModal from "../../components/petfoodsearch/PetfoodDetailModal";
import ReviewModal from "../../components/reviewboard/ReviewModal";

// reducer actions
import {
  fetchInitRequest,
  searchFilterPagingRequest,
  setFilters,
  setPstartno,
  foodApiRequest,
  openModal,
  closeModal,
} from "../../reducers/food/foodSearchReducer";

import {
  fetchModalReviewsRequest,
  closeModalReviews,
} from "../../reducers/review/reviewReducer"; //리뷰

export default function PetfoodSearchPage() {
  const dispatch = useDispatch();

  const {
    initData,
    initLoading,
    initError,

    list,
    total,
    paging,
    loading,
    error,

    filters,
    pstartno,

    ai,
    modal,
  } = useSelector((state) => state.search);

  // 이건 최상단**
  const reviewModal = useSelector((state) => state.review?.modal);

  // 초기 로드
  useEffect(() => {
    dispatch(fetchInitRequest());
  }, [dispatch]);

  //디테일 오픈창
  const [detailOpen, setDetailOpen] = useState(false);

  //검색
  const runSearch = useCallback(
    ({ nextFilters, nextPstartno } = {}) => {
      if (nextFilters) dispatch(setFilters(nextFilters));
      if (typeof nextPstartno === "number") dispatch(setPstartno(nextPstartno));

      dispatch(
        searchFilterPagingRequest({
          filters: nextFilters || null,
          pstartno: typeof nextPstartno === "number" ? nextPstartno : null,
        })
      );
    },
    [dispatch]
  );

  const onChangeFilters = useCallback(
    (patch) => {
      dispatch(setFilters(patch));
    },
    [dispatch]
  );

  const onClickSearch = useCallback(() => {
    const hasAnyValue = Object.entries(filters || {}).some(([k, v]) => {
      if (k === "condition") return false;
      if (v === null || v === undefined) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      return true;
    });

    if (!hasAnyValue) {
      alert("검색 조건을 하나 이상 선택해 주세요.");
      return;
    }

    runSearch({ nextPstartno: 1 });
  }, [filters, runSearch]);

  const onChangeCondition = useCallback(
    (condition) => {
      dispatch(setFilters({ condition: condition || null }));
      runSearch({ nextPstartno: 1, nextFilters: { condition: condition || null } });
    },
    [dispatch, runSearch]
  );

  const onChangePage = useCallback(
    (page) => {
      runSearch({ nextPstartno: page });
    },
    [runSearch]
  );

  const onOpenModal = useCallback(
    (foodid) => {
      dispatch(openModal(foodid));
    },
    [dispatch]
  );

  // 리뷰모달 오픈
  const onOpenReviewModal = useCallback(
    (foodid) => {
      dispatch(fetchModalReviewsRequest(foodid));
    },
    [dispatch]
  );

  const onCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const onCloseReviewModal = useCallback(() => {
    dispatch(closeModalReviews());
  }, [dispatch]);

  const onAskAi = useCallback(
    (userMessage) => {
      dispatch(foodApiRequest({ userMessage }));
    },
    [dispatch]
  );

  // const onApplyAiFilters = useCallback(
  //   (filterPatch) => {
  //     if (!filterPatch) return;
  //     dispatch(setFilters(filterPatch));
  //   },
  //   [dispatch]
  // );
const onApplyAiFilters = useCallback(
  (filterPatch) => {
    if (!filterPatch) return;
    dispatch(setFilters(filterPatch));
    setDetailOpen(true); // AI 적용하면 상세필터 자동 오픈
  },
  [dispatch]
);

  
  return (
    <>
      <BoardCard title="사료 찾기">
        {/* init */}
        {initLoading && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <Spin />
          </div>
        )}

        {initError && (
          <Alert
            type="error"
            showIcon
            message="초기값 로드 실패"
            description={String(initError)}
            style={{ marginBottom: 12 }}
          />
        )}
    <PetfoodSearchFilters
      initData={initData}
      filters={filters}
      onChangeFilters={onChangeFilters}
      onClickSearch={onClickSearch}
      detailOpen={detailOpen}
      setDetailOpen={setDetailOpen}
    />

        <div style={{ marginTop: 12 }}>
          <PetfoodSearchAiBox
            loading={ai?.loading}
            result={ai?.result}
            error={ai?.error}
            open={ai?.open}
            onAsk={onAskAi}
            onApplyAiFilters={onApplyAiFilters}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {error && (
            <Alert
              type="error"
              showIcon
              message="검색 실패"
              description={String(error)}
              style={{ marginBottom: 12 }}
            />
          )}

          <PetfoodSearchResultList
            list={list}
            total={total}
            paging={paging}
            loading={loading}
            filters={filters}
            pstartno={pstartno}
            onChangeCondition={onChangeCondition}
            onChangePage={onChangePage}
            onOpenModal={onOpenModal}
            onOpenReviewModal={onOpenReviewModal}
          />
        </div>

        {/* 상세 모달 */}
        <PetfoodDetailModal
          open={modal?.open}
          loading={modal?.loading}
          dto={modal?.dto}
          error={modal?.error}
          onClose={onCloseModal}
        />
      </BoardCard>

      {/* 리뷰 모달은 BoardCard 밖에 */}
      <ReviewModal
        open={reviewModal?.open}
        loading={reviewModal?.loading}
        error={reviewModal?.error}
        list={reviewModal?.list}
        onClose={onCloseReviewModal}
      />
    </>
  );
}
