import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Form, Input, Button, Upload, DatePicker, Select, message, Spin } from "antd";
import dayjs from "dayjs";

export default function PetEditPage() {
  const router = useRouter();
  const { petId } = router.query;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!petId) return; // ⭐ 핵심

    const fetchPet = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/pets/${petId}`);
        const pet = res.data;

        // ✅ form 초기값 세팅
        form.setFieldsValue({
          petName: pet.petName,
          petBreed: pet.petBreed,
          birthDate: dayjs(pet.birthDate),
          petTypeId: pet.petTypeId,
          page: pet.page,
          pgender: pet.pgender,
        });
      } catch {
        message.error("펫 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("petName", values.petName);
      formData.append("petBreed", values.petBreed);
      formData.append("birthDate", values.birthDate.format("YYYY-MM-DD"));
      formData.append("petTypeId", values.petTypeId);
      formData.append("page", values.page);
      formData.append("pgender", values.pgender);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/api/pets/${petId}`, formData);

      message.success("수정 완료");
      router.push(`/pet?petId=${petId}`);
    } catch {
      message.error("수정 실패");
    }
  };

  if (loading) return <Spin />;

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item name="petName" label="펫 이름" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="petBreed" label="펫 종" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="birthDate" label="생일" rules={[{ required: true }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="petTypeId" label="타입" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>고양이</Select.Option>
          <Select.Option value={2}>강아지</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="page" label="나이" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item name="pgender" label="성별" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="M">수컷</Select.Option>
          <Select.Option value="W">암컷</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="이미지">
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          onChange={(info) =>
            setImageFile(info.fileList[0]?.originFileObj)
          }
        >
          <Button>이미지 변경</Button>
        </Upload>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        수정하기
      </Button>
    </Form>
  );
}
