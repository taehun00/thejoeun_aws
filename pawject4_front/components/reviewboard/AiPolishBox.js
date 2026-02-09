// components/common/AiPolishBox.js
import { useMemo, useState } from "react";
import { Button, Typography, Space, Card, message } from "antd";
import { RobotOutlined, CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

// 응답 파서: "제목: xxx\n내용: yyy" 형태
function parseAiResult(text) {
  if (!text) return { title: "", content: "" };

  let refinedTitle = "";
  let refinedContent = "";

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("제목:")) {
      refinedTitle = trimmed.replace("제목:", "").trim();
    } else if (trimmed.startsWith("내용:")) {
      refinedContent = trimmed.replace("내용:", "").trim();
    }
  });

  return { title: refinedTitle, content: refinedContent };
}

/**
 * 공용 AI 다듬기 부품
 *
 * props
 * - titleValue: 현재 제목
 * - contentValue: 현재 내용
 * - loading: AI 호출 로딩상태(선택)
 * - onRequest: ({title, reviewcomment}) => void  // 사가 dispatch
 * - resultText: 백에서 받은 문자열 ("제목:..\n내용:..")
 * - onApply: ({title, content}) => void // 부모 form에 적용
 */
export default function AiPolishBox({
  titleValue = "",
  contentValue = "",

  loading = false,
  onRequest,

  resultText = "",
  onApply,
}) {
  const [openResult, setOpenResult] = useState(false);

  const parsed = useMemo(() => parseAiResult(resultText), [resultText]);

  const handleRequest = () => {
    const title = (titleValue || "").trim();
    const reviewcomment = (contentValue || "").trim();

    if (!title || !reviewcomment) {
      message.warning("제목과 내용을 먼저 작성하세요.");
      return;
    }

    setOpenResult(true);
    onRequest?.({ title, reviewcomment });
  };

  const handleApply = () => {
    if (!parsed.title && !parsed.content) {
      message.warning("적용할 결과가 없습니다.");
      return;
    }

    onApply?.({ title: parsed.title, content: parsed.content });
    message.success("AI 추천 문장을 적용했습니다.");
  };

  return (
    <Card style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Space>
            <RobotOutlined />
            <Text strong>AI 리뷰 다듬기</Text>
            <Text type="secondary">작성하신 리뷰를 좀 더 부드럽게 다듬어 볼까요?</Text>
          </Space>

          <Button type="primary" onClick={handleRequest} loading={loading}>
            다듬기
          </Button>
        </Space>

        {openResult && (
          <div style={{ marginTop: 10 }}>
            <Text strong>AI 추천 문장</Text>

            <pre
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 8,
                background: "#fafafa",
                border: "1px solid #eee",
                whiteSpace: "pre-wrap",
              }}
            >
              {resultText || (loading ? "생성 중..." : "결과 없음")}
            </pre>

            <Button
              icon={<CheckOutlined />}
              onClick={handleApply}
              disabled={loading || !resultText}
            >
              사용하기
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
}
