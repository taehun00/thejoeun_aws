import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Spin,
  Alert,
  message,
  Tabs,
  Row,
  Col,
  Input,
  Button,
  List,
  Avatar,
} from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

import { parseJwt } from "../../utils/jwt";

import {
  fetchPostsPagedRequest,
  fetchLikedPostsRequest,
  fetchMyAndRetweetsRequest,
  updatePostRequest,
} from "../../reducers/exec/execPostReducer";
import {
  addLikeRequest,
  removeLikeRequest,
  fetchMyLikesRequest,
} from "../../reducers/exec/execLikeReducer";
import {
  toggleFollowRequest,
  loadFollowingsRequest,
  loadFollowersRequest,
  unfollowRequest,
} from "../../reducers/exec/execFollowReducer";
import { fetchMyRetweetsRequest } from "../../reducers/exec/execRetweetReducer";

import PostList from "../../components/exec/PostList";
import EditPostModal from "../../components/exec/EditPostModal";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);
  const {
    posts,
    likedPosts,
    myAndRetweets,
    loading,
    error,
    hasNext,
  } = useSelector((state) => state.execPost);

  const {
    likes = {},
    likesCount = {},
    loading: likeLoading,
  } = useSelector((state) => state.execLike);

  const {
    followingsMap,
    followersList = [],
    followingsList = [],
    loading: followLoading,
  } = useSelector((state) => state.execFollow);

  const { retweets, retweetsCount } = useSelector(
    (state) => state.execRetweet
  );

  const [payload, setPayload] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [pageAll, setPageAll] = useState(1);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");
    const decoded = token ? parseJwt(token) : null;
    setPayload(decoded);
  }, []);

  const currentUserId =
    user?.userId ?? (payload?.sub ? Number(payload.sub) : null);

  useEffect(() => {
    dispatch(fetchPostsPagedRequest({ page: 1, size: 10 }));
    setPageAll(2);

    if (currentUserId) {
      dispatch(fetchLikedPostsRequest({ page: 1, size: 10 }));
      dispatch(fetchMyAndRetweetsRequest({ page: 1, size: 10 }));
      dispatch(fetchMyLikesRequest({ userId: currentUserId }));
      dispatch(fetchMyRetweetsRequest({ userId: currentUserId }));
      dispatch(loadFollowingsRequest());
      dispatch(loadFollowersRequest());
    }
  }, [dispatch, currentUserId]);

  const fetchMoreAll = () => {
    if (!hasNext) return;
    dispatch(fetchPostsPagedRequest({ page: pageAll, size: 10 }));
    setPageAll((prev) => prev + 1);
  };

  const handleSearch = () => {
    if (!searchTag.trim()) return;
    router.push(`/exec/hashtags?tag=${encodeURIComponent(searchTag.trim())}`);
    setSearchTag("");
  };
const handleWriteClick = () => {
  router.push("/exec/posts/new");
};
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
    if (!currentUserId) {
      message.warning("로그인 후 이용 가능합니다.");
      router.push("/user/login");
      return;
    }
    const key = String(postId);
    if (likes[key] === true) {
      dispatch(removeLikeRequest({ postId }));
    } else {
      dispatch(addLikeRequest({ postId }));
    }
    dispatch(fetchLikedPostsRequest({ page: 1, size: 10 }));
  };

  const handleToggleFollow = (authorId) => {
    if (!currentUserId) {
      message.warning("로그인 후 이용 가능합니다.");
      router.push("/user/login");
      return;
    }
    if (!authorId) {
      message.error("팔로우 대상 ID가 없습니다.");
      return;
    }
    dispatch(toggleFollowRequest({ followeeId: authorId }));
  };

  if (loading && posts.length === 0)
    return <Spin tip="글 목록을 불러오는 중..." />;
  if (error)
    return (
      <Alert type="error" message="글목록 불러오기 실패" description={error} />
    );

  return (
    <>
      {/* 상단 중앙 해시태그 검색 */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Col style={{ width: 360 }}>
          <Input
            size="middle"
            prefix={<SearchOutlined />}
            placeholder="해시태그 검색"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>
      </Row>



      <Tabs
            defaultActiveKey="all"
            centered
            onChange={(key) => {
              if (!currentUserId) return;

              if (key === "liked") {
                dispatch(fetchLikedPostsRequest({ page: 1, size: 10 }));
              }

              if (key === "my") {
                dispatch(fetchMyAndRetweetsRequest({ page: 1, size: 10 }));
              }
            }}
          >
        <Tabs.TabPane tab="전체 글" key="all">
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreAll}
            hasMore={hasNext}
            loader={<Spin tip="더 불러오는 중..." />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                모든 글을 불러왔습니다
              </p>
            }
            style={{ overflow: "visible" }}
          >
            <PostList
              posts={posts}
              user={user}
              likes={likes}
              likesCount={likesCount}
              retweetedPosts={retweets}
              retweetsCount={retweetsCount}
              expandedPostId={expandedPostId}
              setExpandedPostId={setExpandedPostId}
              handleToggleLike={handleToggleLike}
              handleToggleFollow={handleToggleFollow}
              handleEdit={handleEdit}
              dispatch={dispatch}
              likeLoading={likeLoading}
              followingsMap={followingsMap}
              followLoading={followLoading}
              handleWriteClick={handleWriteClick}
            />
          </InfiniteScroll>
        </Tabs.TabPane>

        {currentUserId && (
          <Tabs.TabPane tab="좋아요 한 글" key="liked">
            <PostList
              posts={likedPosts}
              user={user}
              likes={likes}
              likesCount={likesCount}
              retweetedPosts={{}} 
              retweetsCount={{}}
              expandedPostId={expandedPostId}
              setExpandedPostId={setExpandedPostId}
              handleToggleLike={handleToggleLike}
              handleToggleFollow={handleToggleFollow}
              handleEdit={handleEdit}
              dispatch={dispatch}
              likeLoading={likeLoading}
              followingsMap={followingsMap}
              followLoading={followLoading}
            />
          </Tabs.TabPane>
        )}

        {currentUserId && (
          <Tabs.TabPane tab="내 글 + 리트윗" key="my">
            <PostList
              posts={myAndRetweets}
              user={user}
              likes={likes}
              likesCount={likesCount}
              retweetedPosts={retweets}
              retweetsCount={retweetsCount}
              expandedPostId={expandedPostId}
              setExpandedPostId={setExpandedPostId}
              handleToggleLike={handleToggleLike}
              handleToggleFollow={handleToggleFollow}
              handleEdit={handleEdit}
              dispatch={dispatch}
              likeLoading={likeLoading}
              followingsMap={followingsMap}
              followLoading={followLoading}
            />
          </Tabs.TabPane>
        )}

        {currentUserId && (
          <Tabs.TabPane tab={`팔로워 ${followersList.length}`} key="followers">
            <List
              loading={followLoading}
              dataSource={Array.isArray(followersList) ? followersList : []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{item.nickname?.[0]}</Avatar>}
                    title={item.nickname}
                    description={item.email}
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>
        )}

        {currentUserId && (
          <Tabs.TabPane tab={`팔로잉 ${followingsList.length}`} key="followings">
            <List
              loading={followLoading}
              dataSource={Array.isArray(followingsList) ? followingsList : []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="unfollow"
                      onClick={() =>
                        dispatch(
                          unfollowRequest({ followeeId: item.followeeId })
                        )
                      }
                    >
                      언팔로우
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar>{item.nickname?.[0]}</Avatar>}
                    title={item.nickname}
                    description={item.email}
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>
        )}
      </Tabs>

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
