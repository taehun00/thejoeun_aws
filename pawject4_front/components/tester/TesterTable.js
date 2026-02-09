// components/tester/TesterTable.js
import { Table, Button, Tag, Typography } from "antd";

const { Text } = Typography;

// category tag
function categoryToTag(category) {
  if (category === "공지") return <Tag color="gold">공지</Tag>;
  if (category === "모집중") return <Tag color="green">모집중</Tag>;
  if (category === "모집완료") return <Tag color="default">모집완료</Tag>;
  if (category === "후기") return <Tag color="blue">후기</Tag>;
  return <Tag>{category || "-"}</Tag>;
}

export default function TesterTable({
  list = [],
  loading = false,

  total = 0,
  pageNo = 1,
  pageSize = 20,
  onChangePage,

  onOpenDetail,
  testerLikes = {},
}) {
  const columns = [
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
      render: (_, record) => categoryToTag(record?.category),
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


    // 좋아요 수
    {
      title: "📝 추천",
      key: "likes",
      width: 90,
      align: "center",
      render: (_, record) => record.likeCount ?? 0,
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

    // 등록/수정
    //작성일 + 수정일
    {
      title: "등록일",
      key: "date",
      width: 160,
      align: "center",
      render: (_, record) => {
        const createdat = record?.createdat || "-";
        const updatedat = record?.updatedat;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
              {createdat}
            </span>

            {updatedat ? (
              <span style={{ fontSize: 11, color: "#999" }}>
                수정 {updatedat}
              </span>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="testerid"
      columns={columns}
      dataSource={list}
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 900 }}
      rowClassName={(record) => (record?.isnotice === 1 ? "tester-notice-row" : "")}
      pagination={{
        current: pageNo,
        total,
        pageSize,
        showSizeChanger: false,
        onChange: onChangePage,
        position: ["bottomCenter"],
      }}
    />
  );
}