// pages/reviewboard/index.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { parseJwt } from "../../utils/jwt";

import { Button, Select, Spin, Alert, message } from "antd";
import BoardCard from "../../components/common/BoardCard";
import BoardSearchBar from "../../components/common/BoardSearchBar";
import BoardToggleTable from "../../components/common/BoardToggleTable";

import ReviewTableColumns from "../../components/reviewboard/ReviewTableColumns";
import ReviewDetailRow from "../../components/reviewboard/ReviewDetailRow";
import ReviewEditModal from "../../components/reviewboard/ReviewEditModal";

import {
  fetchReviewsRequest,
  searchReviewsRequest,
  setCondition,
  fetchReviewFormRequest,
  updateReviewRequest,
  deleteReviewRequest,
} from "../../reducers/review/reviewReducer";
import {
  likeReviewRequest,
  removeLikeReviewRequest,
  countLikesReviewRequest,
  checkLikeReviewMeRequest,
} from "../../reducers/like/likeReducer";
const { Option } = Select;

export default function ReviewBoardIndex() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    reviews,
    total,
    mode,
    pageNo,
    condition,
    loading,
    error,

    formData,
    editLoading,
    editSuccess,
    editError,

    deleteLoading,
    deleteSuccess,
    deleteError,
  } = useSelector((state) => state.review);

  //  리뷰 좋아요 수 상태
  const { reviewLikedByMe, reviewLikes } = useSelector(
    (state) => state.likes
  );

  const [loginRole, setLoginRole] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);

  const [searchType, setSearchTypeUI] = useState("all");
  const [keyword, setKeywordUI] = useState("");

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  const isSearchMode = useMemo(() => mode === "search", [mode]);
  const pageSize = 10;

