// components/support/FaqForm.js
import { Button, Form, Input, Select, Space } from "antd";

const { TextArea } = Input;

/**
 * FAQ 등록/수정 공용 폼
 *
 * props
 * - mode: "write" | "edit"
 * - categories: string[]
 * - initialValues?: { faqid?, category?, question?, answer?, keywords? }
 * - loading?: boolean
 * - onSubmit: (values)=>void
 * - onCancel?: ()=>void
 */
export default function FaqForm({
  mode = "write",
  categories = [],
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        category: "",
        question: "",
        answer: "",
        keywords: "",
        ...(initialValues || {}),
      }}
      onFinish={(values) => {
        onSubmit?.(values);
      }}
    >
      {/* 질문 + 분류 + 버튼 */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Form.Item
          label="질문"
          name="question"
          style={{ flex: 1, marginBottom: 12 }}
          rules={[{ required: true, message: "질문을 입력해주세요" }]}
        >
          <Input placeholder="질문을 입력해주세요" />
        </Form.Item>

        <Form.Item
          label="분류"
          name="category"
          style={{ width: 160, marginBottom: 12 }}
          rules={[{ required: true, message: "분류를 선택해주세요" }]}
        >
          <Select placeholder="--분류--" allowClear>
            {categories.map((c) => (
              <Select.Option key={c} value={c}>
                {c}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ marginBottom: 12 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "edit" ? "수정" : "글쓰기"}
            </Button>
            {onCancel ? (
              <Button onClick={onCancel} disabled={loading}>
                취소
              </Button>
            ) : null}
          </Space>
        </div>
      </div>

      {/* 답변 */}
      <Form.Item
        label="답변"
        name="answer"
        rules={[{ required: true, message: "답변을 입력해주세요" }]}
      >
        <TextArea
          placeholder="답변을 입력해주세요"
          autoSize={{ minRows: 6, maxRows: 14 }}
        />
      </Form.Item>

      {/* 키워드 */}
      <Form.Item label="키워드" name="keywords">
        <Input placeholder="키워드를 입력해주세요" />
      </Form.Item>
    </Form>
  );
}
