// components/petdisease/PetdiseaseEditModal.js
import { useEffect } from "react";
import { Modal, Form, Space, Tag, Typography } from "antd";
import PetdiseaseForm from "./PetdiseaseForm";

const { Text } = Typography;

export default function PetdiseaseEditModal({
  open,
  onClose,
  onSubmit,

  pettypeid, // 현재 선택된 pettypeid
  dto,       // 수정 대상 상세 dto (PetdiseaseResponseDto)
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    // dto 기반 초기값 세팅
    form.setFieldsValue({
      disname: dto?.disname || "",
      definition: dto?.definition || "",
      cause: dto?.cause || "",
      symptom: dto?.symptom || "",
      treatment: dto?.treatment || "",
      tip: dto?.tip || "",
    });
  }, [open, dto, form]);

  const pettypeLabel =
    pettypeid === 1 ? "고양이" : pettypeid === 2 ? "강아지" : "반려동물";

  const handleOk = async () => {
    const values = await form.validateFields();

    onSubmit?.({
      disno: dto?.disno,
      dto: values,
    });
  };

  return (
    <Modal
      title={
        <Space>
          <Text strong>질환정보 수정</Text>
          <Tag color="blue">{pettypeLabel}</Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="저장"
      cancelText="취소"
      destroyOnClose
    >
      <PetdiseaseForm form={form} />
    </Modal>
  );
}
