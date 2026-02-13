// pages/cs/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, message } from "antd";

import BoardCard from "../../components/common/BoardCard";
import AdminCsToolbar from "../../components/cs/AdminCsToolbar";
import AdminCsTable from "../../components/cs/AdminCsTable";

import {
  fetchCsPagedRequest,
  searchCsRequest,
  setSearchType,
  setKeyword,
  setCondition,
  toggleOpen,
  clearOpen,
  setPageNo,
  setAnswerDraft,
  writeAnswerRequest,
  quickAnswerRequest,
  setMode,
  clearAnswerDraft,

  toggleWriteOpen,
  clearWriteOpen,
} from "../../reducers/support/csReducer";

const { Text } = Typography;

export default function CsAdminIndexPage() {
  const dispatch = useDispatch();

  const {
    list,
    total,
    loading,

    mode,
    pageNo,
    searchType,
    keyword,
    condition,

    // 질문/답변 보기
    openIds,

    // 답변작성창 보기
    writeOpenIds,

    answerDraft,
    answerWriteLoading,
    answerWriteError,
    quickLoading,
  } = useSelector((state) => state.cs);

  // 초기 로드
  useEffect(() => {
    dispatch(clearOpen());
    dispatch(clearWriteOpen());
    dispatch(fetchCsPagedRequest({ pageNo: 1, condition }));
  }, [dispatch]);

useEffect(() => {
  console.log("cs list sample:", list?.[0]);
}, [list]);

  // 답변 등록 에러 표시
  useEffect(() => {
    if (answerWriteError) message.error(String(answerWriteError));
  }, [answerWriteError]);

  // 검색
  const onSearch = () => {
    const kw = (keyword || "").trim();
    if (!kw) {
      message.warning("검색어를 입력해주세요.");
      return;
    }

    dispatch(clearOpen());
    dispatch(clearWriteOpen());
    dispatch(setPageNo(1));
    dispatch(setMode("search"));

    dispatch(
      searchCsRequest({
        searchType,
        keyword: kw,
        pageNo: 1,
        condition,
      })
    );
  };

  // 목록보기
  const onBackToList = () => {
    dispatch(clearOpen());
    dispatch(clearWriteOpen());
    dispatch(setMode("list"));
    dispatch(setPageNo(1));
    dispatch(fetchCsPagedRequest({ pageNo: 1, condition }));
  };

  // 정렬(condition)
  const onChangeCondition = (v) => {
    dispatch(setCondition(v));
    dispatch(clearOpen());
    dispatch(clearWriteOpen());
    dispatch(setPageNo(1));

    if (mode === "search") {
      const kw = (keyword || "").trim();
      if (!kw) {
        dispatch(setMode("list"));
        dispatch(fetchCsPagedRequest({ pageNo: 1, condition: v }));
        return;
      }

      dispatch(
        searchCsRequest({
          searchType,
          keyword: kw,
          pageNo: 1,
          condition: v,
        })
      );
    } else {
      dispatch(fetchCsPagedRequest({ pageNo: 1, condition: v }));
    }
  };

  // 페이징
  const onChangePage = (p) => {
    dispatch(setPageNo(p));
    dispatch(clearOpen());
    dispatch(clearWriteOpen());

    if (mode === "search") {
      dispatch(
        searchCsRequest({
          searchType,
          keyword,
          pageNo: p,
          condition,
        })
      );
    } else {
      dispatch(fetchCsPagedRequest({ pageNo: p, condition }));
    }
  };

  // 답변상태 토글
  const onQuickAnswer = ({ questionid }) => {
    dispatch(quickAnswerRequest({ questionid }));

    setTimeout(() => {
      if (mode === "search") {
        dispatch(
          searchCsRequest({
            searchType,
            keyword,
            pageNo,
            condition,
          })
        );
      } else {
        dispatch(fetchCsPagedRequest({ pageNo, condition }));
      }
    }, 120);
  };

  // 질문/답변 보기 토글
  const onToggleOpen = (questionid) => {
    dispatch(toggleOpen(questionid));
  };

  // 답변작성창 토글(버튼)
  const onToggleWriteOpen = (questionid) => {
    dispatch(toggleWriteOpen(questionid));
  };

  // 답변 draft 입력
  const onChangeAnswerDraft = (questionid, value) => {
    dispatch(setAnswerDraft({ questionid, value }));
  };

  // 답변 등록
  const onSubmitAnswer = ({ questionid, answercontent }) => {
    dispatch(
      writeAnswerRequest({
        questionid,
        answercontent,
      })
    );

    // 작성 완료 후: draft 삭제
    dispatch(clearAnswerDraft({ questionid }));

    // 작성창 닫기
    if (writeOpenIds.includes(questionid)) {
      dispatch(toggleWriteOpen(questionid));
    }

    // 질문 토글 닫기
    if (openIds.includes(questionid)) {
      dispatch(toggleOpen(questionid));
    }

    // 목록 갱신
    setTimeout(() => {
      if (mode === "search") {
        dispatch(
          searchCsRequest({
            searchType,
            keyword,
            pageNo,
            condition,
          })
        );
      } else {
        dispatch(fetchCsPagedRequest({ pageNo, condition }));
      }
    }, 150);
  };

  return (
    <BoardCard
      title="1:1 문의 관리"
      extra={<Text type="secondary">관리자 전용</Text>}
    >
      <AdminCsToolbar
        searchType={searchType}
        setSearchType={(v) => dispatch(setSearchType(v))}
        keyword={keyword}
        setKeyword={(v) => dispatch(setKeyword(v))}
        mode={mode}
        condition={condition}
        setCondition={onChangeCondition}
        onSearch={onSearch}
        onBackToList={onBackToList}
      />

      <AdminCsTable
        list={list}
        total={total}
        loading={loading}
        pageNo={pageNo}
        pageSize={10}
        onChangePage={onChangePage}
        openIds={openIds}
        onToggleOpen={onToggleOpen}

        writeOpenIds={writeOpenIds}
        onToggleWriteOpen={onToggleWriteOpen}

        onQuickAnswer={onQuickAnswer}
        quickLoading={quickLoading}
        answerDraft={answerDraft}
        onChangeAnswerDraft={onChangeAnswerDraft}
        onSubmitAnswer={onSubmitAnswer}
        answerWriteLoading={answerWriteLoading}
      />
    </BoardCard>
  );
}
