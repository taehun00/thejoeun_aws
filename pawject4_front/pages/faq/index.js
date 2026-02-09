import { useEffect, useMemo, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, message } from "antd";

//공용
import BoardCard from "../../components/common/BoardCard";
import BoardToggleTable from "../../components/common/BoardToggleTable";
//권한
import { parseJwt } from "../../utils/jwt";
//커스텀
import FaqRowToggle from "../../components/support/FaqRowToggle";
import HelpBox from "../../components/support/HelpBox";

import {
  fetchFaqUserRequest,
  toggleFaqOpen,
  resetFaqErrors,
} from "../../reducers/support/faqReducer";

export default function FaqIndexPage() {
  const dispatch = useDispatch();

  const faq = useSelector((s) => s.faq);

  const {
    list,
    loading,
    openId,

    error,
  } = faq;

  // 최초 진입 - 유저용 활성 FAQ만
  useEffect(() => {
    dispatch(fetchFaqUserRequest());
  }, [dispatch]);

  // 에러 토스트
  useEffect(() => {
    if (error) message.error(error);
    if (error) dispatch(resetFaqErrors());
  }, [error, dispatch]);

  const columns = useMemo(() => {
    return [
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
    ];
  }, []);


  //로그인 확인
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setIsLogin(!!payload);
    }, []);

  // 채널톡
  const onOpenChat = () => {
    try {
      if (typeof window !== "undefined" && window.ChannelIO) {
        // show deprecated 경고 떠도 동작은 함
        // 권장: showMessenger
        window.ChannelIO("showMessenger");
      } else {
        message.warning("채팅 위젯이 아직 로드되지 않았습니다.");
      }
    } catch (e) {
      message.error("채팅 열기 실패");
    }
  };

  return (
    <BoardCard title="FAQ - 자주 묻는 질문">
      <Card bordered={false}>
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
              <FaqRowToggle
                record={record}
                isAdmin={false}
              />
            )}
          />
        </Spin>
      </Card>

      {/* 유저 전용 도움 박스 - 로그인 필요 */}
      <HelpBox onOpenChat={onOpenChat} isLogin={isLogin} />
    </BoardCard>
  );
}
