// components/support/FaqRowToggle.js
import { Button, Space, Typography } from "antd";

const { Text } = Typography;

/**
 * FAQ 토글 상세(row 확장 영역)
 *
 * props
 * - record: FAQ DTO
 * - isAdmin: boolean
 * - onEdit: (record) => void   // 관리자 수정 모달
 */
export default function FaqRowToggle({ record, isAdmin = false, onEdit }) {
  if (!record) return null;

  return (
    <div style={{ padding: "10px 10px 10px 20px" }}>
      {/* 답변 */}
      <div
        style={{
          margin: "0 0 12px 0",
          padding: "5px 0 0 0",
          textAlign: "left",
          lineHeight: 1.6,
          maxWidth: 850,
          overflowWrap: "break-word",
          color: "#333",
        }}
      >
        <Text>{record.answer}</Text>
      </div>

      {/* 관리자 전용 영역 */}
      {isAdmin && (
        <>
          {/* 키워드 (우측 정렬) */}
          <div style={{ textAlign: "right", padding: "0 5px 5px 0" }}>
            {record.keywords ? (
              <Button size="small" type="default">
                {record.keywords}
              </Button>
            ) : null}
          </div>

          {/* 수정 버튼 */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Space>
              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation(); //  row 토글 클릭 방지
                  onEdit?.(record);
                }}
              >
                수정
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
}
