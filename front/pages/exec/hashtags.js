import { useState, useEffect } from "react";
import { Spin, Alert, Empty } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import { parseJwt } from "../../utils/jwt";

import PostList from "../../components/exec/PostList";
import EditPostModal from "../../components/exec/EditPostModal";

import {
  fetchMyLikesRequest,
  addLikeRequest,
  removeLikeRequest,
} from "../../reducers/exec/execLikeReducer";
import { fetchMyRetweetsRequest } from "../../reducers/exec/execRetweetReducer";
import { updatePostRequest } from "../../reducers/exec/execPostReducer";

export default function HashtagPage() {
  const router = useRouter();
  const { tag } = router.query;
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { likesCount, likedPosts, loading: likeLoading } = useSelector((state) => state.execLike);
  const { retweets, retweetsCount } = useSelector((state) => state.execRetweet);

  const [payload, setPayload] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const decoded = token ? parseJwt(token) : null;
    setPayload(decoded);
  }, []);

  const currentUserId =
    user?.userId ?? (payload?.sub ? Number(payload.sub) : null);

  useEffect(() => {
    if (tag) {
      setLoading(true);
      axios
        .get(`/api/exec/posts/search/hashtag?tag=${tag}`)
        .then((res) => setPosts(res.data))
        .catch((err) => {
          console.error(err);
          setError("검색 결과를 불러오지 못했습니다.");
          setPosts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [tag]);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchMyLikesRequest({ userId: currentUserId }));
      dispatch(fetchMyRetweetsRequest({ userId: currentUserId }));
    }
  }, [currentUserId, dispatch]);

  const handleEdit = (post) => {
    setEditPost(post);
    setIsEditModalVisible(true);
    setUploadFiles([]);
  };

  const handleEditSubmit = (values) => {
    dispatch(
      updatePostRequest({
        postId: editPost.id,
        dto: {
          content: values.content,
          hashtags: Array.isArray(values.hashtags)
            ? values.hashtags.join(",")
            : values.hashtags,
        },
        files: uploadFiles,
      })
    );
    setIsEditModalVisible(false);
    setEditPost(null);
  };

  const handleToggleLike = (postId) => {
    if (!currentUserId) return;

    if (likedPosts?.[postId]) {
      dispatch(removeLikeRequest({ postId }));
    } else {
      dispatch(addLikeRequest({ postId }));
    }
  };

  if (loading) return <Spin tip="검색 결과 불러오는 중..." />;
  if (error) return <Alert type="error" message="검색 실패" description={error} />;
  if (posts.length === 0) return <Empty description="검색 결과가 없습니다" />;

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <PostList
        posts={sortedPosts}
        user={user}
        likesCount={likesCount}
        likedPosts={likedPosts}
        retweetedPosts={retweets}
        retweetsCount={retweetsCount}
        expandedPostId={expandedPostId}
        setExpandedPostId={setExpandedPostId}
        handleToggleLike={handleToggleLike}
        handleEdit={handleEdit}
        dispatch={dispatch}
        likeLoading={likeLoading}
      />

      <EditPostModal
        visible={isEditModalVisible}
        editPost={editPost}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        uploadFiles={uploadFiles}
        setUploadFiles={setUploadFiles}
      />
    </>
  );
}
