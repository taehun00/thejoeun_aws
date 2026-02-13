import { Card, Descriptions, Tag, Button, Select, Input, message, Modal } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const { Option } = Select;
const { TextArea } = Input;

const ReportDetailPage = () => {
  const router = useRouter();
  const { reportId } = router.query;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [action, setAction] = useState(null);
  const [note, setNote] = useState("");

/* ===============================
     1️⃣ 신고 상세 조회 API
     =============================== */
  useEffect(() => {
    if (!reportId) return; // Next.js 특성상 최초엔 undefined

    const fetchReport = async () => {
      try {
        const res = await api.get(`/api/admin/reports/${reportId}`);
        setReport(res.data);
        setStatus(res.data.status); // 초기 상태 세팅
      } catch (e) {
        message.error("신고 정보를 불러오지 못했습니다.");
        router.push("/admin/reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  /* ===============================
     2️⃣ 처리 API 호출
     =============================== */
  const submitApi = async () => {
    try {
      await api.post(`/api/admin/reports/${report.reportId}/handle`, {
        status,
        action,
        note,
      });

      message.success("처리 완료");
      router.push("/admin/reports");
    } catch (e) {
      message.error("처리 실패");
    }
  };

  /* ===============================
     3️⃣ 처리 버튼 클릭
     =============================== */
  const handleSubmit = () => {
    if (!action) {
      message.warning("처리 방식을 선택하세요");
      return;
    }

    // DELETE는 위험하므로 confirm
    if (action === "DELETE") {
      Modal.confirm({
        title: "신고를 삭제하시겠습니까?",
        content: "삭제된 신고는 복구할 수 없습니다.",
        okText: "삭제",
        okType: "danger",
        cancelText: "취소",
        onOk: submitApi,
      });
    } else {
      submitApi();
    }
  };

  /* ===============================
     4️⃣ 로딩 / 예외 처리
     =============================== */
  if (loading) return <Card loading />;
  if (!report) return null;

  /* ===============================
     5️⃣ 렌더링
     =============================== */
  return (
    <Card title={`신고 상세 #${report.reportId}`}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="신고 ID">
          {report.reportId}
        </Descriptions.Item>

        <Descriptions.Item label="타입">
          {report.targetType}
        </Descriptions.Item>

        <Descriptions.Item label="대상 ID">
          {report.targetId}
        </Descriptions.Item>

        <Descriptions.Item label="신고자 ID">
          {report.reporterUserId}
        </Descriptions.Item>

        <Descriptions.Item label="사유">
          {report.reason}
        </Descriptions.Item>

        <Descriptions.Item label="상태">
          <Tag
            color={
              report.status === "PENDING"
                ? "orange"
                : report.status === "RESOLVED"
                ? "green"
                : "red"
            }
          >
            {report.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="등록일">
          {report.createdAt}
        </Descriptions.Item>

        <Descriptions.Item label="내용">
          {report.details}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= 관리자 처리 ================= */}
      <Card style={{ marginTop: 20 }} title="관리자 처리">
        <Select
          value={status}
          style={{ width: 200, marginBottom: 10 }}
          onChange={setStatus}
        >
          <Option value="PENDING">PENDING</Option>
          <Option value="RESOLVED">RESOLVED</Option>
          <Option value="REJECTED">REJECTED</Option>
        </Select>

        <br />

        <Select
          placeholder="처리 방식 선택"
          style={{ width: 200, marginBottom: 10 }}
          onChange={setAction}
        >
          <Option value="DELETE">DELETE</Option>
          <Option value="IGNORE">IGNORE</Option>
        </Select>

        <TextArea
          rows={3}
          placeholder="관리자 메모"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <br />
        <br />

        <Button type="primary" onClick={handleSubmit}>
          처리 완료
        </Button>
      </Card>
    </Card>
  );
};

export default ReportDetailPage;