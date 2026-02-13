// components/petdisease/PetdiseaseWriteModal.js
import { useEffect } from "react";
import { Modal, Form, Space, Tag, Typography } from "antd";
import PetdiseaseForm from "./PetdiseaseForm";

const { Text } = Typography;

export default function PetdiseaseWriteModal({
  open,
  onClose,
  onSubmit,

  pettypeid, // 현재 선택된 pettypeid
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const pettypeLabel =
    pettypeid === 1 ? "고양이" : pettypeid === 2 ? "강아지" : "반려동물";

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit?.(values);
  };

  return (
    <Modal
      title={
        <Space>
          <Text strong>질환정보 등록</Text>
          <Tag color="blue">{pettypeLabel}</Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="등록"
      cancelText="취소"
      destroyOnClose
    >
      <PetdiseaseForm form={form} />
    </Modal>
  );
}
