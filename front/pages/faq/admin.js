// pages/faq/admin.js 
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Card, Modal, Space, Spin, message } from "antd";

//공용
import BoardCard from "../../components/common/BoardCard";
import BoardToggleTable from "../../components/common/BoardToggleTable";

//권한 
import { parseJwt } from "../../utils/jwt";

//커스텀
import FaqRowToggle from "../../components/support/FaqRowToggle";
import FaqActiveButton from "../../components/support/FaqActiveButton";
import FaqForm from "../../components/support/FaqForm";

import {
  fetchFaqAdminRequest,
  toggleFaqOpen,

  fetchFaqCategoriesRequest,
  writeFaqRequest,
  editFaqRequest,

  activeFaqRequest,
  resetFaqErrors,
} from "../../reducers/support/faqReducer";

export default function FaqAdminPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 권한 판별
  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setLoginRole(payload?.role ?? null);
  }, []);

  const canAdmin = loginRole === "ROLE_ADMIN";

  // 관리자 아니면 이동
  useEffect(() => {
    if (loginRole === null) return; // 아직 판별 전

    if (!canAdmin) {
      message.error("관리자만 접근 가능합니다.");
      router.replace("/faq");
    }
  }, [loginRole, canAdmin, router]);

  const faq = useSelector((s) => s.faq);

  const {
    list,
    loading,
    openId,

    categories,
    categoriesLoading,
    
    writeLoading,
    writeError,

    editLoading,
    activeLoading,

    error,
    editError,
    activeError,
  } = faq;

  // 초기값
  useEffect(() => {
    if (!canAdmin) return;
    dispatch(fetchFaqAdminRequest());
    dispatch(fetchFaqCategoriesRequest());
  }, [dispatch, canAdmin]);

  // 에러 토스트
  useEffect(() => {
    if (error) message.error(error);
    if (editError) message.error(editError);
    if (activeError) message.error(activeError);
    if (writeError) message.error(writeError);

    if (error || writeError || editError || activeError) dispatch(resetFaqErrors());
  }, [error, editError, activeError, writeError, dispatch]);

  //글쓰기 토글
  const [writeOpen, setWriteOpen] = useState(false);

  // 수정 모달
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const onEdit = (record) => {
    setEditTarget(record);
    setEditOpen(true);
  };

  const columns = useMemo(() => {
    const base = [
      {
        title: "NO.",
        key: "no",
        width: 70,
        align: "center",
        render: (_, __, idx) => idx + 1,
      },
      {
        title: "분류",
        dataIndex: "category",
        key: "category",
        width: 110,
        align: "center",
      },
      {
        title: "질문",
        dataIndex: "question",
        key: "question",
        align: "center",
      },

      {
        title: "등록일",
        key: "date",
        width: 160,
        align: "center",
        render: (_, record) => {
          const createdat = record?.createdat || "-";
          const updatedat = record?.updatedat;

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                {createdat}
              </span>

              {updatedat ? (
                <span style={{ fontSize: 11, color: "#999" }}>
                  수정일 {updatedat}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        title: "사용여부",
        key: "isactive",
        width: 140,
        align: "center",
        render: (_, record) => (
        <FaqActiveButton
            faqid={record.faqid}
            isactive={record.isactive}
            loading={activeLoading}
            onToggle={(faqid) => {
            const modal = Modal.confirm({
                title: "활성화 상태를 변경하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk: () => {
                dispatch(activeFaqRequest({ faqid }));
                modal.destroy(); // 확인 누르면 창 강제 닫기
                },
            });
            }}
        />
        ),
      },
    ];

    return base;
  }, [activeLoading, dispatch]);

  const extra = (
    <Space>
        <Button type="primary" onClick={() => setWriteOpen((v) => !v)}>
        {writeOpen ? "닫기" : "글쓰기"}
        </Button>
      <Button onClick={() => router.push("/cs")}>
        1:1문의관리
      </Button>
    </Space>
  );

  // 관리자 아닐 때 렌더 방지
  if (loginRole === null) return null;
  if (!canAdmin) return null;

  return (
    <BoardCard title="FAQ - 자주 묻는 질문 (관리자)" extra={extra}>
        <Card bordered={false}>
        {/* 글쓰기 토글 폼 */}
        {writeOpen ? (
            <div style={{ marginBottom: 14 }}>
            <Card style={{ borderRadius: 12 }}>
                <Spin spinning={categoriesLoading || writeLoading}>
                <FaqForm
                    mode="write"
                    categories={categories}
                    loading={writeLoading}
                    onCancel={() => setWriteOpen(false)}
                    onSubmit={(values) => {
                    dispatch(writeFaqRequest(values));
                    setWriteOpen(false);
                    }}
                />
                </Spin>
            </Card>
            </div>
        ) : null}

        {/* 리스트 */}
        <Spin spinning={loading}>
          <BoardToggleTable
            rowKey="faqid"
            columns={columns}
            dataSource={list}
            loading={loading}
            pageNo={1}
            total={list?.length || 0}
            pageSize={9999}
            onChangePage={() => {}}
            expandRowByClick={true}
            expandedRowKeys={openId ? [openId] : []}
            onExpand={(expanded, record) => {
              dispatch(toggleFaqOpen(record.faqid));
            }}
            expandedRowRender={(record) => (
              <FaqRowToggle record={record} isAdmin={true} onEdit={onEdit} />
            )}
          />
        </Spin>
      </Card>


      {/* 수정 Modal */}
      <Modal
        open={editOpen}
        title="FAQ 수정"
        onCancel={() => {
          setEditOpen(false);
          setEditTarget(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Spin spinning={categoriesLoading || editLoading}>
          <FaqForm
            mode="edit"
            categories={categories}
            initialValues={{
              category: editTarget?.category,
              question: editTarget?.question,
              answer: editTarget?.answer,
              keywords: editTarget?.keywords,
            }}
            loading={editLoading}
            onCancel={() => {
              setEditOpen(false);
              setEditTarget(null);
            }}
            onSubmit={(values) => {
              if (!editTarget?.faqid) return;

              dispatch(
                editFaqRequest({
                  faqid: editTarget.faqid,
                  dto: values,
                })
              );

              // 성공 여부는 saga에서 재조회로 처리하고 UI만 닫음
              setEditOpen(false);
              setEditTarget(null);
            }}
          />
        </Spin>
      </Modal>
    </BoardCard>
  );
}