const canWrite = !!loginUserId;


  useEffect(() => {
    if (typeof window === "undefined") return;

console.log("[ReviewBoard] payload.sub:", payload?.sub);
console.log("[ReviewBoard] loginUserId(before set):", payload?.sub ? Number(payload.sub) : null);
console.log("[ReviewBoard] payload:", payload);
console.log("token parts:", token?.split(".")?.length);
console.log("payload raw:", token?.split(".")?.[1]);
    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;
setLoginRole(payload?.role ?? null);
    setLoginUserId(payload?.sub ? Number(payload.sub) : null);
  }, []);


  useEffect(() => {
    dispatch(fetchReviewsRequest({ pageNo: 1, condition }));
  }, []);

  // =====================
  // ❤️ 리뷰 좋아요 수 조회
  // =====================
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;
    if (!loginUserId) return;

    reviews.forEach((review) => {
      // 좋아요 수 조회
      dispatch(countLikesReviewRequest({ reviewId: review.reviewid }));
      // 로그인한 사용자가 눌렀는지 확인
      dispatch(checkLikeReviewMeRequest({ reviewId: review.reviewid }));
    });
  }, [reviews, loginUserId, dispatch]);

  useEffect(() => {
    setExpandedRowKeys([]);

    if (isSearchMode) {
      dispatch(
        searchReviewsRequest({
          keyword: keyword.trim(),
          searchType,
          pageNo: 1,
          condition,
        })
      );
    } else {
      dispatch(fetchReviewsRequest({ pageNo: 1, condition }));
    }
  }, [condition]);

  useEffect(() => {
    if (deleteError) message.error(deleteError);
  }, [deleteError]);

  useEffect(() => {
    if (editError) message.error(editError);
  }, [editError]);

  useEffect(() => {
    if (!editSuccess) return;

    message.success("수정 완료");
    setEditOpen(false);
    setEditReviewId(null);
    setExpandedRowKeys([]);

    if (isSearchMode) {
      dispatch(
        searchReviewsRequest({
          keyword: keyword.trim(),
          searchType,
          pageNo,
          condition,
        })
      );
    } else {
      dispatch(fetchReviewsRequest({ pageNo, condition }));
    }
  }, [editSuccess]);

  useEffect(() => {
    if (!deleteSuccess) return;

    message.success("삭제 완료");
    setExpandedRowKeys([]);

    if (isSearchMode) {
      dispatch(
        searchReviewsRequest({
          keyword: keyword.trim(),
          searchType,
          pageNo: 1,
          condition,
        })
      );
    } else {
      dispatch(fetchReviewsRequest({ pageNo: 1, condition }));
    }
  }, [deleteSuccess]);

  const onSearch = () => {
    const kw = keyword.trim();
    if (!kw) {
      message.warning("검색어를 입력해주세요.");
      return;
    }
    setExpandedRowKeys([]);
    dispatch(searchReviewsRequest({ keyword: kw, searchType, pageNo: 1, condition }));
  };

  const onBackToList = () => {
    setKeywordUI("");
    setSearchTypeUI("all");
    setExpandedRowKeys([]);
    dispatch(fetchReviewsRequest({ pageNo: 1, condition }));
  };

  const onChangePage = (p) => {
    setExpandedRowKeys([]);

    if (isSearchMode) {
      dispatch(searchReviewsRequest({ keyword: keyword.trim(), searchType, pageNo: p, condition }));
    } else {
      dispatch(fetchReviewsRequest({ pageNo: p, condition }));
    }
  };

  const onToggleDetail = (review) => {
    if (!review) return;

    const key = review.reviewid;
    setExpandedRowKeys((prev) => (prev?.[0] === key ? [] : [key]));
  };

  const onOpenEditModal = (reviewid) => {
    setEditOpen(true);
    setEditReviewId(reviewid);
    dispatch(fetchReviewFormRequest({ reviewid }));
  };

  const onSubmitEdit = ({ reviewid, dto, files, keepImgIds }) => {
    dispatch(updateReviewRequest({ reviewid, dto, files, keepImgIds }));
  };

  const onDelete = (reviewid) => {
    dispatch(deleteReviewRequest({ reviewid }));
  };


  //  클릭 검색 콜백 3개 (columns 생성보다 먼저 선언 필수)
  const onPetTypeFilter = useCallback(
    (pettypeid) => {
      const text = String(pettypeid) === "1" ? "고양이" : "강아지";

      setExpandedRowKeys([]);
      setSearchTypeUI("pettypeid");
      setKeywordUI(text);

      dispatch(searchReviewsRequest({ keyword: text, searchType: "pettypeid", pageNo: 1, condition }));
    },
    [dispatch, condition]
  );

  const onBrandFilter = useCallback(
    (brandname) => {
      setExpandedRowKeys([]);
      setSearchTypeUI("brandname");
      setKeywordUI(brandname);

      dispatch(searchReviewsRequest({ keyword: brandname, searchType: "brandname", pageNo: 1, condition }));
    },
    [dispatch, condition]
  );

  const onFoodFilter = useCallback(
    (foodname) => {
      setExpandedRowKeys([]);
      setSearchTypeUI("foodname");
      setKeywordUI(foodname);

      dispatch(searchReviewsRequest({ keyword: foodname, searchType: "foodname", pageNo: 1, condition }));
    },
    [dispatch, condition]
  );

  const onToggleLike = useCallback(
    (reviewId) => {
      if (!loginUserId) {
        message.warning("로그인이 필요합니다.");
        return;
      }

      const liked = reviewLikedByMe?.[reviewId];

      if (liked) {
        // 이미 눌렀으면 → 취소
        dispatch(removeLikeReviewRequest({ reviewId }));

        // 취소 후 최신 상태 반영
        dispatch(countLikesReviewRequest({ reviewId }));
        dispatch(checkLikeReviewMeRequest({ reviewId }));
      } else {
        // 안 눌렀으면 → 좋아요
        dispatch(likeReviewRequest({ reviewId }));
        
        // 좋아요 후 최신 상태 반영
        dispatch(countLikesReviewRequest({ reviewId }));
        dispatch(checkLikeReviewMeRequest({ reviewId }));
      }
    },
    [dispatch, reviewLikedByMe, loginUserId]
  );
  const columns = useMemo(
    () =>
      ReviewTableColumns({
        total,
        pageNo,
        pageSize,

        onToggleDetail,
        onOpenEditModal,
        onDelete,

        deleteLoading,
        loginRole,
        loginUserId,

        onPetTypeFilter,
        onBrandFilter,
        onFoodFilter,
      }),
    [
      total,
      pageNo,
      pageSize,
      deleteLoading,
      loginRole,
      loginUserId,
      expandedRowKeys,
      onPetTypeFilter,
      onBrandFilter,
      onFoodFilter,
    ]
  );

  const searchTypeOptions = [
    { value: "all", label: "전체" },
    { value: "pettypeid", label: "강아지/고양이" },
    { value: "brandname", label: "브랜드명" },
    { value: "foodname", label: "사료명" },
    { value: "title", label: "제목" },
  ];

  if (loading && reviews.length === 0) return <Spin tip="불러오는 중..." />;
  if (error) return <Alert type="error" message="목록 조회 실패" description={error} />;

  return (
    <BoardCard
      title="🐶사료 후기🐱"
      extra={
        canWrite ? (
          <Button type="primary" onClick={() => router.push("/reviewboard/write")}>
            리뷰 작성
          </Button>
        ) : null
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }} />
        <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
          <BoardSearchBar
            searchType={searchType}
            setSearchType={setSearchTypeUI}
            keyword={keyword}
            setKeyword={setKeywordUI}
            searchTypeOptions={searchTypeOptions}
            onSearch={onSearch}
            showBackToList={isSearchMode}
            onBackToList={onBackToList}
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Select value={condition} onChange={(v) => dispatch(setCondition(v))} style={{ width: 160 }}>
            <Option value="">최신</Option>
            <Option value="old">오래된순</Option>
          </Select>
        </div>
      </div>

      <BoardToggleTable
        rowKey="reviewid"
        columns={columns}
        dataSource={reviews}
        loading={loading}
        total={total}
        pageNo={pageNo}
        pageSize={pageSize}
        onChangePage={onChangePage}
        expandedRowRender={(record) => (
          <ReviewDetailRow
            review={record}
            loginRole={loginRole}
            loginUserId={loginUserId}
            onOpenEditModal={onOpenEditModal}
            onDelete={onDelete}
            deleteLoading={deleteLoading}

            onToggleLike={onToggleLike} // 태훈 좋아요 기능
            likeCount={reviewLikes?.[record.reviewid]}
            liked={reviewLikedByMe?.[record.reviewid]}
          />
        )}
        expandedRowKeys={expandedRowKeys}
        onExpand={(expanded, record) => {
          setExpandedRowKeys((prev) => {
            const key = record.reviewid;
            if (expanded) return [...prev, key];
            return prev.filter((k) => k !== key);
          });
        }}
        expandRowByClick
        expandIcon={() => null}
      />

      <ReviewEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        reviewid={editReviewId}
        formData={formData}
        loading={loading}
        editLoading={editLoading}
        onFetchForm={(rid) => dispatch(fetchReviewFormRequest({ reviewid: rid }))}
        onSubmitEdit={onSubmitEdit}
      />
    </BoardCard>
  );
}
