// components/petdisease/PetdiseaseCardDetail.js
import { Alert, Button, Card, Collapse, Space, Spin, Tag, Typography } from "antd";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// updatedat 표시용
function formatDate(v) {
  if (!v) return "-";
  if (typeof v === "string") return v.split("T")[0];
  return String(v);
}

export default function PetdiseaseCardDetail({
  dto,
  loading,
  error,

  pettypeLabel, // "고양이" | "강아지"
  isAdmin = false,

  onClose,
  onEdit,
  onDelete,
}) {
  return (
    <div style={{ padding: "16px 12px" }}>
      <Card
        size="small"
        style={{ borderRadius: 10 }}
        title={
          <Space size={10} wrap>
            <Title level={5} style={{ margin: 0 }}>
              {dto?.disname || "질환정보"}
            </Title>
            {pettypeLabel && <Tag color="blue">{pettypeLabel}</Tag>}
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              최종 업데이트: {formatDate(dto?.updatedat)}
            </Text>

            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
            >
              닫기
            </Button>

            {isAdmin && (
              <>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(dto);
                  }}
                >
                  수정
                </Button>

                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(dto?.disno);
                  }}
                >
                  삭제
                </Button>
              </>
            )}
          </Space>
        }
        bodyStyle={{ padding: 14 }}
      >
        {/* 로딩 */}
        {loading && (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <Spin />
          </div>
        )}

        {/* 에러 */}
        {!loading && error && (
          <Alert
            type="error"
            showIcon
            message="질환정보를 불러오지 못했습니다."
            description={typeof error === "string" ? error : "잠시 후 다시 시도해 주세요."}
          />
        )}

        {/* 본문 */}
        {!loading && !error && dto && (
          <Collapse
            defaultActiveKey={["definition"]}
            items={[
              {
                key: "definition",
                label: "정의",
                children: (
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {dto.definition || "-"}
                  </Text>
                ),
              },
              {
                key: "cause",
                label: "원인",
                children: (
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {dto.cause || "-"}
                  </Text>
                ),
              },
              {
                key: "symptom",
                label: "증상",
                children: (
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {dto.symptom || "-"}
                  </Text>
                ),
              },
              {
                key: "treatment",
                label: "관리/치료",
                children: (
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {dto.treatment || "-"}
                  </Text>
                ),
              },
              {
                key: "tip",
                label: "영양 팁",
                children: (
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {dto.tip || "-"}
                  </Text>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
