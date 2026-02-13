// components/support/HelpBox.js
import { Card, Typography, Row, Col, message } from "antd";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

/**
 * 유저용 도움 박스 (1:1 문의 + 채팅 안내 영역)
 *
 * props
 * - onOpenChat?: ()=>void
 * - isLogin?: boolean  
 */
export default function HelpBox({ onOpenChat, isLogin = false }) {
  const router = useRouter();

  const needLogin = () => {
    message.warning("로그인 후 이용 가능합니다.");
    router.push("/user/login");
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      <Title level={4} style={{ textAlign: "center", marginBottom: 25, fontWeight: 600 }}>
        다른 도움이 필요하신가요?
      </Title>

      <Row gutter={[40, 40]} justify="center">
        {/* 1:1 문의하기 */}
        <Col>
          <Card
            hoverable
            style={{
              width: 350,
              borderRadius: 20,
              border: "2px solid darkgrey",
              textAlign: "center",
            }}
            onClick={() => {
              if (!isLogin) return needLogin();
              router.push("/cs/questionWrite");
            }}
          >
            <p style={{ fontSize: 25, marginBottom: 6 }}>💌1:1 문의하기</p>
            <p style={{ fontSize: 18, marginBottom: 0 }}>궁금하신 사항을 남겨주세요</p>
            <p style={{ fontSize: 18, marginBottom: 0 }}>순차적으로 답변해 드립니다</p>
          </Card>
        </Col>

        {/* 채팅 문의하기 */}
        <Col>
          <Card
            hoverable
            style={{
              width: 350,
              borderRadius: 20,
              border: "2px solid darkgrey",
              textAlign: "center",
            }}
            onClick={() => {
              if (!isLogin) return needLogin();
              onOpenChat?.();
            }}
          >
            <p style={{ fontSize: 25, marginBottom: 6 }}>💬채팅 문의하기</p>
            <p style={{ fontSize: 18, marginBottom: 0 }}>상담 가능 시간:</p>
            <p style={{ fontSize: 18, marginBottom: 0 }}>평일 10:00 ~ 18:00</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
