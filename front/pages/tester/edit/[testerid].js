// pages/tester/edit/[testerid].js
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Spin, Alert, message } from "antd";

import BoardCard from "../../../components/common/BoardCard";
import TesterForm from "../../../components/tester/TesterForm";

import {
  fetchTesterDetailRequest,
  updateTesterRequest,
  closeTesterDetail,
} from "../../../reducers/tester/testerReducer";

import { parseJwt } from "../../../utils/jwt";

function extractUserid(payload) {
  if (!payload) return null;

  const candidates = [payload.userid, payload.userId, payload.id, payload.sub];

  for (const v of candidates) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (/^\d+$/.test(s)) return Number(s);
  }
  return null;
}

export default function TesterEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { testerid } = router.query;

  const { detail, updateLoading, updateError } = useSelector((state) => state.tester);

  const [loginRole, setLoginRole] = useState(null);
  const [loginUserid, setLoginUserid] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setLoginRole(payload?.role ?? null);
    setLoginUserid(extractUserid(payload));
  }, []);

  const isAdmin = loginRole === "ROLE_ADMIN";

  useEffect(() => {
    if (!testerid) return;

    dispatch(fetchTesterDetailRequest({ testerid }));

    return () => {
      dispatch(closeTesterDetail());
    };
  }, [dispatch, testerid]);

  const dto = detail?.dto;

  const canEdit = useMemo(() => {
    if (!dto) return false;

    if (isAdmin) {
      return Number(dto?.posttype) === 1;
    }

    const ownerUserid = dto?.userid ?? null;
    if (loginUserid == null || ownerUserid == null) return false;

    return Number(loginUserid) === Number(ownerUserid);
  }, [dto, isAdmin, loginUserid]);


  const formMode = useMemo(() => {
    if (!dto) return "user";
    return Number(dto?.posttype) === 1 ? "admin" : "user";
  }, [dto]);

  const didSubmitRef = useRef(false);

  useEffect(() => {
    if (!didSubmitRef.current) return;
    if (updateLoading) return;
    if (updateError) return;

    message.success("수정 완료");
    router.push("/tester");
  }, [updateLoading, updateError, router]);

  useEffect(() => {
    if (updateError) message.error(String(updateError));
  }, [updateError]);

  const onSubmit = ({ dto: patchDto, files, keepImgIds }) => {
    if (!testerid) return;

    didSubmitRef.current = true;

    dispatch(
      updateTesterRequest({
        testerid,
        dto: patchDto,
        files,
        keepImgIds,
        mode: formMode, //  관리자글이면 admin으로 고정됨
      })
    );
  };

  return (
    <BoardCard
      title="체험단 수정"
      extra={<Button onClick={() => router.push("/tester")}>목록</Button>}
    >
      {detail?.loading && (
        <div style={{ padding: 30, textAlign: "center" }}>
          <Spin />
        </div>
      )}

      {!detail?.loading && detail?.error && (
        <Alert
          type="error"
          showIcon
          message="상세 불러오기 실패"
          description={String(detail.error)}
        />
      )}

      {!detail?.loading && !detail?.error && dto && !canEdit && (
        <Alert type="error" showIcon message="수정 권한이 없습니다." />
      )}

      {!detail?.loading && !detail?.error && dto && canEdit && (
        <TesterForm
          mode={formMode}
          isEdit={true}
          initialValues={dto}
          categoryOptions={["공지", "모집", "모집완료"]}
          onSubmit={onSubmit}
          loading={updateLoading}
        />
      )}
    </BoardCard>
  );
}