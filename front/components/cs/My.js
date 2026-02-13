// pages/cs/My.js
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Space, Tag, Typography } from "antd";

import BoardCard from "../../components/common/BoardCard";
import BoardToggleTable from "../../components/common/BoardToggleTable";
import {
  fetchMyCsListRequest,
  toggleOpen,
  clearOpen,
} from "../../reducers/support/csReducer";

const { Text } = Typography;

function StatusTag({ status }) {
  if (status === 1) return <Tag color="green">답변완료</Tag>;
  return <Tag color="gold">답변대기</Tag>;
}

export default function CsMyPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { myList, myLoading, myError, openIds } = useSelector((state) => state.cs);

  useEffect(() => {
    dispatch(clearOpen());
    dispatch(fetchMyCsListRequest());
  }, [dispatch]);

  const columns = useMemo(() => {
    return [
      {
        title: "NO.",
        key: "no",
        width: 80,
        align: "center",
        render: (_, __, idx) => idx + 1,
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
        title: "등록일",
        dataIndex: "createdat",
        key: "createdat",
        width: 160,
        align: "center",
      },
      {
        title: "처리여부",
        key: "status",
        width: 120,
        align: "center",
        render: (_, record) => <StatusTag status={record.status} />,
      },
    ];
  }, []);

  const expandedRowRender = (record) => {
    const answers = record.answers || [];

    return (
      <div style={{ padding: "12px 8px" }}>
        {/* 질문 내용 */}
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
      </div>
    );
  };

  return (
    <BoardCard
      title="내 1:1 문의"
      extra={
        <Space>
          <Button type="primary" onClick={() => router.push("/cs/questionWrite")}>
            문의
          </Button>
        </Space>
      }
    >
      {myError && (
        <div style={{ marginBottom: 12 }}>
          <Text type="danger">{String(myError)}</Text>
        </div>
      )}

      <BoardToggleTable
        rowKey="questionid"
        columns={columns}
        dataSource={myList}
        loading={myLoading}
        pageNo={1}
        total={myList?.length || 0}
        pageSize={9999} // 유저는 페이징 x
        onChangePage={() => {}}
        expandedRowRender={expandedRowRender}
        expandedRowKeys={openIds}
        onExpand={(expanded, record) => {
          dispatch(toggleOpen(record.questionid));
        }}
        expandRowByClick={true}
      />
    </BoardCard>
  );
}
