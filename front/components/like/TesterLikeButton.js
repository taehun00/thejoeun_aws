// pawject4_front/components/like/TesterLikeButton.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  likeTesterRequest,
  removeLikeTesterRequest,
} from "../../reducers/like/likeReducer";

const TesterLikeButton = ({ testerId }) => {
  const dispatch = useDispatch();
  const testerLikes = useSelector((state) => state.like.testerLikes);
  const count = testerLikes[testerId] || 0;

  const handleClick = () => {
    if (count > 0) {
      dispatch(removeLikeTesterRequest({ testerId }));
    } else {
      dispatch(likeTesterRequest({ testerId }));
    }
  };

  return (
    <button onClick={handleClick}>
      ❤️ {count}
    </button>
  );
};

export default TesterLikeButton;
