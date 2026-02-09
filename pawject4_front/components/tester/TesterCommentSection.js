// components/tester/TesterCommentSection.js
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popconfirm } from "antd";

import {
  fetchTesterCommentListRequest,
  createTesterCommentRequest,
  updateTesterCommentRequest,
  deleteTesterCommentRequest,
} from "../../reducers/tester/testerCommentReducer";

export default function TesterCommentSection({ testerid, loginRole, loginUserId }) {
  const dispatch = useDispatch();

  const {
    list,
    total,
    loading,
    error,

    writeLoading,
    writeError,

    updateLoading,
    updateError,

    deleteLoading,
    deleteError,
  } = useSelector((state) => state.testerComment);

  const [content, setContent] = useState("");

  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  //testerid 안정화 ( NaN 방지)
  const stableTesterid = useMemo(() => {
    const id = Number(testerid);
    if (!id || Number.isNaN(id)) return null;
    return id;
  }, [testerid]);

  useEffect(() => {
    if (!stableTesterid) return;


    dispatch(fetchTesterCommentListRequest({ testerid: stableTesterid }));
  }, [dispatch, stableTesterid]);

  // 작성
  const handleCreate = () => {
    if (!stableTesterid) return;
    if (!content || content.trim() === "") return;

    dispatch(
      createTesterCommentRequest({
        testerid: stableTesterid,
        content: content.trim(),
      })
    );

    setContent("");
  };

  // Enter 등록
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
  };

  // 수정 시작
  const handleEditStart = (comment) => {
    setEditId(comment?.testercommentid);
    setEditContent(comment?.content || "");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContent("");
  };

  // 수정 저장
  const handleEditSave = () => {
    if (!stableTesterid) return;
    if (!editId) return;
    if (!editContent || editContent.trim() === "") return;

    dispatch(
      updateTesterCommentRequest({
        testerid: stableTesterid,
        testercommentid: editId,
        content: editContent.trim(),
      })
    );

    setEditId(null);
    setEditContent("");
  };

  // 삭제 실행
  const handleDelete = (testercommentid) => {
    if (!stableTesterid) return;
    if (!testercommentid) return;

    dispatch(
      deleteTesterCommentRequest({
        testerid: stableTesterid,
        testercommentid,
      })
    );
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h5 style={{ marginBottom: 12 }}>댓글 ({total})</h5>

      {/* 에러 */}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {writeError && <div style={{ color: "red", marginBottom: 8 }}>{writeError}</div>}
      {updateError && <div style={{ color: "red", marginBottom: 8 }}>{updateError}</div>}
      {deleteError && <div style={{ color: "red", marginBottom: 8 }}>{deleteError}</div>}

      {/* 작성 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={content}
          placeholder="댓글을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: "10px" }}
          disabled={writeLoading}
        />

        <Button type="primary" onClick={handleCreate} loading={writeLoading}>
          등록
        </Button>
      </div>

      {/* 목록 */}
      {loading ? (
        <div>댓글 불러오는 중...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(list || []).length === 0 ? (
            <div style={{ color: "#777" }}>댓글이 없습니다.</div>
          ) : (
            (list || []).map((c) => {
              const isEdit = editId === c?.testercommentid;

              // ✅ 권한 체크 (리뷰 샘플 방식)
              const commentUserId = c?.userid ?? c?.userId ?? null;

              const canEditDelete =
                loginRole === "ROLE_ADMIN" ||
                (loginRole === "ROLE_MEMBER" &&
                  Number(commentUserId) === Number(loginUserId));

              return (
                <div
                  key={c?.testercommentid}
                  style={{
                    border: "1px solid #ddd",
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  {/* 상단 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {c?.nickname || c?.name || "익명"}
                    </div>

                    {/* 권한 있으면 버튼 */}
                    {canEditDelete && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {isEdit ? (
                          <>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSave();
                              }}
                              loading={updateLoading}
                            >
                              저장
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCancel();
                              }}
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(c);
                              }}
                            >
                              수정
                            </Button>

                            <Popconfirm
                              title="정말 삭제하시겠습니까?"
                              okText="삭제"
                              cancelText="취소"
                              onConfirm={() => handleDelete(c?.testercommentid)}
                            >
                              <Button
                                danger
                                loading={deleteLoading}
                                onClick={(e) => e.stopPropagation()}
                              >
                                삭제
                              </Button>
                            </Popconfirm>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 본문 */}
                  {isEdit ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: "100%", minHeight: 70 }}
                      disabled={updateLoading}
                    />
                  ) : (
                    <div style={{ whiteSpace: "pre-wrap" }}>{c?.content}</div>
                  )}

                  {/* 작성일 */}
                  <div style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
                    {c?.createdat || ""}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}