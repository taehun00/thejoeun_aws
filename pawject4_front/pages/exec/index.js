import React from "react";
import { Card, Result, Button, Space, Typography } from "antd";
import { ToolOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { Text } = Typography;

export default function ExecPreparingPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Card>
        <Result
          icon={<ToolOutlined />}
          title="운동챌린지 기능은 준비 중입니다"
          subTitle={
            <Text type="secondary">
              현재 기능 개선 및 개편 작업 중입니다. 빠른 시일 내에 오픈하겠습니다.
            </Text>
          }
          extra={
            <Space>
              <Button onClick={() => router.back()}>이전으로</Button>
              <Button type="primary" icon={<HomeOutlined />} onClick={() => router.push("/mainpage")}>
                홈으로
              </Button>
            </Space>
          }
        />
      </Card>
    </div>
  );
}