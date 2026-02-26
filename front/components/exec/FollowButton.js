import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { parseJwt } from "../../utils/jwt";

export default function FollowButton({
  authorId,
  user,
  isFollowing,
  onToggleFollow,
  loading,
}) {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const decoded = token ? parseJwt(token) : null;
    setPayload(decoded);
  }, []);


const currentUserId =
  user?.userId ?? (payload?.sub ? Number(payload.sub) : null);

  const handleClick = () => {
    if (!currentUserId) {
      message.info("로그인한 사용자만 팔로우할 수 있습니다.");
      window.location.href = "/user/login";
      return;
    }

    if (!authorId) {
      message.error("팔로우 대상 ID가 없습니다.");
      return;
    }

    if (Number(authorId) === Number(currentUserId)) {
      message.warning("자기 자신은 팔로우할 수 없습니다.");
      return;
    }

    if (loading) return;

    if (typeof onToggleFollow === "function") {
      onToggleFollow(authorId);
    }
  };

  return (
    <Button
      type={isFollowing ? "default" : "primary"}
      danger={isFollowing}
      icon={isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
      loading={loading}
      onClick={handleClick}
      style={{ borderRadius: "6px" }}
    >
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
}
