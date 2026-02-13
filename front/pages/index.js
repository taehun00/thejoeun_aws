// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/login"); // 로그인 페이지로 리다이렉트
  }, [router]);

  return null; // 화면에 아무것도 안 보여줌
}
