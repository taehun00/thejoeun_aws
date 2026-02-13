// components/petfoodsearch/PetfoodSearchResultList.js
import { useMemo } from "react";
import {
  List,
  Card,
  Select,
  Rate,
  Typography,
  Button,
  Space,
  Pagination,
  Empty,
  Spin,
} from "antd";

const { Text } = Typography;
const { Option } = Select;

export default function PetfoodSearchResultList({
  list,
  total,
  paging,
  loading,

  filters,
  pstartno,

  onChangeCondition,
  onChangePage,
  onOpenModal,

  // 리뷰 모달 열기 콜백
  onOpenReviewModal,
}) {
  const data = list || [];

  //페이징 계산
  const currentPage = useMemo(() => {
    return paging?.current || paging?.pstartno || paging?.pageNo || pstartno || 1;
  }, [paging, pstartno]);

  //5개 고정
  const pageSize = 5;

  //별점 표시
  const renderRating = (avgrating) => {
    const value = Number(avgrating || 0);
    return (
      <Space size={6}>
        <Rate disabled allowHalf value={value} />
        <Text type="secondary">({value.toFixed(1)})</Text>
      </Space>
    );
  };

  //이미지 경로
  const getImgSrc = (f) => {
    if (!f) return "/foodimg/default.png";
    return f.foodimg ? `/foodimg/${f.foodimg}` : `/foodimg/brand0${f.brandid}.png`;
  };

  return (
    <Card
      size="small"
      title="검색 결과"
      extra={
        data.length > 0 ? (
          <Select
            value={filters?.condition ?? ""}
            style={{ width: 140 }}
            onChange={(v) => onChangeCondition?.(v || null)}
          >
            <Option value="">정렬</Option>
            <Option value="foodnameAsc">사료명</Option>
            <Option value="foodnameDesc">사료역순</Option>
            <Option value="brandnameAsc">브랜드명</Option>
            <Option value="brandnameDesc">브랜드역순</Option>
            <Option value="avgratingDesc">높은별점</Option>
            <Option value="avgratingAsc">낮은별점</Option>
          </Select>
        ) : null
      }
    >
      {loading && (
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin />
        </div>
      )}

      {!loading && data.length === 0 && <Empty description="검색 결과가 없습니다." />}

      {!loading && data.length > 0 && (
        <>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(f) => (
              <List.Item
                key={f.foodid}
                actions={[
                  <Button
                    key="modal"
                    type="primary"
                    size="small"
                    onClick={() => onOpenModal?.(f.foodid)}
                  >
                    상세보기
                  </Button>,
                  <Button
                    key="review"
                    size="small"
                    onClick={() => onOpenReviewModal?.(f.foodid)} 
                  >
                    리뷰
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      src={getImgSrc(f)}
                      alt={f.foodname}
                      style={{
                        width: 140,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                  }
                  title={
                    <Space direction="vertical" size={2}>
                      <div>{renderRating(f.avgrating)}</div>
                      <Text strong>{f.foodname}</Text>
                      <Text type="secondary">{f.brandname}</Text>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 6 }}>
                      <Text>{f.description}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          {/* paging */}
          {total > pageSize && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page) => onChangePage?.(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
