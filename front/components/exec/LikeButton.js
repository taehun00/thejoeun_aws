import { Button, Spin, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { parseJwt } from "../../utils/jwt";

export default function LikeButton({
  postId,
  user,
  liked,
  likes,
  onToggleLike,
  loading,
}) {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setCurrentUserId(
      user?.userId ?? (payload?.sub ? Number(payload.sub) : null)
    );
  }, [user]);

  const handleClick = () => {
    if (!currentUserId) {
      message.warning("로그인 후 이용 가능합니다.");
      window.location.href = "/user/login";
      return;
    }

    if (loading) return;

    if (typeof onToggleLike === "function") {
      onToggleLike(postId);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button type="text" onClick={handleClick}>
        {loading ? (
          <Spin size="small" />
        ) : liked ? (
          <HeartFilled style={{ fontSize: "20px", color: "red" }} />
        ) : (
          <HeartOutlined style={{ fontSize: "20px", color: "#555" }} />
        )}
        <div style={{ fontSize: "12px" }}>
          좋아요 {likes ?? 0}
        </div>
      </Button>
    </div>
  );
}
