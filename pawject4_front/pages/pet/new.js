import React, { useState } from "react";
import { Form, Input, Button, Upload, DatePicker, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api/axios";
import { useRouter } from "next/router";

export default function NewPetPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("petTypeId", values.type); // 1=고양이, 2=강아지
      formData.append("petName", values.name);
      formData.append("petBreed", values.species);
      formData.append("birthDate", values.birthday.format("YYYY-MM-DD"));
      formData.append("page", values.age);
      formData.append("pgender", values.gender);
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      await api.post("/api/pets", formData);

      message.success("반려동물이 등록되었습니다!");
      router.push("/user/mypage");
    } catch (err) {
      message.error("등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: "0 auto" }}>
 
       <Form.Item name="type" label="펫 타입" rules={[{ required: true }]}>
        <Select placeholder="선택하세요">
          <Select.Option value={1}>고양이</Select.Option>
          <Select.Option value={2}>강아지</Select.Option>
        </Select>
      </Form.Item>
 
      <Form.Item name="name" label="펫 이름" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="species" label="펫 종" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="birthday" label="펫 생일" rules={[{ required: true }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="age" label="펫 나이" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item name="gender" label="펫 성별" rules={[{ required: true }]}>
        <Select placeholder="선택하세요">
          <Select.Option value="M">수컷</Select.Option>
          <Select.Option value="W">암컷</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="image"
        label="펫 이미지"
        valuePropName="fileList"   // ✅ Upload는 value 대신 fileList 사용
        getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
            return e;
            }
            return e && e.fileList;
        }}
        >
        <Upload beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
      </Form.Item>


      <Button type="primary" htmlType="submit" loading={loading}>
        등록하기
      </Button>
    </Form>
  );
}