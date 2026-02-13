import { useState, useEffect } from "react";
import { Button, Popconfirm, Descriptions } from "antd";
import { fileUrl } from "../../utils/fileUrl";
import ReportButtonQuiet from "../report/ReportButtonQuiet";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

export default function ReviewDetailRow({
  review,
  loginRole,
  loginUserId,
  onOpenEditModal,
  onDelete,
  deleteLoading = false,

  onToggleLike, //
}) {
  if (!review) return null;

  // 여기부터 taehun 작성
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setLiked(review?.liked ?? false);
    setLikeCount(review?.likeCount ?? 0);
  }, [review?.liked, review?.likeCount]);

  const isMyReview = Number(review.userid) === Number(loginUserId);

    const handleLike = async (reviewId) => {
    try {
      // 토글 요청
      const result = await onToggleLike(reviewId); // { liked: true/false, likeCount: number }

      // 서버 응답 기반으로 상태 업데이트
    if (result) {
      setLiked(result.liked ?? liked);
      setLikeCount(result.likeCount ?? likeCount);
    } else {
      // result 없으면 그냥 토글
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    }
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };
  // 여기까지 taehun 작성


  const canEditDelete =
    loginRole === "ROLE_ADMIN" ||
    (loginRole === "ROLE_MEMBER" && Number(review.userid) === Number(loginUserId));

  const openImg = (url) => {
    window.open(url, "_blank", "width=800,height=600,toolbar=no,menubar=no,resizable=yes");
  };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* 사료 이미지 */}
      <div style={{ width: 160, flexShrink: 0 }}>
        <img
          src={`/foodimg/${review.foodimg}`}
          alt="food"
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 12,
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            openImg(`/foodimg/${review.foodimg}`);
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 150 }}>
        {/* 리뷰 이미지 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: 6,
              maxWidth: 320, // 너무 가로로 길어지지 않게 제한
            }}
          >
            {Array.isArray(review.reviewimglist) &&
              review.reviewimglist.map((img) => (
                <img
                  key={img.reviewimgid ?? img.reviewimgname}
                  src={fileUrl(img.reviewimgname)} 
                  alt="review"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 10,
                    cursor: "pointer",
                    border: "1px solid #e5e7eb",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImg(fileUrl(img.reviewimgname));
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, wordBreak: "break-word" }}>
          {review.reviewcomment}
        </div>

      {/* 하단 버튼 영역 (한 줄 통일) */}
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",   
    paddingTop: 14,   
    flexWrap: "wrap",
  }}
>
  {/* 좋아요: 항상 표시 */}
<Button
  type="text"
  icon={
    liked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />
  }
  onClick={(e) => {
    e.stopPropagation();
    handleLike(review.reviewid);
  }}
  style={{
    display: "inline-flex",
    alignItems: "center",
    padding: "0 6px",
  }}
>
  <span style={{ marginLeft: 4, fontSize: 13 }}>{likeCount}</span>
</Button>

  {/* 내 글이 아니면: 신고 */}
    {!isMyReview && (
      <ReportButtonQuiet targetType="REVIEW" targetId={review.reviewid} />
    )}
  {/* 내 글(또는 관리자)이면: 수정/삭제 */}
  {canEditDelete && (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onOpenEditModal?.(review.reviewid);
        }}
      >
        수정
      </Button>

      <Popconfirm
        title="정말 삭제하시겠습니까?"
        okText="삭제"
        cancelText="취소"
        onConfirm={() => onDelete?.(review.reviewid)}
      >
        <Button danger loading={deleteLoading} onClick={(e) => e.stopPropagation()}>
          삭제
        </Button>
      </Popconfirm>
    </>
  )}
</div>

      </div>
    </div>
  );
}
