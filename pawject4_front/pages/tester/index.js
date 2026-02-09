// pages/tester/index.js
import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Select, Space, Spin, Alert } from "antd";

import BoardCard from "../../components/common/BoardCard";
import BoardSearchBar from "../../components/common/BoardSearchBar";

import TesterTable from "../../components/tester/TesterTable";

import {
  setMode,
  setPageNo,
  setCondition,
  setKeyword,
  setSearchType,
  resetSearchState,
  fetchTesterListRequest,
  searchTesterRequest,
} from "../../reducers/tester/testerReducer";

import { 
  countLikesTesterRequest 
} from "../../reducers/like/likeReducer";

import { parseJwt } from "../../utils/jwt";

const { Option } = Select;

export default function TesterIndexPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    list,
    total,
    paging,
    loading,
    error,

    mode,
    pageNo,

    keyword,
    searchType,

    condition,
  } = useSelector((state) => state.tester);

  // 좋아요 수 state
  const { testerLikes } = useSelector(state => state.likes);
  
  // 관리자 판별
  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setLoginRole(payload?.role ?? null);
  }, []);

  const canAdmin = loginRole === "ROLE_ADMIN";
  const writeBtnText = canAdmin ? "글쓰기" : "후기작성";

  // 현재 페이지
  const currentPage = useMemo(() => {
    return paging?.current || paging?.pstartno || paging?.pageNo || pageNo || 1;
  }, [paging, pageNo]);

  // 최초 목록
  useEffect(() => {
    dispatch(fetchTesterListRequest({ pageNo: 1, condition: condition || "new" }));
  }, []); // eslint-disable-line

  // 목록 조회
  const fetchList = useCallback(
    (nextPageNo, nextCondition) => {
      dispatch(fetchTesterListRequest({ pageNo: nextPageNo, condition: nextCondition }));
    },
    [dispatch]
  );

  // 검색 조회
  const fetchSearch = useCallback(
    (nextPageNo, nextCondition) => {
      dispatch(
        searchTesterRequest({
          keyword,
          searchType,
          pageNo: nextPageNo,
          condition: nextCondition,
        })
      );
    },
    [dispatch, keyword, searchType]
  );

  // 검색 실행
  const onSearch = useCallback(() => {
    dispatch(setPageNo(1));
    dispatch(setMode("search"));

    fetchSearch(1, condition || "new");
  }, [dispatch, fetchSearch, condition]);

  // 목록으로
  const onBackToList = useCallback(() => {
    dispatch(resetSearchState());
    dispatch(setCondition("new"));
    dispatch(setPageNo(1));

    fetchList(1, "new");
  }, [dispatch, fetchList]);

  // 정렬/필터 변경
  const onChangeCondition = useCallback(
    (v) => {
      const nextCondition = v || "new";

      dispatch(setCondition(nextCondition));
      dispatch(setPageNo(1));

      if (mode === "search") {
        fetchSearch(1, nextCondition);
      } else {
        fetchList(1, nextCondition);
      }
    },
    [dispatch, mode, fetchList, fetchSearch]
  );

  // 페이지 변경
  const onChangePage = useCallback(
    (nextPage) => {
      dispatch(setPageNo(nextPage));

      if (mode === "search") {
        fetchSearch(nextPage, condition || "new");
      } else {
        fetchList(nextPage, condition || "new");
      }
    },
    [dispatch, mode, condition, fetchList, fetchSearch]
  );

  // ===========================
  // ❤️ 좋아요 수 조회
  // ===========================
  useEffect(() => {
    if (!list || list.length === 0) return;

    list.forEach(t => {
      dispatch(countLikesTesterRequest({ testerId: t.testerid }));
    });
  }, [list, dispatch]);

  // ===========================
  // list에 likeCount 추가
  // ===========================
  const listWithLikes = useMemo(() => {
    return (list || []).map(t => ({
      ...t,
      likeCount: testerLikes?.[t.testerid] ?? 0,
    }));
  }, [list, testerLikes]);

  return (
    <BoardCard
      title="체험단 게시판"
      extra={
        <Space>
          <Button type="primary" onClick={() => router.push("/tester/write")}>
            {writeBtnText}
          </Button>
        </Space>
      }
    >
      {/* 로딩/에러 */}
      {error && (
        <div style={{ marginBottom: 12 }}>
          <Alert type="error" showIcon message={String(error)} />
        </div>
      )}

      {/* 정렬 */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Space>
          <Button
            type={condition !== "openOnly" && condition !== "closeOnly" ? "primary" : "default"}
            onClick={() => onChangeCondition("new")}
          >
            전체
          </Button>

          <Button
            type={condition === "openOnly" ? "primary" : "default"}
            onClick={() => onChangeCondition("openOnly")}
          >
            모집중
          </Button>

          <Button
            type={condition === "closeOnly" ? "primary" : "default"}
            onClick={() => onChangeCondition("closeOnly")}
          >
            모집완료
          </Button>
        </Space>

        <Select
          value={["openOnly", "closeOnly"].includes(condition) ? "new" : condition || "new"}
          onChange={onChangeCondition}
          style={{ width: 180 }}
        >
          <Option value="new">최신</Option>
          <Option value="old">오래된순</Option>
        </Select>
      </div>

      {/* table */}
      {loading && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin />
        </div>
      )}

      {/*  Table */}
      <TesterTable
        list={listWithLikes}
        //list={list || []}
        loading={loading}
        total={total || 0}
        pageNo={currentPage}
        pageSize={20}
        testerLikes={testerLikes}
        onChangePage={onChangePage}
        onOpenDetail={(testerid) => router.push(`/tester/detail/${testerid}`)} // 제목 클릭 시 이동
      />

      {/* 검색바 */}
      <BoardSearchBar
        searchType={searchType}
        setSearchType={(v) => dispatch(setSearchType(v))}
        keyword={keyword}
        setKeyword={(v) => dispatch(setKeyword(v))}
        onSearch={onSearch}
        onBackToList={onBackToList}
        showBackToList={mode === "search"}
        searchTypeOptions={[
          { value: "all", label: "제목+내용" },
          { value: "title", label: "제목" },
          { value: "content", label: "내용" },
          { value: "nickname", label: "작성자" },
        ]}
      />
    </BoardCard>
  );
}
