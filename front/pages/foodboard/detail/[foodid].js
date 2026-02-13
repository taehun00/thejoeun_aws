// pages/foodboard/detail/[foodid].js
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { Button, Card, Descriptions, Divider, Image, Spin, Table, Typography, message } from "antd";

import BoardCard from "../../../components/common/BoardCard";

import {
  fetchFoodDetailRequest,
  deleteFoodRequest,
} from "../../../reducers/food/foodReducer";

const { Title, Text } = Typography;

export default function FoodDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { foodid } = router.query;

  const { detail, loading, error, deleteLoading, deleteSuccess, deleteError } =
    useSelector((state) => state.food);

  const fdto = detail?.fdto;
  const nutrientList = detail?.nutrientList || [];

  // 상세 조회
  useEffect(() => {
    if (!foodid) return;
    dispatch(fetchFoodDetailRequest({ foodid: Number(foodid) }));
  }, [foodid]);

  // 삭제 성공 처리
  useEffect(() => {
    if (deleteSuccess) {
      message.success("삭제 완료");
      router.push("/foodboard");
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (deleteError) message.error(deleteError);
  }, [deleteError]);

  // 영양성분 테이블 컬럼
  const columns = useMemo(
    () => [
      {
        title: "영양소",
        dataIndex: "nutrientname",
        key: "nutrientname",
        align: "center",
      },
      {
        title: "양",
        dataIndex: "amount",
        key: "amount",
        align: "center",
      },
      {
        title: "단위",
        dataIndex: "unit",
        key: "unit",
        align: "center",
      },
    ],
    []
  );

  const pettypeLabel =
    fdto?.pettypeid === 1 ? "고양이" : fdto?.pettypeid === 2 ? "강아지" : "기타";

  // 이미지 경로
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";

const getFoodImageUrl = (fdto) => {
  if (!fdto) return null;

  if (fdto.foodimg) {
    const imgPath = fdto.foodimg.includes("/")
      ? fdto.foodimg
      : `foodimg/${fdto.foodimg}`;

    return `${API_URL}/uploads/${imgPath}`;
  }

  if (fdto.brandid) return `/foodimg/brand0${fdto.brandid}.png`;
  return `/foodimg/default.png`;
};
const imageSrc = getFoodImageUrl(fdto);


  const onDelete = () => {
    if (!fdto?.foodid) return;

    const ok = confirm("정말로 삭제하시겠습니까?");
    if (!ok) return;

    dispatch(deleteFoodRequest({ foodid: fdto.foodid }));
  };


  if (loading && !detail) return <Spin tip="불러오는 중..." />;
  if (error) return <Text type="danger">{error}</Text>;
  if (!fdto) return null;
//////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <BoardCard
      title="사료 상세 정보"
      extra={
        <>
          <Button onClick={() => router.push("/foodboard")} style={{ marginRight: 8 }}>
            목록
          </Button>

          <Button
            type="primary"
            onClick={() => router.push(`/foodboard/edit/${fdto.foodid}`)}
            style={{ marginRight: 8 }}
          >
            수정
          </Button>

          <Button danger loading={deleteLoading} onClick={onDelete}>
            삭제
          </Button>
        </>
      }
    >
      <Card bordered style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {/* 좌측 이미지 */}
          <div style={{ width: 220, flexShrink: 0, textAlign: "center" }}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="사료 이미지"
                width={220}
                style={{ borderRadius: 12 }}
              />
            ) : (
              <div
                style={{
                  width: 220,
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  background: "#fafafa",
                }}
              >
                이미지 없음
              </div>
            )}
          </div>

          {/* 우측 정보 */}
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ marginBottom: 4 }}>
              {fdto.foodname}
            </Title>
            <Text type="secondary">{fdto.brandname}</Text>

            <Divider style={{ margin: "12px 0" }} />

            <Descriptions bordered size="small" column={3}>
              <Descriptions.Item label="종">{pettypeLabel}</Descriptions.Item>
              <Descriptions.Item label="사료 타입">{fdto.foodtype}</Descriptions.Item>
              <Descriptions.Item label="연령">{fdto.petagegroup}</Descriptions.Item>

              <Descriptions.Item label="그레인프리">{fdto.isgrainfree}</Descriptions.Item>
              <Descriptions.Item label="분류">{fdto.category}</Descriptions.Item>
              <Descriptions.Item label="칼로리">{fdto.calorie}</Descriptions.Item>

              <Descriptions.Item label="주재료">{fdto.mainingredient}</Descriptions.Item>
              <Descriptions.Item label="부재료">{fdto.subingredient}</Descriptions.Item>
                            
            </Descriptions>
          </div>
        </div>

        <Divider />

        {/* <Title level={5} style={{ marginBottom: 8 }}>
          사료 설명
        </Title> */}
        <div
          style={{
            whiteSpace: "pre-wrap",
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 12,
            background: "#fafafa",
          }}
        >
          {fdto.description}
        </div>
      </Card>

      {/* 영양성분 */}
      <Card>
        <Title level={5} style={{ marginBottom: 12 }}>
          영양성분 정보
        </Title>

        <Table
          rowKey={(row, idx) => idx}
          columns={columns}
          dataSource={nutrientList}
          pagination={false}
          size="small"
        />
      </Card>
    </BoardCard>
  );
}
