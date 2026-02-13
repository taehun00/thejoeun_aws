// components/common/BoardCard.js
//Card 공통 레이아웃
import { Card } from "antd";

export default function BoardCard({ title, extra, children }) {
  return (
    <div style={{ padding: 24 }}>
      <Card title={title} extra={extra}>
        {children}
      </Card>
    </div>
  );
}