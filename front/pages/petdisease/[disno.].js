// pages/petdisease/[disno].js
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  Spin,
  Alert,
  Card,
  Typography,
  Divider,
  Tag,
  Button,
  Space,
} from "antd";

import {
  fetchPetdiseaseDetailRequest,
  closeDetail,
} from "../../reducers/petdisease/petdiseaseReducer";

const { Title, Text, Paragraph } = Typography;

function SectionCard({ title, children }) {
  return (
    <Card
      style={{
        borderRadius: 18,
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
      bodyStyle={{ padding: 22 }}
    >
      <Title level={5} style={{ margin: 0, marginBottom: 12 }}>
        {title}
      </Title>
      <div style={{ fontSize: 14, lineHeight: 1.8 }}>{children}</div>
    </Card>
  );
}

export default function PetdiseaseDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { disno } = router.query;

  const detail = useSelector((state) => state.petdisease.detail);
  const dto = detail?.dto;

  const petTypeLabel = useMemo(() => {
    const pid = dto?.pettypeid;
    if (pid === 1) return "고양이";
    if (pid === 2) return "강아지";
    return "펫";
  }, [dto?.pettypeid]);

  useEffect(() => {
    if (!disno) return;

    dispatch(fetchPetdiseaseDetailRequest({ disno }));

    return () => {
      // 상세 페이지 이탈 시 detail state 정리(옵션)
      dispatch(closeDetail());
    };
  }, [dispatch, disno]);

  const goBack = () => {
    router.push("/petdisease");
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      {/* 상단 네비 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Button onClick={goBack}>← 목록으로</Button>

        {/* (관리자용 수정/삭제 버튼 붙일 자리)*/}
      </div>

      {/* 로딩 */}
      {detail?.loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "70px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {/* 에러 */}
      {!detail?.loading && detail?.error && (
        <Alert
          type="error"
          showIcon
          message="상세 정보 조회 실패"
          description={typeof detail.error === "string" ? detail.error : JSON.stringify(detail.error)}
        />
      )}

      {/* 본문 */}
      {!detail?.loading && !detail?.error && dto && (
        <>
          {/* 메인 헤더 카드 */}
          <Card
            style={{
              borderRadius: 22,
              marginBottom: 22,
              background: "#ffffff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
            }}
            bodyStyle={{ padding: 26 }}
          >
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <Title level={3} style={{ margin: 0 }}>
                  {dto.disname}
                </Title>

                <Tag style={{ fontSize: 13, padding: "5px 10px", borderRadius: 12 }}>
                  {petTypeLabel}
                </Tag>
              </div>

              <Text type="secondary">
                질환 정보 카드 상세
              </Text>

              <Divider style={{ margin: "14px 0" }} />

              {/* 한줄 요약: definition 앞부분 */}
              {dto.definition && (
                <Paragraph style={{ margin: 0, fontSize: 15, lineHeight: 1.9 }}>
                  {dto.definition}
                </Paragraph>
              )}
            </Space>
          </Card>

          {/*  섹션 카드들 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
            <SectionCard title="원인">
              {dto.cause ? dto.cause : <Text type="secondary">등록된 원인 정보가 없습니다.</Text>}
            </SectionCard>

            <SectionCard title="증상">
              {dto.symptom ? dto.symptom : <Text type="secondary">등록된 증상 정보가 없습니다.</Text>}
            </SectionCard>

            <SectionCard title="치료 / 관리">
              {dto.treatment ? dto.treatment : <Text type="secondary">등록된 치료 정보가 없습니다.</Text>}
            </SectionCard>

            <SectionCard title="추가 팁">
            {dto.tip? <Text>{dto.tip}이 권장될 수 있어요</Text> : <Text type="secondary">등록된 팁 정보가 없습니다.</Text>}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
