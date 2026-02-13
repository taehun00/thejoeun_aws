// components/petdisease/PetdiseaseDetailModal.js
import { Modal, Button, Space, Spin, Alert, Empty, Descriptions, Divider, Typography, Popconfirm } from "antd";

const { Text } = Typography;

export default function PetdiseaseDetailModal({
  open,
  onClose,

  dto,
  detail,

  canAdmin,
  onOpenEdit,
  onDelete,
}) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        canAdmin && dto?.disno ? (
          <Space key="adminBtns">
            <Button onClick={onOpenEdit}>수정</Button>

            <Popconfirm
              title="정말 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={onDelete}
            >
              <Button danger>삭제</Button>
            </Popconfirm>
          </Space>
        ) : null,


      ]}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {dto?.disname ? dto.disname : "질환 상세"}
          </div>

          <span
            style={{
              padding: "2px 8px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid #d9d9d9",
              background: "#fafafa",
              lineHeight: 1.4,
            }}
          >
            {dto?.pettypeid === 1 ? "고양이" : dto?.pettypeid === 2 ? "강아지" : "기타"}
          </span>
        </div>
      }
      width={860}
      destroyOnClose
    >
      {detail?.loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!detail?.loading && detail?.error && (
        <Alert
          type="error"
          showIcon
          message="상세 조회 실패"
          description={typeof detail.error === "string" ? detail.error : JSON.stringify(detail.error)}
        />
      )}

      {!detail?.loading && !detail?.error && dto && (
        <>
          <Descriptions
            bordered
            column={1}
            labelStyle={{
              width: 120,
              whiteSpace: "nowrap",
              wordBreak: "keep-all",
            }}
            contentStyle={{
              wordBreak: "keep-all",
              whiteSpace: "pre-wrap",
            }}
          >
            <Descriptions.Item label="정의">{dto.definition || "-"}</Descriptions.Item>
            <Descriptions.Item label="원인">{dto.cause || "-"}</Descriptions.Item>
            <Descriptions.Item label="증상">{dto.symptom || "-"}</Descriptions.Item>
            <Descriptions.Item label="치료">{dto.treatment || "-"}</Descriptions.Item>
            <Descriptions.Item label="Tip">
              {dto.tip ? <>{dto.tip}이 권장될 수 있어요</> : <Text type="secondary">등록된 팁 정보가 없습니다.</Text>}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Text type="secondary" style={{ fontSize: 12, whiteSpace: "pre-line" }}>
            * 본 정보는 참고용입니다. 증상이 지속되면 반드시 수의사 상담을 권장합니다.{"\n"}
            * DMB(Dry Matter Basis) : 수분을 제거한 상태의 영양소 비율
          </Text>
        </>
      )}

      {!detail?.loading && !detail?.error && !dto && <Empty description="상세 데이터가 없습니다." />}
    </Modal>
  );
}
