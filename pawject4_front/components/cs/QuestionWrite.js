// pages/cs/QuestionWrite.js
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Form, Input, Select, Space, Spin, message } from "antd";

import BoardCard from "../../components/common/BoardCard";
import {
  fetchCategoriesRequest,
  writeQuestionRequest,
} from "../../reducers/support/csReducer";

const { TextArea } = Input;
const { Option } = Select;

export default function CsWritePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    categories,
    categoriesLoading,
    writeLoading,
  } = useSelector((state) => state.cs);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
  }, [dispatch]);

  const categoryOptions = useMemo(() => {
    return (categories || []).map((c) => ({ label: c, value: c }));
  }, [categories]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      dispatch(
        writeQuestionRequest({
          category: values.category,
          title: values.title,
          content: values.content,
        })
      );

      message.success("문의가 등록되었습니다.");

      //작성 후 내 질문 보기 이동
      router.push("/cs/myQuestion");
    } catch (e) {
      // validation 실패는 조용히 무시
    }
  };

  return (
    <BoardCard
      title="1:1 문의 작성"
      extra={
        <Space>
          <Button onClick={() => router.push("/cs/myQuestion")}>내질문보기</Button>
        </Space>
      }
    >
      <Spin spinning={categoriesLoading || writeLoading}>
        <Form layout="vertical" form={form}>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item
              label="제목"
              name="title"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "제목을 입력해 주세요." }]}
            >
              <Input placeholder="제목을 입력해주세요" />
            </Form.Item>

            <Form.Item
              label="분류"
              name="category"
              style={{ width: 200 }}
              rules={[{ required: true, message: "분류를 선택해 주세요." }]}
            >
              <Select placeholder="--분류--">
                {categoryOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="내용"
            name="content"
            rules={[{ required: true, message: "내용을 입력해 주세요." }]}
          >
            <TextArea rows={10} placeholder="내용을 입력해 주세요" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button type="primary" onClick={onSubmit} loading={writeLoading}>
              작성완료
            </Button>
          </div>
        </Form>
      </Spin>
    </BoardCard>
  );
}
