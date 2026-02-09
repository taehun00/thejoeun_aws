import { Table, Tag } from "antd";
import { useRouter } from "next/router";

const ReportListPage = ({ reports, loading }) => {
  const router = useRouter();

  const columns = [
    {
      title: "ID",
      dataIndex: "reportId",
      key: "reportId",
    },
    {
      title: "타입",
      dataIndex: "targetType",
      key: "targetType",
    },
    {
      title: "대상 ID",
      dataIndex: "targetId",
      key: "targetId",
    },
    {
      title: "신고자 ID",
      dataIndex: "reporterUserId",
      key: "reporterUserId",
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "PENDING"
            ? "orange"
            : status === "RESOLVED"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "등록일",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  return (
    <Table
      rowKey="reportId"
      columns={columns}
      dataSource={reports}
      loading={loading}
      onRow={(record) => ({
        onClick: () => {
          router.push({
            pathname: `/admin/reports/${record.reportId}`,
            query: {
              data: JSON.stringify(record),
            },
          });
        },
      })}
    />
  );
};

export default ReportListPage;
