// components/MainPage.js
import React from "react";
import Link from "next/link";
import { Row, Col, Card, Button, Typography, Space } from "antd";
import {
  SearchOutlined,
  StarOutlined,
  HeartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CustomerServiceOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function MainPage({
  reviewList = [],
  smartList = [],
  diseaseList = [],
  adList = [],
  loading,
  error,
}) {
  const menuCards = [
    { title: "사료찾기", desc: "조건 기반 필터로 우리 아이에게 맞는 사료를 탐색합니다.", href: "/petfoodsearch", icon: <SearchOutlined style={{ fontSize: 26 }} /> },
    { title: "사료리뷰", desc: "실사용자 리뷰로 사료 선택의 실패 확률을 줄입니다.", href: "/reviewboard", icon: <StarOutlined style={{ fontSize: 26 }} /> },
    { title: "질환정보", desc: "주요 질환 정보와 관리 포인트를 한눈에 확인합니다.", href: "/petdisease", icon: <HeartOutlined style={{ fontSize: 26 }} /> },
    { title: "운동챌린지", desc: "건강한 습관을 만들기 위한 운동 챌린지 기능입니다.", href: "/exec", icon: <TrophyOutlined style={{ fontSize: 26 }} /> },
    { title: "체험단", desc: "체험단 참여/모집 정보를 확인하고 지원할 수 있습니다.", href: "/tester", icon: <GiftOutlined style={{ fontSize: 26 }} /> },
    { title: "고객센터", desc: "FAQ 및 문의 기능을 통해 빠르게 도움을 받을 수 있습니다.", href: "/faq", icon: <CustomerServiceOutlined style={{ fontSize: 26 }} /> },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";

  return (
    <div style={{ padding: "0" }}> {/* ✅ 불필요한 여백 제거 */}
      {/* ✅ Row에 justify="center" 추가 → Col을 중앙 배치 */}
      <Row gutter={[16, 16]} justify="center">
        {/* ✅ Col 폭을 줄여서 중앙에 위치 */}
        <Col xs={24} md={22} lg={20}>
          <Card title="🐾 Petfood & Health" bordered={false}>
            {/* ✅ 내부 내용은 그대로 유지 */}
            <Title level={3}>
              반려동물의 기호와 건강을 세심히 고려해
              <br />
              우리 아이에게 꼭 맞는 사료를 고를 수 있도록
              <br />
              보호자의 고민을 덜어주는 플랫폼입니다.
            </Title>
            <Paragraph>
              <Text type="secondary">
                반려동물은 말을 하지 않지만 작은 몸짓으로 자신에게 필요한 것을 전합니다.
                우리는 그 신호를 더 정확히 이해하고, 복잡한 정보 속에서도 보호자가 흔들리지 않도록
                사료·건강 데이터를 보기 쉽게 정리해 선택을 돕고자 합니다.
              </Text>
            </Paragraph>

            {/* 메뉴 카드 */}
            <Row gutter={[12, 12]}>
              {menuCards.map((m) => (
                <Col key={m.href} xs={24} sm={12} lg={8}>
                  <Card hoverable style={{ borderRadius: 12 }}>
                    <Space>
                      {m.icon}
                      <Title level={5} style={{ margin: 0 }}>
                        {m.title}
                      </Title>
                    </Space>
                    <Text type="secondary">{m.desc}</Text>
                    <div style={{ marginTop: 12 }}>
                      <Link href={m.href} legacyBehavior>
                        <a>
                          <Button type="primary" block icon={<RightOutlined />}>
                            바로가기
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
