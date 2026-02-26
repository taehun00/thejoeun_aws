import { Col, Row } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { parseJwt } from "../../utils/jwt";
import { useEffect, useState } from "react";

export default function EditDeleteButtons({ post, onEdit, dispatch, deletePostRequest }) {
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;
    setLoginUserId(payload?.sub ? Number(payload.sub) : null);
  }, []);

  const isAuthor =
   Number(post?.authorId) === Number(loginUserId)

  if (!isAuthor) return null;

  return (
    <Row>
      <Col flex={1} style={{ textAlign: "center", marginRight: "20px" }}>
        <div
          onClick={() => onEdit(post)}
          style={{ cursor: "pointer" }}
        >
          <EditOutlined style={{ fontSize: "20px", color: "#555" }} />
          <div style={{ fontSize: "12px" }}>수정</div>
        </div>
      </Col>
      <Col flex={1} style={{ textAlign: "center" }}>
        <div
          onClick={() => dispatch(deletePostRequest({ postId: post.id }))}
          style={{ cursor: "pointer" }}
        >
          <DeleteOutlined style={{ fontSize: "20px", color: "red" }} />
          <div style={{ fontSize: "12px" }}>삭제</div>
        </div>
      </Col>
    </Row>
  );
}
