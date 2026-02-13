// components/cs/AdminCsTable.js
import { useMemo } from "react";
import { Button, Input, Typography } from "antd";
import BoardToggleTable from "../common/BoardToggleTable";
import AnswerStatusToggleButton from "../cs/AnswerStatusToggleButton";

const { Text } = Typography;

export default function AdminCsTable({
  list = [],
  total = 0,
  loading = false,

  pageNo = 1,
  pageSize = 10,
  onChangePage,

  openIds = [],
  onToggleOpen,

  writeOpenIds = [],
  onToggleWriteOpen,

  onQuickAnswer,

  answerDraft = {},
  onChangeAnswerDraft,
  onSubmitAnswer,

  quickLoading = false,
  answerWriteLoading = false,
}) {
  const columns = useMemo(() => {
    return [
      {
        title: "NO.",
        key: "no",
        width: 80,
        align: "center",
        render: (_, __, idx) => total - ((pageNo - 1) * pageSize + idx),
      },
      {
        title: "분류",
        dataIndex: "category",
        key: "category",
        width: 120,
        align: "center",
      },
      {
        title: "질문",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
      },
      {
        title: "닉네임",
        dataIndex: "nickname",
        key: "nickname",
        width: 120,
        align: "center",
      },
      {
        title: "등록일",
        dataIndex: "createdat",
        key: "createdat",
        width: 160,
        align: "center",
      },

      // 처리여부
      {
        title: "답변 상태",
        key: "status",
        width: 150,
        align: "center",
        render: (_, record) => (
          <AnswerStatusToggleButton
            questionid={record.questionid}
            status={record.status}
            loading={quickLoading}
            onToggle={(qid) => {
              if (!confirm("답변 상태를 변경하시겠습니까?")) return;
              onQuickAnswer?.({ questionid: qid });
            }}
          />
        ),
      },

      {
        title: "답변작성",
        key: "answer",
        width: 130,
        align: "center",
        render: (_, record) => (
          <Button
            size="small"
            disabled={record.status === 1}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWriteOpen?.(record.questionid);
            }}
          >
            답변작성
          </Button>
        ),
      },
    ];
  }, [
    total,
    pageNo,
    pageSize,
    onQuickAnswer,
    onToggleWriteOpen,
    quickLoading,
  ]);

  const expandedRowRender = (record) => {
    const qid = record.questionid;
    const answers = record.answers || [];
    const draft = answerDraft?.[qid] ?? "";

    const isWriteOpen = writeOpenIds.includes(qid);

    return (
      <div style={{ padding: "12px 8px" }}>
        {/* 질문 */}
        <div style={{ marginBottom: 12 }}>
          <Text strong>[질문]</Text>
          <div style={{ paddingTop: 6, whiteSpace: "pre-wrap" }}>
            {record.content}
          </div>
        </div>

        {/* 답변 */}
        <div style={{ marginBottom: 12 }}>
          {answers.length === 0 ? (
            <div style={{ marginTop: 6 }}>
              <Text type="secondary">답변 대기 중입니다</Text>
            </div>
          ) : (
            <div style={{ marginTop: 6 }}>
              {answers.map((a) => (
                <div key={a.answerid} style={{ marginBottom: 10 }}>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    <Text strong>[답변]</Text> {a.answercontent}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">[작성일] {a.createdat}</Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 인라인 답변 작성 (버튼 눌렀을 때만 + 미답변만) */}
        {record.status === 0 && isWriteOpen && (
          <div style={{ marginTop: 10 }}>
            <Text strong>답변 작성</Text>

            <div style={{ marginTop: 8 }}>
              <Input.TextArea
                value={draft}
                rows={4}
                placeholder="답변을 입력해 주세요"
                onChange={(e) => onChangeAnswerDraft?.(qid, e.target.value)}
              />
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Button
                type="primary"
                loading={answerWriteLoading}
                onClick={() => {
                  if (!draft.trim()) {
                    alert("답변 내용을 입력해 주세요.");
                    return;
                  }
                  if (
                    !confirm("답변을 등록하면 수정할 수 없습니다.\n등록하시겠습니까?")
                  ) {
                    return;
                  }

                  onSubmitAnswer?.({
                    questionid: qid,
                    answercontent: draft.trim(),
                  });
                }}
              >
                작성완료
              </Button>

              <Button onClick={() => onChangeAnswerDraft?.(qid, "")}>
                초기화
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <BoardToggleTable
      rowKey="questionid"
      columns={columns}
      dataSource={list}
      loading={loading}
      pageNo={pageNo}
      total={total}
      pageSize={pageSize}
      onChangePage={onChangePage}
      expandedRowRender={expandedRowRender}
      expandedRowKeys={openIds}
      onExpand={(expanded, record) => {
        onToggleOpen?.(record.questionid);
      }}
      expandRowByClick={true}
    />
  );
}
