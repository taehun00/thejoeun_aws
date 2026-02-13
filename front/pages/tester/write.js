// pages/tester/write.js
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Alert, message } from "antd";

import BoardCard from "../../components/common/BoardCard";
import TesterForm from "../../components/tester/TesterForm";

import {
  createTesterAdminRequest,
  createTesterUserRequest,
} from "../../reducers/tester/testerReducer";

import { parseJwt } from "../../utils/jwt";

export default function TesterWritePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { writeLoading, writeError } = useSelector((state) => state.tester);

  // 관리자 권한 판별
  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setLoginRole(payload?.role ?? null);
  }, []);

  const canAdmin = loginRole === "ROLE_ADMIN";
  const mode = canAdmin ? "admin" : "user";

  //  글쓰기 성공 후 이동
  const didSubmitRef = useRef(false);

  useEffect(() => {
    if (!didSubmitRef.current) return;
    if (writeLoading) return;
    if (writeError) return;

    message.success("등록 완료");
    router.push("/tester");
  }, [writeLoading, writeError, router]);

  useEffect(() => {
    if (writeError) message.error(String(writeError));
  }, [writeError]);

  const onSubmit = ({ dto, files }) => {
    didSubmitRef.current = true;

    // 관리자 / 유저 분기
    if (canAdmin) {
      dispatch(createTesterAdminRequest({ dto, files }));
    } else {
      dispatch(createTesterUserRequest({ dto, files }));
    }
  };

  return (
    <BoardCard
      title={canAdmin ? "체험단 공고 작성" : "체험단 후기 작성"}
      extra={<Button onClick={() => router.push("/tester")}>목록</Button>}
    >
      {/* 비로그인 방어 */}
      {loginRole === null && (
        <Alert
          type="warning"
          showIcon
          message="로그인 정보 확인 중입니다."
          style={{ marginBottom: 12 }}
        />
      )}

      <TesterForm
        mode={mode}
        isEdit={false}
        categoryOptions={["공지", "모집", "모집완료"]}
        onSubmit={onSubmit}
        loading={writeLoading}
      />
    </BoardCard>
  );
}