// components/reviewboard/ReviewModal.js
import { Modal, List, Rate, Typography, Spin, Alert, Empty } from "antd";

const { Text } = Typography;

export default function ReviewModal({ open, loading, error, list, onClose }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      title="리뷰"
    >
      {loading && (
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin />
        </div>
      )}

      {!loading && error && (
        <Alert
          type="error"
          showIcon
          message="리뷰 목록을 불러오지 못했습니다"
          description={String(error)}
        />
      )}

      {!loading && !error && (!list || list.length === 0) && (
        <Empty description="리뷰가 없습니다." />
      )}

      {!loading && !error && list && list.length > 0 && (
        <List
          dataSource={list}
          renderItem={(r) => (
            <List.Item key={r.reviewid}>
              <List.Item.Meta
                title={
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Text strong>{r.title}</Text>
                    <Rate disabled allowHalf value={Number(r.rating || 0)} />
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 6 }}>
                      <Text type="secondary">{r.nickname || "익명"}</Text>
                      <Text type="secondary"> · {r.createdat}</Text>
                    </div>
                    <div>{r.reviewcomment}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
}
