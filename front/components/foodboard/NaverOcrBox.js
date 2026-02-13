// components/foodboard/NaverOcrBox.js
import { useEffect, useRef } from "react";
import { Button, Card, Input, Space, Spin, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { foodOcrRequest } from "../../reducers/food/foodReducer";

const { TextArea } = Input;
const { Title, Text } = Typography;

/**
 * OCR 박스
 * - 이미지 선택 -> OCR 추출 -> 결과를 TextArea에 표시
 */
export default function NaverOcrBox({ title = "라벨 텍스트 추출" }) {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const { ocrLoading, ocrResult, ocrError } = useSelector((state) => state.food);

  useEffect(() => {
    if (ocrError) message.error(ocrError);
  }, [ocrError]);

  const onPickFile = () => {
    fileRef.current?.click();
  };

  const onChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    dispatch(foodOcrRequest({ file }));

    // 같은 파일 다시 선택해도 이벤트 발생하도록 초기화
    e.target.value = "";
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Title level={5} style={{ marginBottom: 12 }}>
        {title}
      </Title>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChangeFile}
      />

      <Space style={{ marginBottom: 12 }}>
        <Button onClick={onPickFile} disabled={ocrLoading}>
          이미지 선택
        </Button>

        {ocrLoading && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Spin size="small" />
            <Text type="secondary">OCR 처리중...</Text>
          </span>
        )}
      </Space>

      <TextArea
        value={ocrResult || ""}
        placeholder="OCR 추출 결과를 표시합니다."
        rows={6}
        readOnly
      />
    </Card>
  );
}
