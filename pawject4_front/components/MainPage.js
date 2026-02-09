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

import BoardCard from "../components/common/BoardCard";

const { Title, Text, Paragraph } = Typography;

export default function MainPage() {
  const menuCards = [
    {
      title: "사료찾기",
      desc: "조건 기반 필터로 우리 아이에게 맞는 사료를 탐색합니다.",
      href: "/petfoodsearch",
      icon: <SearchOutlined style={{ fontSize: 26 }} />,
    },
    {
      title: "사료리뷰",
      desc: "실사용자 리뷰로 사료 선택의 실패 확률을 줄입니다.",
      href: "/reviewboard",
      icon: <StarOutlined style={{ fontSize: 26 }} />,
    },
    {
      title: "질환정보",
      desc: "주요 질환 정보와 관리 포인트를 한눈에 확인합니다.",
      href: "/petdisease",
      icon: <HeartOutlined style={{ fontSize: 26 }} />,
    },
    {
      title: "운동챌린지",
      desc: "건강한 습관을 만들기 위한 운동 챌린지 기능입니다.",
      href: "/exec",
      icon: <TrophyOutlined style={{ fontSize: 26 }} />,
    },
    {
      title: "체험단",
      desc: "체험단 참여/모집 정보를 확인하고 지원할 수 있습니다.",
      href: "/tester",
      icon: <GiftOutlined style={{ fontSize: 26 }} />,
    },
    {
      title: "고객센터",
      desc: "FAQ 및 문의 기능을 통해 빠르게 도움을 받을 수 있습니다.",
      href: "/faq",
      icon: <CustomerServiceOutlined style={{ fontSize: 26 }} />,
    },
  ];

  return (
    <BoardCard title="🐾 Petfood & Health">
      {/* 소개 문구 */}
      <div style={{ padding: "6px 4px 18px" }}>
        <Title level={3} style={{ marginBottom: 6 }}>
          반려동물의 기호와 건강을 세심히 고려해
          <br />
          우리 아이에게 꼭 맞는 사료를 고를 수 있도록
          <br />
          보호자의 고민을 덜어주는 플랫폼입니다.
        </Title>

        <Paragraph style={{ marginTop: 12, marginBottom: 0, maxWidth: 900 }}>
          <Text type="secondary">
            반려동물은 말을 하지 않지만 작은 몸짓으로 자신에게 필요한 것을 전합니다.
            우리는 그 신호를 더 정확히 이해하고, 복잡한 정보 속에서도 보호자가 흔들리지 않도록
            사료·건강 데이터를 보기 쉽게 정리해 선택을 돕고자 합니다.
          </Text>
        </Paragraph>
      </div>

      {/* 메뉴 카드 6개 */}
      <Row gutter={[16, 16]}>
        {menuCards.map((m) => (
          <Col key={m.href} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                height: "100%",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: "column",
                height: "100%",     
                minHeight: 190,     
                gap: 10,
              }}
            >
              <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                <Space>
                  {m.icon}
                  <Title level={5} style={{ margin: 0 }}>
                    {m.title}
                  </Title>
                </Space>
              </Space>

              <Text type="secondary" style={{ lineHeight: 1.6 }}>
                {m.desc}
              </Text>

              <div style={{ marginTop: "auto"}}>
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
    </BoardCard>
  );
}