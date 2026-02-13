// components/reviewboard/ReviewEditModal.js

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Form, Input, Select, Rate, Upload, Space, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fileUrl } from "../../utils/fileUrl";

const { Text } = Typography;

export default function ReviewEditModal({
  open,
  onClose,

  reviewid,
  formData,
  loading,
  editLoading,

  onFetchForm,
  onSubmitEdit,
}) {
  const [form] = Form.useForm();

  //  기존 + 신규 모두 Upload fileList로 관리
  const [uiFileList, setUiFileList] = useState([]);

  // 유지할 기존 이미지 id 목록 (서버로 전송)
  const [keepImgIds, setKeepImgIds] = useState([]);

  // 초기 setFieldsValue 중 foodid 초기화 방지
  const lockFoodResetRef = useRef(false);

  const pettypeid = Form.useWatch("pettypeid", form);
  const brandid = Form.useWatch("brandid", form);

  // 모달 열리면 수정폼 데이터 로드
  useEffect(() => {
    if (open && reviewid) {
      onFetchForm?.(reviewid);
    }
  }, [open, reviewid]);

  // 모달 닫히면 상태 초기화
  useEffect(() => {
    if (!open) {
      lockFoodResetRef.current = false;
      setUiFileList([]);
      setKeepImgIds([]);
      form.resetFields();
    }
  }, [open]);

  // 이미지 목록
  const imglist = useMemo(() => formData?.imglist || [], [formData]);

  // 종/브랜드 기반 사료 필터
  const filteredFoodList = useMemo(() => {
    const list = formData?.foodlist || [];
    if (!pettypeid || !brandid) return list;

    return list.filter(
      (f) =>
        String(f.pettypeid) === String(pettypeid) &&
        String(f.brandid) === String(brandid)
    );
  }, [formData, pettypeid, brandid]);

  // formData 들어오면 폼 채우기 + 기존 이미지 세팅
  useEffect(() => {
    const dto = formData?.dto;
    if (!dto || !open) return;

    lockFoodResetRef.current = true;

    const foodidStr = dto.foodid != null ? String(dto.foodid) : undefined;

    const food = (formData?.foodlist || []).find(
      (f) => String(f.foodid) === foodidStr
    );

    form.setFieldsValue({
      pettypeid: food?.pettypeid != null ? String(food.pettypeid) : undefined,
      brandid: dto.brandid != null ? String(dto.brandid) : undefined,
      foodid: foodidStr,

      rating: dto.rating != null ? Number(dto.rating) : 5,
      title: dto.title ?? "",
      reviewcomment: dto.reviewcomment ?? "",
    });

    //  초기에는 기존 이미지 전부 유지
    const initKeep = (formData?.imglist || []).map((img) => img.reviewimgid);
    setKeepImgIds(initKeep);

    //  기존 이미지를 Upload fileList 형식으로 변환 (origin=old 고정)
    const oldUiFiles = (formData?.imglist || []).map((img) => ({
      uid: `old-${img.reviewimgid}`,
      name: img.reviewimgname,
      status: "done",
      url: fileUrl(img.reviewimgname),

      origin: "old",
      reviewimgid: img.reviewimgid,
    }));

    setUiFileList(oldUiFiles);

    setTimeout(() => {
      lockFoodResetRef.current = false;
    }, 0);
  }, [formData, open]);

  // 종/브랜드 바뀌면 foodid 초기화 (초기 setFieldsValue 때는 금지)
  useEffect(() => {
    if (!open) return;
    if (lockFoodResetRef.current) return;

    form.setFieldsValue({ foodid: undefined });
  }, [pettypeid, brandid]);

  // Upload: 수업 방식(onChange) + 기존이미지 keepImgIds 연동
  const uploadProps = {
    multiple: true,
    accept: "image/*",
    listType: "picture-card",
    beforeUpload: () => false,

    fileList: uiFileList,

    onChange: ({ fileList }) => {
      // antd fileList 그대로 쓰되, 기존(old) 항목은 유지
      setUiFileList(fileList);
    },

    onRemove: (file) => {
      // 기존 이미지 삭제 -> keepImgIds에서 제거
      if (file.origin === "old") {
        setKeepImgIds((prev) => prev.filter((id) => id !== file.reviewimgid));
      }
      // uiFileList 제거는 antd가 자동
      return true;
    },

    onPreview: (file) => {
      const url =
        file.url ||
        (file.originFileObj ? URL.createObjectURL(file.originFileObj) : "");

      if (url) window.open(url, "_blank");
    },
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const dto = {
      brandid: values.brandid != null ? Number(values.brandid) : null,
      foodid: values.foodid != null ? Number(values.foodid) : null,
      rating: values.rating,
      title: values.title,
      reviewcomment: values.reviewcomment,
    };

    //  신규 파일만 서버로 전송: originFileObj 있는 것만 = 신규
    const realFiles = (uiFileList || [])
      .filter((f) => f.origin !== "old")
      .map((f) => f.originFileObj)
      .filter(Boolean);

    onSubmitEdit?.({ reviewid, dto, files: realFiles, keepImgIds });
  };

  return (
    <Modal
      title="리뷰 수정"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={editLoading}
      okText="수정"
      cancelText="취소"
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Space size={12} style={{ width: "100%" }} align="start">
          <Form.Item
            label="종"
            name="pettypeid"
            rules={[{ required: true, message: "종을 선택하세요" }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="종 선택">
              <Select.Option value="1">고양이</Select.Option>
              <Select.Option value="2">강아지</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="브랜드"
            name="brandid"
            rules={[{ required: true, message: "브랜드를 선택하세요" }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="브랜드 선택"
              showSearch
              optionFilterProp="label"
              options={(formData?.brandlist || []).map((b) => ({
                value: String(b.brandid),
                label: b.brandname,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="사료"
            name="foodid"
            rules={[{ required: true, message: "사료를 선택하세요" }]}
            style={{ flex: 2 }}
          >
            <Select
              placeholder="제품 선택"
              showSearch
              optionFilterProp="label"
              options={filteredFoodList.map((f) => ({
                value: String(f.foodid),
                label: f.foodname,
              }))}
            />
          </Form.Item>
        </Space>

        <Form.Item
          label="평점"
          name="rating"
          rules={[{ required: true, message: "평점을 선택하세요" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          label="제목"
          name="title"
          rules={[{ required: true, message: "제목을 입력하세요" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="리뷰 내용"
          name="reviewcomment"
          rules={[{ required: true, message: "리뷰 내용을 입력하세요" }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <div style={{ marginBottom: 6 }}>
          <Text strong>이미지 첨부</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            (선택)
          </Text>
        </div>

        <Upload {...uploadProps}>
          <div style={{ textAlign: "center" }}>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>추가</div>
          </div>
        </Upload>
      </Form>
    </Modal>
  );
}
