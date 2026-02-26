import { Card, List, Carousel, Image, Row, Col, message, Button} from "antd";

import { RetweetOutlined, CommentOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseJwt } from "../../utils/jwt";
import { fileUrl } from "../../utils/fileUrl";

import LikeButton from "./LikeButton";
import FollowButton from "./FollowButton";
import EditDeleteButtons from "./EditDeleteButtons";
import CommentSection from "./CommentSection";

import { deletePostRequest } from "../../reducers/exec/execPostReducer";
import { addRetweetRequest, removeRetweetRequest } from "../../reducers/exec/execRetweetReducer";

export default function PostCard({
  post,
  user,
  likes,
  likesCount,
  retweetedPosts,
  retweetsCount,
  expandedPostId,
  setExpandedPostId,
  handleToggleLike,
  handleToggleFollow,
  handleEdit,
  dispatch,
  likeLoading,
  followingsMap,
  followLoading,
}) {
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;
setLoginUserId(
  user?.userId ?? (payload?.sub ? Number(payload.sub) : null)
);
  }, [user]);

  const hashtagList = Array.isArray(post?.hashtags)
    ? post.hashtags
    : post?.hashtags
    ? [post?.hashtags]
    : [];

  const isFollowing = followingsMap?.[String(post?.authorId)] === true;

  const isLoggedIn = !!loginUserId;

  return (
    <Card style={{ marginBottom: "30px", borderRadius: "12px" }}>
      <List.Item>
        {retweetedPosts?.[String(post?.id)] && (
          <div style={{ fontSize: "12px", color: "green", marginBottom: "5px" }}>
            내가 리트윗한 글
          </div>
        )}
          {post?.imageUrls?.length > 0 && (
            <Carousel dots draggable style={{ marginBottom: "15px" }}>
              {post.imageUrls.map((img, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <Image
                    src={fileUrl(img)}
                    alt={`post image ${idx}`}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </Carousel>
          )}
        <List.Item.Meta
          description={
            <>
              <div
                style={{
                  whiteSpace: "pre-line",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                {post?.content}
              </div>

              <div>
                작성일:{" "}
                {post?.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "작성일 정보 없음"}
              </div>

              {hashtagList.length > 0 && (
                <div>
                  해시태그:{" "}
                  {hashtagList.map((tag, idx) => (
                    <Link
                      key={`${tag}-${idx}`}
                     href={`/exec/hashtags?tag=${encodeURIComponent(tag)}`}
                    >
                      <span
                        style={{
                          color: "#1890ff",
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      >
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              <div>작성자: {post?.authorNickname ?? "알 수 없음"}</div>
            </>
          }
        />

        <Row justify="space-between" align="middle" style={{ marginTop: "10px" }}>
          <Col>
            <LikeButton
              postId={post?.id}
              user={user}
              liked={likes?.[String(post?.id)] === true}
              likes={likesCount?.[String(post?.id)] ?? post?.likeCount ?? 0}
              onToggleLike={handleToggleLike}
              loading={likeLoading}
            />
          </Col>

          <Col>
            <div
              onClick={() => {
                if (!isLoggedIn) {
                  message.warning("로그인 후 이용 가능합니다.");
                  return;
                }

                if (retweetedPosts?.[String(post?.id)]) {
                  dispatch(removeRetweetRequest({ postId: post?.id }));
                } else {
                  dispatch(addRetweetRequest({ postId: post?.id }));
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <RetweetOutlined
                style={{
                  fontSize: "20px",
                  color: retweetedPosts?.[String(post?.id)] ? "green" : "#555",
                }}
              />
              <div style={{ fontSize: "12px" }}>
                리트윗{" "}
                {retweetsCount?.[String(post?.id)] ??
                  post?.retweetCount ??
                  0}
              </div>
            </div>
          </Col>

          <Col>
            <div
              onClick={() => {
                if (!isLoggedIn) {
                  message.warning("로그인 후 댓글 작성 가능합니다.");
                  return;
                }
                setExpandedPostId(
                  expandedPostId === post?.id ? null : post?.id
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <CommentOutlined style={{ fontSize: "20px", color: "#555" }} />
              <div style={{ fontSize: "12px" }}>댓글</div>
            </div>
          </Col>

          <Col>
            <FollowButton
              authorId={post?.authorId ?? null}
              user={user}
              isFollowing={isFollowing}
              onToggleFollow={handleToggleFollow}
              loading={followLoading}
            />
          </Col>

          <Col>
            <EditDeleteButtons
              post={post}
              user={user}
              onEdit={handleEdit}
              dispatch={dispatch}
              deletePostRequest={deletePostRequest}
            />
          </Col>
        </Row>

        {expandedPostId === post?.id && (
          <CommentSection postId={post?.id} user={user} />
        )}
      </List.Item>
    </Card>
  );
}
