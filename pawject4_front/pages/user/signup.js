// pages/signup.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Input, Button, Upload, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { signupRequest, resetAuthState } from "../../reducers/user/authReducer";
import axios from "../../api/axios";

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("nickname", values.nickname);
    formData.append("provider", "local");
    if (fileList.length > 0) {
      formData.append("ufile", fileList[0].originFileObj);
    }
    dispatch(signupRequest(formData));
  };

  useEffect(() => {
    if (success) {
      message.success("회원가입이 성공적으로 완료되었습니다.");
      router.push("user/login");
      dispatch(resetAuthState());
    }
  }, [success, router, dispatch]);

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={16} md={8}>
        {loading && <Spin />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!success && (
          <Form onFinish={onFinish} layout="vertical">
            {/* 이메일 입력 */}
            <Form.Item
              label="이메일"
              name="email"
              rules={[{ required: true, message: "이메일을 입력하세요." }]}
            >
              <Input />
            </Form.Item>

            {/* 비밀번호 입력 */}
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
            >
              <Input.Password />
            </Form.Item>

            {/* 닉네임 입력 */}
            <Form.Item
              label="닉네임"
              name="nickname"
              rules={[{ required: true, message: "닉네임을 입력하세요." }]}
            >
              <Input />
            </Form.Item>

            {/* 프로필 이미지 업로드 */}
            <Form.Item name="profileImage" label="프로필 이미지">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>이미지 선택</Button>
              </Upload>
            </Form.Item>

            <div style={{ display: "flex", gap: 10 }}>
              <Button type="default" onClick={() => window.history.back()}>
                뒤로가기
              </Button>

              <Button type="primary" htmlType="submit" loading={loading}>
                회원가입
              </Button>
            </div>
          </Form>
        )}
      </Col>
    </Row>
  );
}