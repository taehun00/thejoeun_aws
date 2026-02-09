// components/tester/TesterForm.js
import { useEffect, useMemo, useState } from "react";
import { Form, Input, Select, Upload, Button, Space, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fileUrl } from "../../utils/fileUrl";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoodSelectListRequest } from "../../reducers/food/foodReducer";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

/**
 * TesterForm (관리자/유저 공용)
 *
 * props
 * - mode: "admin" | "user"
 * - isEdit: boolean
 * - initialValues?: dto
 * - categoryOptions?: string[]  (관리자용)
 * - onSubmit: ({ dto, files, keepImgIds }) => void
 * - loading?: boolean
 */
export default function TesterForm({
  mode = "user",
  isEdit = false,
  initialValues,
  categoryOptions = [],
  onSubmit,
  loading = false,
}) {
  const [form] = Form.useForm();

  const isAdmin = mode === "admin";
  const isAdminPost = Number(initialValues?.posttype) === 1;
  const showAdminFields = isAdmin && (!isEdit || isAdminPost);

  const [uiFileList, setUiFileList] = useState([]);
  const [keepImgIds, setKeepImgIds] = useState([]);

  const dispatch = useDispatch();

  const { foodSelectList, foodSelectLoading, foodSelectError } = useSelector(
    (state) => state.food
  );

  const imgList = useMemo(() => {
    const arr = initialValues?.imgList || [];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => ({
        testerimgid: x?.testerimgid,
        imgsrc: x?.imgsrc,
      }))
      .filter((x) => x.testerimgid != null && x.imgsrc);
  }, [initialValues]);

  const foodOptions = useMemo(() => {
    return (foodSelectList || []).map((f) => ({
      value: Number(f.foodid),
      label: f.foodname,
    }));
  }, [foodSelectList]);

  useEffect(() => {
    if (!isAdmin) return;
    dispatch(fetchFoodSelectListRequest());
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    console.log("foodSelectLoading =", foodSelectLoading);
    console.log("foodSelectList =", foodSelectList);
    if (foodSelectError) console.log("foodSelectError =", foodSelectError);
  }, [isAdmin, foodSelectLoading, foodSelectList, foodSelectError]);

  useEffect(() => {
    if (!initialValues) return;

    form.setFieldsValue({
      category: initialValues.category ?? undefined,
      title: initialValues.title ?? "",
      content: initialValues.content ?? "",
      foodid:
        initialValues.foodid !== undefined &&
        initialValues.foodid !== null &&
        Number(initialValues.foodid) > 0
          ? Number(initialValues.foodid)
          : undefined,

      isnotice:
        initialValues.isnotice !== undefined && initialValues.isnotice !== null
          ? Number(initialValues.isnotice)
          : 0,
      status:
        initialValues.status !== undefined && initialValues.status !== null
          ? Number(initialValues.status)
          : 0,
    });
  }, [initialValues, form]);

  useEffect(() => {
    if (!isEdit) return;
    if (!initialValues) return;

    const initKeep = (initialValues?.imgList || [])
      .map((img) => img?.testerimgid)
      .filter((x) => x != null);

    setKeepImgIds(initKeep);

    const oldUiFiles = (initialValues?.imgList || [])
      .map((img) => ({
        uid: `old-${img.testerimgid}`,
        name:
          String(img.imgsrc || "").split("/").pop() ||
          `old-${img.testerimgid}`,
        status: "done",
        url: fileUrl(img.imgsrc),

        origin: "old",
        testerimgid: img.testerimgid,
      }))
      .filter((x) => x.testerimgid != null && x.url);

    setUiFileList(oldUiFiles);
  }, [isEdit, initialValues]);

  const category = Form.useWatch("category", form);

  const uploadProps = {
    multiple: true,
    accept: "image/*",
    listType: "picture-card",
    beforeUpload: () => false,

    fileList: uiFileList,

    onChange: ({ fileList }) => {
      setUiFileList(fileList);
    },

    onRemove: (file) => {
      if (file.origin === "old") {
        setKeepImgIds((prev) => prev.filter((id) => id !== file.testerimgid));
      }
      return true;
    },

    onPreview: (file) => {
      const url =
        file.url ||
        (file.originFileObj ? URL.createObjectURL(file.originFileObj) : "");

      if (url) window.open(url, "_blank");
    },
  };

  const handleFinish = (values) => {
    const dto = {
      category: isAdmin ? values.category : "후기",
      title: values.title,
      content: values.content,
    };

    if (isAdmin) {
      dto.foodid = Number(values.foodid || 0);
      dto.isnotice = Number(values.isnotice ?? 0);

      if (values.category === "공지") dto.status = 0;
      else dto.status = Number(values.status ?? 0);

      dto.posttype = 1;
    }

    const realFiles = (uiFileList || [])
      .filter((f) => f.origin !== "old")
      .map((f) => f.originFileObj)
      .filter(Boolean);

    const finalKeepImgIds = isEdit ? keepImgIds : [];

    onSubmit?.({ dto, files: realFiles, keepImgIds: finalKeepImgIds });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        category: undefined,
        title: "",
        content: "",
        foodid: 0,
        isnotice: 0,
        status: 0,
      }}
    >
      {/* 관리자-카테고리 */}
      {showAdminFields && (
        <Space wrap>
          <Form.Item
            label="카테고리"
            name="category"
            rules={[{ required: true, message: "카테고리를 선택하세요." }]}
          >
<Select
  placeholder="카테고리 선택"
  style={{ width: 200 }}
  onChange={(v) => {
    form.setFieldsValue({ category: v });

    if (v === "모집중" || v === "모집") form.setFieldsValue({ status: 0 });
    if (v === "모집완료") form.setFieldsValue({ status: 1 });
  }}
>
              {categoryOptions.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="상단공지" name="isnotice" style={{ width: 180 }}>
            <Select>
              <Option value={0}>상단공지X</Option>
              <Option value={1}>상단공지</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="모집상태"
            name="status"
            style={{ width: 180 }}
            tooltip="공지글은 모집상태가 적용되지 않습니다."
          >
            <Select disabled={category === "공지"}>
              <Option value={0}>모집중</Option>
              <Option value={1}>모집완료</Option>
            </Select>
          </Form.Item>

          <Form.Item label="연관 사료(foodid)" name="foodid">
            <Select
              placeholder="사료 선택"
              showSearch
              optionFilterProp="label"
              loading={foodSelectLoading}
              options={foodOptions}
              allowClear
              style={{ width: 360 }}
            />
          </Form.Item>
        </Space>
      )}

      <Form.Item
        label="제목"
        name="title"
        rules={[{ required: true, message: "제목을 입력하세요." }]}
      >
        <Input placeholder="제목 입력" maxLength={80} />
      </Form.Item>

      <Form.Item
        label="내용"
        name="content"
        rules={[{ required: true, message: "내용을 입력하세요." }]}
      >
        <TextArea rows={10} placeholder="내용 입력" />
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

      <Form.Item style={{ marginTop: 18 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "수정" : "등록"}
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            초기화
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}