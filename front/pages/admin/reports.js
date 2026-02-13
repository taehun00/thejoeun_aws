import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/router";
import { Card, Space, Select, Pagination, Spin } from "antd";
import { parseJwt } from "../../utils/jwt";
import BoardCard from "../../components/common/BoardCard";
import BoardToggleTable from "../../components/common/BoardToggleTable";

import AdminReportHandleModal from "../../components/admin/AdminReportHandleModal";
import { fetchReportsRequest } from "../../reducers/admin/reportReducer";

const { Option } = Select;

export default function AdminReportPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loginRole, setLoginRole] = useState(null);
  const [type, setType] = useState(null); // 전체, REVIEW, TESTER
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  // 관리자 권한 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;
    setLoginRole(payload?.role ?? null);
  }, []);

  const canAdmin = loginRole === "ROLE_ADMIN";

  useEffect(() => {
    if (loginRole === null) return;
    if (!canAdmin) router.replace("/user/login");
  }, [loginRole, canAdmin, router]);

    const { reports = [], page = 0, size = 10, totalElements = 0, loading = false } =
    useSelector((state) => state.adminReport ?? {}, shallowEqual);

// 1️⃣ Redux reports 상태 확인
console.log("reports from Redux:", reports);

  // 초기 조회
  useEffect(() => {
    if (!canAdmin) return;
    dispatch(fetchReportsRequest({ type, page: 0, size }));
  }, [dispatch, canAdmin, type, size]);

  const handleTypeChange = (value) => {
    setType(value === "ALL" ? null : value);
  };

  const handlePageChange = (p) => {
    const pageNumber = p ? p - 1 : 0;
    dispatch(fetchReportsRequest({ type, page: pageNumber, size }));
  };

const columns = [
  { title: "ID", dataIndex: "reportId", key: "reportId" },
  { title: "타입", dataIndex: "targetType", key: "targetType" },
  { title: "대상 ID", dataIndex: "targetId", key: "targetId" },
  { title: "신고자 ID", dataIndex: "reporterUserId", key: "reporterUserId" },
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      if (status === "PENDING") return "대기";
      if (status === "RESOLVED") return "처리완료";
      if (status === "REJECTED") return "거절";
      return status;
    },
  },
  {
    title: "등록일",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => date?.replace("T", " ").slice(0, 19),
  },
  {
    title: "내용",
    dataIndex: "details",
    key: "details",
    render: (_, record) => (
      <a onClick={() => router.push(`/admin/reports/${record.reportId}`)}>
        상세보기
      </a>
    ),
  },
];

  if (!canAdmin) return null;

  return (
    <BoardCard title="관리자 신고 관리" extra={<Space></Space>}>
      <Card bordered={false}>
        <Space style={{ marginBottom: 16 }}>
          <Select value={type ?? "ALL"} onChange={handleTypeChange} style={{ width: 120 }}>
            <Option value="ALL">전체</Option>
            <Option value="REVIEW">리뷰</Option>
            <Option value="TESTER">체험단</Option>
          </Select>
        </Space>

        <Spin spinning={loading}>
          <BoardToggleTable
            rowKey="reportId"
            columns={columns}
            dataSource={reports}
            loading={loading}
            pageNo={page}
            total={totalElements}
            pageSize={size}
            onChangePage={handlePageChange}
          />
        </Spin>
      </Card>

      <AdminReportHandleModal
        open={modalOpen}
        reportId={selectedReportId}
        onClose={() => setModalOpen(false)}
      />
    </BoardCard>
  );
}
