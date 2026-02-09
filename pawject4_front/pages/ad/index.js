// pages/ad/AdWritePage.js

import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createAdRequest, updateAdRequest } from '../../reducers/ad/adReducer';

const AdWritePage = ({ isEditing = false, currentAd = null, setIsEditing }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, ads } = useSelector(state => state.ad); // ✅ ads 상태도 가져와서 최근 광고 표시

  // 수정 모드일 경우 기존 광고 데이터를 폼에 채워넣기
  useEffect(() => {
    if (isEditing && currentAd) {
      form.setFieldsValue({
        title: currentAd.title,
        content: currentAd.content,
      });
    }
  }, [isEditing, currentAd, form]);

  // 폼 제출 처리 함수
  const handleFinish = (values) => {
    const { title, content, file } = values;
    const dto = { title, content };
    const fileObj = file && file[0]?.originFileObj ? file[0].originFileObj : null;

    if (isEditing) {
      dispatch(updateAdRequest({ adId: currentAd.id, dto, file: fileObj }));
      message.success('광고가 수정되었습니다.');
      setIsEditing(false);
    } else {
      dispatch(createAdRequest({ dto, file: fileObj }));
      message.success('광고가 등록되었습니다.');
    }

    form.resetFields();
  };

  // ✅ 최근 등록된 광고 가져오기 (ads 배열의 첫 번째 요소) 
  const latestAd = ads && ads.length > 0 ? ads[ads.length - 1] : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";
  const imageUrl = latestAd?.img  ? `${API_URL}/upload/${latestAd.img}` : undefined;  

  console.log( '.............' , latestAd);


  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* ✅ 최근 광고 표시 영역 추가 */}
      {latestAd && (
        <Card title="최근 등록된 광고" style={{ marginBottom: 20 }}>
          <h3>{latestAd.title}</h3>
          <p>{latestAd.content}</p>
          {latestAd.img && (
            <img
              src={imageUrl} 
              alt={latestAd.title}
              style={{ maxWidth: '100%', marginTop: 10 }}
            />
          )}
        </Card>
      )}

      {/* 글쓰기/수정 폼 */}
      <Card title={isEditing ? "광고 수정" : "새 광고 등록"}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          {/* 광고 제목 입력 */}
          <Form.Item
            label="광고 제목"
            name="title"
            rules={[{ required: true, message: '제목을 입력하세요' }]}
          >
            <Input placeholder="광고 제목을 입력하세요" />
          </Form.Item>

          {/* 광고 내용 입력 */}
          <Form.Item
            label="광고 내용"
            name="content"
            rules={[{ required: true, message: '내용을 입력하세요' }]}
          >
            <Input.TextArea rows={4} placeholder="광고 내용을 입력하세요" />
          </Form.Item>

          {/* 이미지 업로드 */}
          <Form.Item
            label="이미지 업로드"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>이미지 선택</Button>
            </Upload>
          </Form.Item>

          {/* 제출 버튼 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? '수정하기' : '등록하기'}
            </Button>
            {isEditing && (
              <Button style={{ marginLeft: 8 }} onClick={() => setIsEditing(false)}>
                취소
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdWritePage;