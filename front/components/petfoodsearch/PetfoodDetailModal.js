// components/petfoodsearch/PetfoodDetailModal.js
import { Modal, Row, Col, Typography, Divider, Spin, Alert, Tag } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function PetfoodDetailModal({
  open,
  loading,
  dto,
  error,
  onClose,
}) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      title={
        dto ? (
          <div>
            <Title level={5} style={{ marginBottom: 4 }}>
              {dto.foodname}
            </Title>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text type="secondary">
                {dto.brandname} · {dto.country} · {dto.brandtype}
              </Text>
              <Tag>
                {dto.pettypeid === 1 || dto.pettypeid === "1"
                  ? "고양이 사료"
                  : "강아지 사료"}
              </Tag>
            </div>
          </div>
        ) : (
          "사료 상세"
        )
      }
    >
      {/* loading */}
      {loading && (
        <div style={{ padding: 32, textAlign: "center" }}>
          <Spin />
        </div>
      )}

      {/* error */}
      {!loading && error && (
        <Alert
          type="error"
          showIcon
          message="상세 정보를 불러오지 못했습니다"
          description={String(error)}
        />
      )}

      {/* content */}
      {!loading && !error && dto && (
        <>
          {/* 기본 정보 */}
          <Row gutter={[8, 8]} style={{ fontSize: 14 }}>
            <Col span={6}>
              <Text type="secondary">유형</Text>
            </Col>
            <Col span={18}>{dto.foodtype}</Col>

            <Col span={6}>
              <Text type="secondary">그레인프리</Text>
            </Col>
            <Col span={18}>
              {dto.isgrainfree === "Y" ? "그레인프리" : "일반"}
            </Col>

            <Col span={6}>
              <Text type="secondary">분류</Text>
            </Col>
            <Col span={18}>{dto.category}</Col>

            <Col span={6}>
              <Text type="secondary">연령</Text>
            </Col>
            <Col span={18}>{dto.petagegroup}</Col>

            <Col span={6}>
              <Text type="secondary">칼로리</Text>
            </Col>
            <Col span={18}>{dto.calorie}</Col>
          </Row>

          <Divider />

          {/* 원재료 */}
          <div style={{ marginBottom: 16 }}>
            <Text strong>원재료</Text>
            <div style={{ marginTop: 4 }}>
              <div>
                <Text type="secondary">주재료:</Text>{" "}
                <Text>{dto.mainingredient}</Text>
              </div>
              <div>
                <Text type="secondary">부재료:</Text>{" "}
                <Text>{dto.subingredient}</Text>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div style={{ marginBottom: 16 }}>
            <Text strong>제품 설명</Text>
            <Paragraph style={{ marginTop: 4 }}>
              {dto.description}
            </Paragraph>
          </div>

          {/* 영양 - 소수점 출력 조심*/}
          <div>
            <Text strong>영양 정보</Text>
        <Paragraph style={{ marginTop: 4 }}>
          {String(dto.nutriinfo ?? "").replace(/(^|[^\d])\.(\d)/g, "$10.$2")}
        </Paragraph>
          </div>
        </>
      )}
    </Modal>
  );
}
