// pawject4_front/components/like/ReviewLikeButton.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  likeReviewRequest,
  removeLikeReviewRequest,
} from "../../reducers/like/likeReducer";

const ReviewLikeButton = ({ reviewId }) => {
  const dispatch = useDispatch();
  const reviewLikes = useSelector((state) => state.like.reviewLikes);
  const count = reviewLikes[reviewId] || 0;

  const handleClick = () => {
    if (count > 0) {
      dispatch(removeLikeReviewRequest({ reviewId }));
    } else {
      dispatch(likeReviewRequest({ reviewId }));
    }
  };

  return (
    <button onClick={handleClick}>
      ❤️ {count}
    </button>
  );
};

export default ReviewLikeButton;
