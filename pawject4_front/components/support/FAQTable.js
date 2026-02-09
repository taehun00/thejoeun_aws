import { Table, Tag, Space, Typography, Button } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * props
 * - data: FAQ list
 * - loading
 * - isAdmin: boolean
 * - openId: number|null
 * - onToggleRow: (faqid)=>void
 * - onQuickActive: (faqid)=>void
 * - onEdit: (faqDto)=>void   // 수정은 모달로 띄우기
 */
export default function FAQTable({
  data = [],
  loading = false,

  isAdmin = false,

  openId = null,
  onToggleRow,

  onQuickActive,
  onEdit,
}) {
  const columns = [
    {
      title: "NO.",
      key: "no",
      width: 70,
      align: "center",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "분류",
      dataIndex: "category",
      key: "category",
      width: 110,
      align: "center",
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: "질문",
      dataIndex: "question",
      key: "question",
      align: "left",
      render: (v) => <Text>{v}</Text>,
    },
        // 작성일 + 수정일 (FAQ용)
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
                    수정일 {updatedat}
                </span>
                ) : null}
            </div>
            );
        },
        },

    // {
    //   title: "등록일",
    //   dataIndex: "createdat",
    //   key: "createdat",
    //   width: 140,
    //   align: "center",
    //   render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : "-"),
    // },
    // {
    //   title: "수정일",
    //   dataIndex: "updatedat",
    //   key: "updatedat",
    //   width: 140,
    //   align: "center",
    //   render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : "-"),
    // },
  ];




  if (isAdmin) {
    columns.push({
      title: "사용여부",
      key: "isactive",
      width: 140,
      align: "center",
      render: (_, record) => {
        const active = record?.isactive === 1;
        return (
          <Button
            size="small"
            type={active ? "primary" : "default"}
            danger={!active}
            onClick={(e) => {
              e.stopPropagation(); //row click 방지
              onQuickActive?.(record.faqid);
            }}
          >
            {active ? "활성화" : "비활성화"}
          </Button>
        );
      },
    });
  }

  return (
    <Table
      rowKey="faqid"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      size="middle"
      rowClassName={(record) =>
        record.faqid === openId ? "faq-row-open" : ""
      }
      onRow={(record) => {
        return {
          onClick: () => onToggleRow?.(record.faqid),
          style: { cursor: "pointer" },
        };
      }}
      expandable={{
        expandedRowKeys: openId ? [openId] : [],
        expandIcon: () => null, // 기본 expand 아이콘 제거
        expandedRowRender: (record) => (
          <div style={{ padding: "10px 10px 10px 20px" }}>
            <div style={{ textAlign: "left", lineHeight: 1.7 }}>
              <Text>{record.answer}</Text>
            </div>

            {isAdmin && (
              <div style={{ marginTop: 12 }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "right", width: "100%" }}>
                    {record.keywords ? (
                      <Button size="small" type="dashed">
                        {record.keywords}
                      </Button>
                    ) : null}
                  </div>
                </Space>

                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(record); // 수정 Modal 오픈
                    }}
                  >
                    수정
                  </Button>
                </div>
              </div>
            )}
          </div>
        ),
      }}
    />
  );
}
