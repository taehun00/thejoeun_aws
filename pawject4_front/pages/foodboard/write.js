import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  message,
    InputNumber,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

import BoardCard from "../../components/common/BoardCard";
import NaverOcrBox from "../../components/foodboard/NaverOcrBox";

import {
  fetchFoodFormRequest,
  createFoodRequest,
  updateFoodRequest,
  resetFoodFlags,
} from "../../reducers/food/foodReducer";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function FoodWritePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  // 수정모드 판별
  const foodidParam = router.query.foodid;
  const foodid = foodidParam ? Number(foodidParam) : null;
  const isEdit = !!foodid;

  const {
    loading,
    error,
    formData,

    writeLoading,
    writeSuccess,
    writeError,

    editLoading,
    editSuccess,
    editError,
  } = useSelector((state) => state.food);

  // formData에서 추출
  const brandlist = formData?.brandlist ?? [];
  const nutrientlist = formData?.nutrientlist ?? [];
  const dto = formData?.dto ?? null;
  const nutriList = formData?.nutriList ?? null;

  // 파일 1개
  const [fileList, setFileList] = useState([]);

  //이미지경로

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";
  const getFoodImageUrl = (fdto) => {
  if (!fdto) return null;

  if (fdto.foodimg) {
    const imgPath = String(fdto.foodimg).includes("/")
      ? fdto.foodimg
      : `foodimg/${fdto.foodimg}`;

    return `${API_URL}/uploads/${imgPath}`;
  }

  if (fdto.brandid) return `/foodimg/brand0${fdto.brandid}.png`;
  return `/foodimg/default.png`;
};


