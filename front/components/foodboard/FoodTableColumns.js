// components/foodboard/FoodTableColumns.js
//사료게시판 전용 테이블 구조

import { Button, Popconfirm, Tag } from "antd";

export function pettypename(pettypeid) {
  if (pettypeid === 1) return "고양이";
  if (pettypeid === 2) return "강아지";
  return "-";
}

export default function FoodTableColumns({
  total,
  pageNo,
  pageSize = 10,

  onMoveDetail,
  onQuickDelete,
  deleteLoading,

  onPetTypeFilter,  
  onBrandFilter
}) {
  return [
    {
      title: "NO",
      key: "no",
      width: 80,
      align: "center",
      render: (_, record, idx) => total - ((pageNo - 1) * pageSize + idx),
    },

    //눌러서 검색 가능하게 설정
    {
    title: "펫타입",
    dataIndex: "pettypeid",
    key: "pettypeid",
    align: "center",
    render: (pettypeid) => {
        const label = pettypeid === 1 ? "고양이" : "강아지";

        return (
        <span
            onClick={() => onPetTypeFilter(pettypeid)}
            style={{
            display: "inline-block",
            padding: "4px 10px",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            fontWeight: 700,
            color: "#111",
            userSelect: "none",
            }}
        >
            {label}
        </span>
        );
    },
    },

    {
      title: "브랜드",
      dataIndex: "brandname",
      key: "brandname",
      width: 160,
      align: "center",
      color: "#111",          
      textDecoration: "none",
          render: (brandname) => {
        const label = brandname; 
        return (
        <span
            onClick={() => onBrandFilter(brandname)}
            style={{
            cursor: "pointer",
            fontWeight: 700,
            color: "#111",
            userSelect: "none",
            }}
        >
            {label}
        </span>
        );
    },
    },

    {
      title: "사료명",
      dataIndex: "foodname",
      key: "foodname",
      align: "center", 
      render: (text, record) => (
        <Button
          type="link"
          style={{ padding: 0, fontWeight: 700 }}
          onClick={() => onMoveDetail(record.foodid)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "등록일",
      dataIndex: "createdat",
      key: "createdat",
      width: 170,
      align: "center",
    },
    {
      title: "수정일",
      dataIndex: "updatedat",
      key: "updatedat",
      width: 170,
      align: "center",
    },
    {
      title: "빠른삭제",
      key: "quickdelete",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="삭제하시겠습니까?"
          okText="삭제"
          cancelText="취소"
          onConfirm={() => onQuickDelete(record.foodid)}
        >
          <Button danger size="small" loading={deleteLoading}>
            빠른삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];
}
