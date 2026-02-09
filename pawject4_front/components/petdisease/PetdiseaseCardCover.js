// components/petdisease/PetdiseaseCardCover.js
import { Button, Divider, Space, Tag, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function formatDate(v) {
  if (!v) return "-";
  if (typeof v === "string") return v.split("T")[0];
  return String(v);
}

export default function PetdiseaseCardCover({
  item,
  pettypeLabel, // "고양이" | "강아지"
  onOpen,
}) {
  if (!item) return null;

  return (
    <div style={{ padding: "12px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        {/* 좌측: 질환명 + 정의요약 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Space size={10} wrap>
            <Title level={5} style={{ margin: 0 }}>
              {item.disname}
            </Title>

            <Tag color="blue" style={{ margin: 0 }}>
              {pettypeLabel || "반려동물"}
            </Tag>
          </Space>

          <Divider style={{ margin: "10px 0" }} />

          <Text type="secondary" ellipsis={{ tooltip: item.definition }}>
            {item.definition}
          </Text>
        </div>

        {/* 우측: 메타 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            최종 업데이트: {formatDate(item.updatedat)}
          </Text>

          <div style={{ marginTop: 10 }}>
            <Button
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(item.disno);
              }}
            >
              자세히
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
