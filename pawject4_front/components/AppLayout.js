// components/AppLayout.js
import { Layout, Menu, Drawer, Button, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";

//권한 판별
import { parseJwt } from "../utils/jwt"; 

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function AppLayout({ children }) {
  const router = useRouter();
  const screens = useBreakpoint();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // redux auth (있으면 쓰고, 없어도 토큰으로 판별)
  const { user } = useSelector((s) => s.auth);

  const [isLogin, setIsLogin] = useState(false);
  const [loginRole, setLoginRole] = useState(null);

  //  로그인/권한 판별: auth.user + 토큰 혼합
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");

    const payload = token ? parseJwt(token) : null;
    const roleFromToken = payload?.role ?? null;

    // 로그인 여부
    setIsLogin(!!user || !!token);

    // role 우선순위: redux user.role > token role
    setLoginRole(user?.role ?? roleFromToken);
  }, [user]);

  const canAdmin = loginRole === "ROLE_ADMIN" || loginRole === "ADMIN";

// 로그아웃
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("jwt");

  alert("로그아웃 되었습니다.");

 window.location.href = "/mainpage";
};

  // 권한 분기 메뉴
  const menuItems = useMemo(() => {
    const items = [
      { key: "/petfoodsearch", label: <Link href="/petfoodsearch">사료찾기</Link> },
      { key: "/reviewboard", label: <Link href="/reviewboard">사료리뷰</Link> },
      { key: "/disease", label: <Link href="/petdisease">질환정보</Link> },
      { key: "/exec", label: <Link href="/exec">운동챌린지</Link> },
      { key: "/tester", label: <Link href="/tester">체험단</Link> },
      { key: "/faq", label: <Link href="/faq">고객센터</Link> },
      //{ key: "/ad", label: <Link href="/ad">광고</Link> },  // 광고 기능 작동여부 확인용.
    ];

    // 관리자 전용 메뉴
    if (canAdmin) {
      items.push(
        { key: "/foodboard", label: <Link href="/foodboard">사료관리</Link> },
        { key: "/faq/admin", label: <Link href="/faq/admin">FAQ관리</Link> },
        { key: "/admin/reports", label: <Link href="/admin/reports">신고기록</Link> },
        { key: "/ad", label: <Link href="/ad">광고관리</Link> }  // 관리자가 광고 관리
      );
    }

    // 로그인o
    if (!isLogin) {
      items.push(
        { key: "/user/login", label: <Link href="/user/login">로그인</Link> },
        { key: "/user/signup", label: <Link href="/user/signup">회원가입</Link> }
      );
    } else {  //로그인x
      items.push(
        { key: "/mypage", label: <Link href="/user/mypage">마이페이지</Link> },
        { key: "/user/logout",
          label: (
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              로그아웃
            </span>
          )
        }
      );
    }

    return items;
  }, [isLogin, canAdmin]);

  // 현재 경로에 따른 active 메뉴 키
  const selectedKeys = useMemo(() => {
    const exact = menuItems.find((m) => m.key === router.pathname);
    if (exact) return [exact.key];

    const found = menuItems.find((m) => router.pathname.startsWith(m.key) && m.key !== "/");
    return found ? [found.key] : ["/"];
  }, [router.pathname, menuItems]);

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
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/mainpage" legacyBehavior>
            <a style={{ color: "#fff", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              🐾 Petfood&health
            </a>
          </Link>
        </div>

        {/* 메뉴 */}
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

      {/* 모바일 Drawer */}
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

      {/* Content */}
      <Content style={{ padding: "28px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
      </Content>
    </Layout>
  );
}