//오류 확인
useEffect(() => {
  console.log("formData =", formData);
  console.log("dto =", dto);
  console.log("dto.foodimg =", dto?.foodimg);
}, [formData, dto]);
console.log("렌더링 food state dto =", dto);
console.log("렌더링 formData =", formData);
console.log("렌더링 isEdit =", isEdit, "foodid =", foodid);

  // 1) 폼데이터 불러오기
  useEffect(() => {
    if (!router.isReady) return;

    dispatch(fetchFoodFormRequest(isEdit ? { foodid } : {}));
  }, [dispatch, router.isReady, isEdit, foodid]);

  // 2) 공통 에러 처리
  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  useEffect(() => {
    if (writeError) message.error(writeError);
  }, [writeError]);

  useEffect(() => {
    if (editError) message.error(editError);
  }, [editError]);

  // 3) 수정모드일 때 form 채우기
  useEffect(() => {
    if (!isEdit) return;
    if (!dto) return;

    form.setFieldsValue({
      ...dto,
    });

    if (Array.isArray(nutriList)) {
      const rows = nutriList.map((n) => ({
        nutrientid: n.nutrientid ?? "",
        amount: n.amount ?? "",
      }));

      while (rows.length < 4) rows.push({ nutrientid: "", amount: "" });

      form.setFieldsValue({
        nutriRows: rows,
      });
    }
  }, [isEdit, dto, nutriList, form]);

  //기존 파일 미리보기
  useEffect(() => {
    if (!isEdit) return;
    if (!dto?.foodimg) return;

    const url = getFoodImageUrl(dto);

    setFileList([
      { 
        uid: "-1",
        name: dto.foodimg,
        status: "done",
        url,
        thumbUrl: url,   
      },
    ]);
  }, [isEdit, dto]);

  // 4) 등록 성공 처리
  useEffect(() => {
    if (!writeSuccess) return;

    message.success("사료 등록 완료");
    form.resetFields();
    setFileList([]);
    dispatch(resetFoodFlags());

    // 디테일 페이지로 이동
     router.push("/foodboard");
  }, [writeSuccess, dispatch, form]);

  // 5) 수정 성공 처리
  useEffect(() => {
    if (!editSuccess) return;

    message.success("사료 수정 완료");
    dispatch(resetFoodFlags());

    //  이동
     router.push(`/foodboard/detail/${foodid}`);
  }, [editSuccess, dispatch, foodid]);

  // 브랜드 옵션
  const brandOptions = useMemo(() => {
    return (brandlist || []).map((b) => ({
      value: b.brandid,
      label: b.brandname,
    }));
  }, [brandlist]);

  // 영양소 옵션
  const nutrientOptions = useMemo(() => {
    return (nutrientlist || []).map((n) => ({
      value: n.nutrientid,
      label: n.nutrientname,
      unit: n.unit,
    }));
  }, [nutrientlist]);

  // unit 표시용
  const getUnit = (nid) => {
    const found = nutrientOptions.find((n) => n.value === nid);
    return found?.unit || "%";
  };

  // nutrientid[] / amount[] payload 생성
  const buildNutriPayload = (nutriRows) => {
    const nutrientidArr = [];
    const amountArr = [];

    (nutriRows || []).forEach((row) => {
      if (!row) return;
      const nid = row.nutrientid;
      const amt = row.amount;

      if (amt === undefined || amt === null || String(amt).trim() === "") return;
      if (nid === undefined || nid === null || String(nid).trim() === "") return;

      nutrientidArr.push(nid);
      amountArr.push(amt);
    });

    return { nutrientid: nutrientidArr, amount: amountArr };
  };

  // submit
  const onFinish = (values) => {
    const { nutriRows, ...dtoPayload } = values;
    const { nutrientid, amount } = buildNutriPayload(nutriRows);

    const file = fileList?.[0]?.originFileObj || null;

    if (isEdit) {
      dispatch(
        updateFoodRequest({
          foodid,
          dto: dtoPayload,
          nutrientid,
          amount,
          file,
        })
      );
    } else {
      dispatch(
        createFoodRequest({
          dto: dtoPayload,
          nutrientid,
          amount,
          file,
        })
      );
    }
  };

  const submitting = writeLoading || editLoading;

  return (
    <BoardCard
      title={isEdit ? "사료 수정" : "신규 사료 등록"}
      extra={
        <Space>
          <Button
            onClick={() => {
              form.resetFields();
              setFileList([]);
              dispatch(fetchFoodFormRequest(isEdit ? { foodid } : {}));
            }}
          >
            초기화
          </Button>

          <Button type="primary" loading={submitting} onClick={() => form.submit()}>
            {isEdit ? "사료 수정" : "사료 등록"}
          </Button>
        </Space>
      }
    >
      <NaverOcrBox title="라벨 텍스트 추출" />

      <Divider />

      {loading && (
        <div style={{ padding: 12 }}>
          <Spin /> <Text type="secondary">로딩중...</Text>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          nutriRows: [
            { nutrientid: "", amount: "" },
            { nutrientid: "", amount: "" },
            { nutrientid: "", amount: "" },
            { nutrientid: "", amount: "" },
          ],
        }}
      >
        {/* 브랜드 / 펫타입 / 사료타입 */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="브랜드" name="brandid">
              <Select placeholder="-- 선택 --" options={brandOptions} allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="펫타입" name="pettypeid">
              <Select
                placeholder="-- 선택 --"
                options={[
                  { value: 1, label: "고양이" },
                  { value: 2, label: "강아지" },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="사료 타입" name="foodtype">
              <Select
                placeholder="-- 선택 --"
                options={[
                  { value: "건식", label: "건식" },
                  { value: "습식", label: "습식" },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 사료 이름 / 설명 */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="사료 이름" name="foodname">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="사료 설명" name="description">
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        {/* 주재료 / 부재료 */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="주재료" name="mainingredient">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="부재료" name="subingredient">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* 분류 / 연령 / 그레인프리 */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="분류" name="category">
              <Select
                placeholder="-- 선택 --"
                options={[
                  { value: "일반", label: "일반" },
                  { value: "처방식", label: "처방식" },
                  { value: "기능식", label: "기능식" },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="연령" name="petagegroup">
              <Select
                placeholder="-- 선택 --"
                options={[
                  { value: "어덜트", label: "어덜트" },
                  { value: "시니어", label: "시니어" },
                  { value: "키튼", label: "키튼" },
                  { value: "퍼피", label: "퍼피" },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="그레인프리" name="isgrainfree">
              <Select
                placeholder="-- 선택 --"
                options={[
                  { value: "Y", label: "Y" },
                  { value: "N", label: "N" },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 칼로리 */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
        <Form.Item label="칼로리" name="calorie">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* 영양소 */}
        <Title level={5}>영양소</Title>

        <Form.List name="nutriRows">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => {
                const nutrientIdValue = form.getFieldValue([
                  "nutriRows",
                  field.name,
                  "nutrientid",
                ]);

                return (
                  <Row
                    gutter={16}
                    key={field.key}
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col xs={24} md={10}>
                      <Form.Item
                        {...field}
                        label="영양소"
                        name={[field.name, "nutrientid"]}
                      >
                        <Select
                          placeholder="-- 선택 --"
                          options={nutrientOptions.map((n) => ({
                            value: n.value,
                            label: n.label,
                          }))}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={20} md={10}>
                      <Form.Item {...field} label="함량" name={[field.name, "amount"]}>
                        <Input addonAfter={getUnit(nutrientIdValue)} />
                      </Form.Item>
                    </Col>

                    <Col xs={4} md={4}>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                        disabled={fields.length <= 1}
                      />
                    </Col>
                  </Row>
                );
              })}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add({ nutrientid: "", amount: "" })}
                style={{ width: "100%", marginTop: 8 }}
              >
                추가
              </Button>
            </>
          )}
        </Form.List>

        <Divider />

        {/* 이미지 */}
        <Title level={5}>제품 이미지</Title>

      <Upload
        listType="picture"   
        beforeUpload={() => false}
        accept="image/*"
        maxCount={1}
        fileList={fileList}
        onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
      >
        <Button icon={<UploadOutlined />}>이미지 선택</Button>
      </Upload>

        <Divider />

        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => router.push("/foodboard")}>목록보기</Button>

          <Button type="primary" loading={submitting} onClick={() => form.submit()}>
            {isEdit ? "사료 수정" : "사료 등록"}
          </Button>
        </Space>
      </Form>
    </BoardCard>
  );
}
