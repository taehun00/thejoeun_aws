// components/AppLayout.js
import { Layout, Menu, Drawer, Button, Grid, Row, Col, Card, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLatestAdsRequest } from "../reducers/ad/adReducer";
import { parseJwt } from "../utils/jwt";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function AppLayout({ children }) {
  const router = useRouter();
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const { latestAds, loading, error } = useSelector((s) => s.ad);

  const [isLogin, setIsLogin] = useState(false);
  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");
    const payload = token ? parseJwt(token) : null;
    const roleFromToken = payload?.role ?? null;
    setIsLogin(!!user || !!token);
    setLoginRole(user?.role ?? roleFromToken);
  }, [user]);

  const canAdmin = loginRole === "ROLE_ADMIN" || loginRole === "ADMIN";

  // ✅ 광고 목록 불러오기
  useEffect(() => {
    dispatch(fetchLatestAdsRequest({ start: 1, end: 3 }));
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    alert("로그아웃 되었습니다.");
    window.location.href = "/mainpage";
  };

  const menuItems = useMemo(() => {
    const items = [
      { key: "/petfoodsearch", label: <Link href="/petfoodsearch">사료찾기</Link> },
      { key: "/reviewboard", label: <Link href="/reviewboard">사료리뷰</Link> },
      { key: "/disease", label: <Link href="/petdisease">질환정보</Link> },
      { key: "/exec", label: <Link href="/exec">운동챌린지</Link> },
      { key: "/tester", label: <Link href="/tester">체험단</Link> },
      { key: "/faq", label: <Link href="/faq">고객센터</Link> },
    ];
    if (canAdmin) {
      items.push(
        { key: "/foodboard", label: <Link href="/foodboard">사료관리</Link> },
        { key: "/faq/admin", label: <Link href="/faq/admin">FAQ관리</Link> },
        { key: "/admin/reports", label: <Link href="/admin/reports">신고기록</Link> },
        { key: "/ad", label: <Link href="/ad">광고관리</Link> }
      );
    }
    if (!isLogin) {
      items.push(
        { key: "/user/login", label: <Link href="/user/login">로그인</Link> },
        { key: "/user/signup", label: <Link href="/user/signup">회원가입</Link> }
      );
    } else {
      items.push(
        { key: "/mypage", label: <Link href="/user/mypage">마이페이지</Link> },
        {
          key: "/user/logout",
          label: (
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              로그아웃
            </span>
          ),
        }
      );
    }
    return items;
  }, [isLogin, canAdmin]);

  const selectedKeys = useMemo(() => {
    const exact = menuItems.find((m) => m.key === router.pathname);
    if (exact) return [exact.key];
    const found = menuItems.find((m) => router.pathname.startsWith(m.key) && m.key !== "/");
    return found ? [found.key] : ["/"];
  }, [router.pathname, menuItems]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";

  // ✅ 광고 카드 렌더링 함수 (중복 제거)
  const renderAds = () => (
    <Card title="📢 최신 광고" bordered={false} size="small">
      {loading ? (
        <Text type="secondary">불러오는 중...</Text>
      ) : error ? (
        <Text type="danger">광고 불러오기 실패: {error}</Text>
      ) : latestAds && latestAds.length > 0 ? (
        <Row gutter={[8, 8]}>
          {latestAds.map((ad) => {
            const imageUrl =
              ad.imgUrl || (ad.img ? `${API_URL}/upload/${ad.img}` : null);

            return (
              <Col span={24} key={ad.id}>
                <Card
                  hoverable
                  size="small"
                  style={{ borderRadius: 8 }}
                  cover={
                    imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="광고 이미지" // ✅ 제목 대신 일반 alt 텍스트
                        style={{ maxHeight: 300, objectFit: "cover" }}
                      />
                    ) : null
                  }
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Text type="secondary">등록된 광고가 없습니다.</Text>
      )}
    </Card>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/mainpage" legacyBehavior>
            <a style={{ color: "#fff", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              🐾 Petfood&health
            </a>
          </Link>
        </div>

        {screens.md ? (
          <Menu
            theme="dark"
            mode="horizontal"
            items={menuItems}
            selectedKeys={selectedKeys}
            style={{ flex: 1, justifyContent: "flex-end" }}
          />
        ) : (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
          />
        )}
      </Header>

      <Drawer
        title="MENU"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          selectedKeys={selectedKeys}
          onClick={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* ✅ Content + 좌우 광고 영역 */}
      <Content style={{ padding: "16px" }}>
        <Row gutter={[16, 16]}>
          {/* ✅ 왼쪽 광고 */}
          <Col xs={24} md={6} lg={6}>
            {renderAds()}
          </Col>

          {/* ✅ 메인 콘텐츠 중앙 */}
          <Col xs={24} md={12} lg={12}>
            <div style={{ maxWidth: "100%" }}>{children}</div>
          </Col>

          {/* ✅ 오른쪽 광고 */}
          <Col xs={24} md={6} lg={6}>
            {renderAds()}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
