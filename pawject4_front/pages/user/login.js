// pages/login.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Input, Button, Spin, message } from "antd";
import { useRouter } from "next/router";
import { loginRequest, logoutRequest } from "../../reducers/user/authReducer";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  const onFinish = (values) => {
    dispatch(loginRequest({ ...values, provider: "local" }));
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8484/oauth2/authorization/${provider}`;
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={16} md={8}>
        {loading && <Spin />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!user || !user.nickname ? (
          <>
            <Form onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "이메일을 입력하세요." }]}
              >
                <Input placeholder="이메일" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
              >
                <Input.Password placeholder="비밀번호" />
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "200px", height: "50px" }}
                >
                  로그인
                </Button>
              </div>
            </Form>

            {/* 소셜 로그인 버튼 */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <img
                src="/images/google.png"
                alt="Google Login"
                style={{ cursor: "pointer", width: "200px", marginBottom: "10px" }}
                onClick={() => handleSocialLogin("google")}
              />
            </div>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <img
                src="/images/kakao.png"
                alt="Kakao Login"
                style={{ cursor: "pointer", width: "200px", marginBottom: "10px" }}
                onClick={() => handleSocialLogin("kakao")}
              />
            </div>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <img
                src="/images/naver.png"
                alt="Naver Login"
                style={{ cursor: "pointer", width: "200px", marginBottom: "10px" }}
                onClick={() => handleSocialLogin("naver")}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
                <p>{user.nickname} 님 환영합니다!</p>
                <Button
                type="default"
                style={{ marginTop: 20 }}
                onClick={() => dispatch(logoutRequest({ email: user.email }))}
                >
                로그아웃
                </Button>
            </div>

        )}
      </Col>
    </Row>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}