// pages/reviewboard/write.js
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Rate,
  Upload,
  Space,
  Typography,
  message,
  Collapse,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import BoardCard from "../../components/common/BoardCard";
import AiPolishBox from "../../components/reviewboard/AiPolishBox";

import {
  fetchReviewFormRequest,
  createReviewRequest,
  reviewPolishRequest,
    resetReviewFlags,
} from "../../reducers/review/reviewReducer";

const { TextArea } = Input;
const { Text } = Typography;
const { Panel } = Collapse;

export default function ReviewWritePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    formData,
    loading,
    error,

    // 글쓰기
    writeLoading,
    writeSuccess,
    writeError,

    // AI
    polishLoading,
    polishResult,
    polishError,
  } = useSelector((state) => state.review);

  const [files, setFiles] = useState([]);

  //초기화
  useEffect(() => {
    dispatch(resetReviewFlags());    
    dispatch(fetchReviewFormRequest({}));
  }, []);

  // 공통 데이터
  useEffect(() => {
    dispatch(fetchReviewFormRequest({})); // GET /reviewboard/form
  }, []);

  useEffect(() => {
    if (writeError) message.error(writeError);
  }, [writeError]);

  useEffect(() => {
    if (polishError) message.error(polishError);
  }, [polishError]);

  useEffect(() => {
    if (!writeSuccess) return;
    message.success("리뷰 등록 성공");
    dispatch(resetReviewFlags());  
    router.push("/reviewboard");
  }, [writeSuccess]);

  // 종/브랜드 기반 제품 필터링
  const pettypeid = Form.useWatch("pettypeid", form);
  const brandid = Form.useWatch("brandid", form);

  const filteredFoodList = useMemo(() => {
    const list = formData?.foodlist || [];
    if (!pettypeid || !brandid) return list;
    return list.filter(
      (f) =>
        String(f.pettypeid) === String(pettypeid) &&
        String(f.brandid) === String(brandid)
    );
  }, [formData, pettypeid, brandid]);

  // 종/브랜드 바뀌면 제품 초기화
  useEffect(() => {
    form.setFieldsValue({ foodid: undefined });
  }, [pettypeid, brandid]);

  // Upload: 자동 업로드 막고 프리뷰/삭제 제공
  const uploadProps = {
    multiple: true,
    accept: "image/*",
    listType: "picture",
    fileList: files,
    beforeUpload: () => false,
    onChange: ({ fileList }) => setFiles(fileList),
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  // 제출: 컨트롤러에 맞춰 multipart/form-data 전송
  const onSubmit = async () => {
    const values = await form.validateFields();

  const dto = {
    pettypeid: Number(values.pettypeid),
    brandid: Number(values.brandid),
    foodid: Number(values.foodid),
    rating: values.rating,
    title: values.title,
    reviewcomment: values.reviewcomment,
  };

    const realFiles = (files || [])
      .map((f) => f.originFileObj)
      .filter(Boolean);

    dispatch(createReviewRequest({ dto, files: realFiles }));
  };

  // AI 요청/적용 
  const titleValue = Form.useWatch("title", form) || "";
  const contentValue = Form.useWatch("reviewcomment", form) || "";

  const onRequestPolish = ({ title, reviewcomment }) => {
    dispatch(reviewPolishRequest({ title, reviewcomment })); // POST /reviewboard/reviewapi
  };

  const onApplyPolish = ({ title, content }) => {
    if (title) form.setFieldsValue({ title });
    if (content) form.setFieldsValue({ reviewcomment: content });
  };

  return (
    <BoardCard
      title="리뷰 작성"
      extra={
        <Space>
          <Button onClick={() => router.push("/reviewboard")}>목록보기</Button>
          <Button type="primary" onClick={onSubmit} loading={writeLoading}>
            등록
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ rating: 5 }}
      >
        {/* 상단 row */}
        <Card style={{ marginBottom: 14 }}>
          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item
              label="종"
              name="pettypeid"
              rules={[{ required: true, message: "종을 선택하세요" }]}
              style={{ width: 120 }}
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
              style={{ width: 220 }}
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
              label="제품명"
              name="foodid"
              rules={[{ required: true, message: "제품을 선택하세요" }]}
              style={{ flex: 1, minWidth: 260 }}
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

            <Form.Item
              label="평점"
              name="rating"
              rules={[{ required: true, message: "평점을 선택하세요" }]}
              style={{ width: 170 }}
            >
              <Rate />
            </Form.Item>
          </Space>
        </Card>

        {/* 제목 */}
        <Form.Item
          label="TITLE"
          name="title"
          rules={[{ required: true, message: "제목을 입력하세요" }]}
        >
          <Input placeholder="제목을 입력해 주세요" />
        </Form.Item>

        {/* 내용 */}
        <Form.Item
          label="Comments"
          name="reviewcomment"
          rules={[
            { required: true, message: "리뷰 내용을 입력하세요" },
            { max: 250, message: "250자 이내로 작성하세요" },
          ]}
        >
          <TextArea rows={6} placeholder="리뷰를 작성해 주세요 (250자 이내)" />
        </Form.Item>

        {/* 이미지 */}
        <div style={{ marginBottom: 6 }}>
          <Text strong>후기사진</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            (선택)
          </Text>
        </div>

        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>이미지 선택</Button>
        </Upload>

        {/* AI 다듬기: 기본 숨김 */}
        <Collapse style={{ marginTop: 16 }}>
          <Panel header="AI 리뷰 다듬기 (선택)" key="ai">
            <AiPolishBox
              titleValue={titleValue}
              contentValue={contentValue}
              loading={polishLoading}
              resultText={polishResult}
              onRequest={onRequestPolish}
              onApply={onApplyPolish}
            />
          </Panel>
        </Collapse>
      </Form>
    </BoardCard>
  );
}
