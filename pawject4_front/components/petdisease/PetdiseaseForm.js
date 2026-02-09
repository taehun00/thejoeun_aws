// components/petdisease/PetdiseaseForm.js
import { Form, Input } from "antd";

const { TextArea } = Input;

export default function PetdiseaseForm({ form }) {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="질환명"
        name="disname"
        rules={[{ required: true, message: "질환명을 입력하세요." }]}
      >
        <Input maxLength={100} />
      </Form.Item>

      <Form.Item
        label="정의"
        name="definition"
        rules={[{ required: true, message: "정의를 입력하세요." }]}
      >
        <TextArea
          rows={3}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item
        label="원인"
        name="cause"
        rules={[{ required: true, message: "원인을 입력하세요." }]}
      >
        <TextArea
          rows={3}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item
        label="증상"
        name="symptom"
        rules={[{ required: true, message: "증상을 입력하세요." }]}
      >
        <TextArea
          rows={3}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item
        label="관리/치료"
        name="treatment"
        rules={[{ required: true, message: "관리/치료 내용을 입력하세요." }]}
      >
        <TextArea
          rows={3}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item
        label="영양 팁"
        name="tip"
        rules={[{ required: false, message: "영양 팁을 입력하세요." }]}
      >
        <TextArea
          rows={2}
          maxLength={500}
          showCount
        />
      </Form.Item>
    </Form>
  );
}
