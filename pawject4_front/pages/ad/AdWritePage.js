// pages/ad/AdWritePage.js

import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createAdRequest, updateAdRequest } from '../../reducers/ad/adReducer';

const AdWritePage = ({ isEditing = false, currentAd = null, setIsEditing }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, ads } = useSelector(state => state.ad);

  useEffect(() => {
    if (isEditing && currentAd) {
      form.setFieldsValue({
        title: currentAd.title,
        content: currentAd.content,
      });
    }
  }, [isEditing, currentAd, form]);

  const handleFinish = (values) => {
    const { title, content, file } = values;
    const dto = { title, content };
    const fileObj = file && file[0]?.originFileObj ? file[0].originFileObj : null;

    if (isEditing) {
      dispatch(updateAdRequest({ adId: currentAd.id, dto, file: fileObj }));
      // ✅ 메시지는 사가 성공/실패 액션에서 처리하는 것이 더 안전
      setIsEditing(false);
    } else {
      dispatch(createAdRequest({ dto, file: fileObj }));
    }

    form.resetFields();
  };

  // ✅ 최신 광고는 ads[0]이 가장 최근
  const latestAd = ads && ads.length > 0 ? ads[0] : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";
  const imageUrl = latestAd?.imgUrl || (latestAd?.img ? `${API_URL}/upload/${latestAd.img}` : undefined);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {latestAd && (
        <Card title="최근 등록된 광고" style={{ marginBottom: 20 }}>
          <h3>{latestAd.title}</h3>
          <p>{latestAd.content}</p>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={latestAd.title}
              style={{ maxWidth: '100%', marginTop: 10 }}
            />
          )}
        </Card>
      )}

      <Card title={isEditing ? "광고 수정" : "새 광고 등록"}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="광고 제목"
            name="title"
            rules={[{ required: true, message: '제목을 입력하세요' }]}
          >
            <Input placeholder="광고 제목을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="광고 내용"
            name="content"
            rules={[{ required: true, message: '내용을 입력하세요' }]}
          >
            <Input.TextArea rows={4} placeholder="광고 내용을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="이미지 업로드"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1} listType="picture"> {/* ✅ 미리보기 옵션 추가 */}
              <Button icon={<UploadOutlined />}>이미지 선택</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? '수정하기' : '등록하기'}
            </Button>
            {isEditing && (
              <Button style={{ marginLeft: 8 }} onClick={() => { setIsEditing(false); form.resetFields(); }}>
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
