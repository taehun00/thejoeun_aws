import { Modal, Form, Input, Select, Button, message } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleReportRequest } from "../../reducers/admin/reportReducer";

const { Option } = Select;

export default function AdminReportHandleModal({ open, reportId, onClose }) {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state.adminReport?.loading ?? false,
    shallowEqual
    );

  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (!reportId) {
      message.error("신고 ID가 없습니다.");
      return;
    }
    dispatch(handleReportRequest({ reportId, ...values }));
    onClose();
  };

  return (
    <Modal
      open={open}
      title="신고 처리"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="status" label="상태" rules={[{ required: true }]}>
          <Select placeholder="상태 선택">
            <Option value="RESOLVED">처리 완료</Option>
            <Option value="PENDING">보류</Option>
          </Select>
        </Form.Item>

        <Form.Item name="action" label="액션" rules={[{ required: true }]}>
          <Select placeholder="액션 선택">
            <Option value="DELETE">삭제</Option>
            <Option value="IGNORE">무시</Option>
          </Select>
        </Form.Item>

        <Form.Item name="note" label="메모">
          <Input.TextArea placeholder="메모를 입력하세요" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            제출
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
