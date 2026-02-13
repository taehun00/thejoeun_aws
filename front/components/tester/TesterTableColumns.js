// components/tester/TesterTableColumns.js
import { Button, Space, Tag, Typography } from "antd";

const { Text } = Typography;

// 카테고리
function categoryToTag(category) {
  if (category === "공지") return <Tag color="gold">공지</Tag>;
  if (category === "모집중") return <Tag color="green">모집중</Tag>;
  if (category === "모집완료") return <Tag color="default">모집완료</Tag>;
    if (category === "후기") return <Tag color="default">후기</Tag>;
  return <Tag>{category || "-"}</Tag>;
}

export default function TesterTableColumns({
  total = 0,
  pageNo = 1,
  pageSize = 20, 

  onOpenDetail, 
  testerLikes = {}, // <- 좋아요 개수 props
}) {
  return [
    // NO
    {
      title: "NO",
      key: "no",
      width: 70,
      align: "center",
      render: (_, __, idx) => total - ((pageNo - 1) * pageSize + idx),
    },

    // 카테고리
    {
      title: "분류",
      dataIndex: "category",
      key: "category",
      width: 110,
      align: "center",
      render: (_, record) => {
        return categoryToTag(record?.category);
      },
    },

    // 제목
    {
    title: "제목",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
    render: (v, record) => (
        <Button
        type="link"
        style={{ padding: 0, fontWeight: 700 }}
        onClick={() => onOpenDetail?.(record?.testerid)}
        >
        {v || "(제목 없음)"}
        </Button>
    ),
    },
        // 좋아요 수 컬럼 추가
    {
      title: "❤️ 좋아요",
      key: "likes",
      width: 90,
      align: "center",
      render: (_, record) => {
        // testerLikes[record.testerid]가 있으면 표시, 없으면 0
        return testerLikes?.[record.testerid] ?? 0;
      },
    },
    // 작성자
    {
      title: "작성자",
      dataIndex: "nickname",
      key: "nickname",
      width: 140,
      align: "center",
      render: (v) => <Text>{v || "-"}</Text>,
    },

    // 조회수
    {
      title: "조회수",
      dataIndex: "views",
      key: "views",
      width: 90,
      align: "center",
      render: (v) => v ?? 0,
    },

    // 등록/수정 한 탭에
    {
      title: "등록/수정",
      key: "date",
      width: 170,
      align: "center",
      render: (_, record) => (
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 12, color: "#888" }}>
            {record?.createdat ? record.createdat.slice(0, 10) : "-"}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {record?.updatedat ? record.updatedat.slice(0, 10) : "-"}
          </div>
        </div>
      ),
    },
  ];
}
