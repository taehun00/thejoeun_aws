// pages/foodboard/index.js
//기본
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
//엔트디자인
import { Button, Select, Spin, Alert, message } from "antd";
//공통부품
import BoardCard from "../../components/common/BoardCard";
import BoardSearchBar from "../../components/common/BoardSearchBar";
import BoardTable from "../../components/common/BoardTable";
//사료게시판전용
import FoodTableColumns from "../../components/foodboard/FoodTableColumns";

import {
  fetchFoodsRequest,
  searchFoodsRequest,
  setCondition,
  quickDeleteFoodRequest,
} from  "../../reducers/food/foodReducer";
const { Option } = Select;

export default function FoodBoardIndex() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    foods,
    total,
    mode,
    pageNo,
    condition,
    loading,
    error,
    deleteLoading,
    deleteError,
  } = useSelector((state) => state.food);

  const [searchType, setSearchTypeUI] = useState("all");
  const [keyword, setKeywordUI] = useState("");

  const isSearchMode = useMemo(() => mode === "search", [mode]);
  const pageSize = 10;

  // 초기 목록
  useEffect(() => {
    dispatch(fetchFoodsRequest({ pageNo: 1, condition }));
  }, []);

  // 정렬 변경 시 재조회
  useEffect(() => {
    if (isSearchMode) {
      dispatch(
        searchFoodsRequest({
          keyword: keyword.trim(),
          searchType,
          pageNo: 1,
          condition,
        })
      );
    } else {
      dispatch(fetchFoodsRequest({ pageNo: 1, condition }));
    }
  }, [condition]);

  useEffect(() => {
    if (deleteError) message.error(deleteError);
  }, [deleteError]);

  const onSearch = () => {
    const kw = keyword.trim();
    if (!kw) {
      message.warning("검색어를 입력해주세요.");
      return;
    }
    dispatch(searchFoodsRequest({ keyword: kw, searchType, pageNo: 1, condition }));
  };

  const onBackToList = () => {
    setKeywordUI("");
    setSearchTypeUI("all");
    dispatch(fetchFoodsRequest({ pageNo: 1, condition }));
  };

  const onChangePage = (p) => {
    if (isSearchMode) {
      dispatch(searchFoodsRequest({ keyword: keyword.trim(), searchType, pageNo: p, condition }));
    } else {
      dispatch(fetchFoodsRequest({ pageNo: p, condition }));
    }
  };

  const onMoveDetail = (foodid) => {
    router.push(`/foodboard/detail/${foodid}`);
  };

  const onQuickDelete = (foodid) => {
    dispatch(quickDeleteFoodRequest({ foodid }));
  };

//펫타입 서치
const onPetTypeFilter = (pettypeid) => {
  const label = pettypeid === 1 ? "고양이" : "강아지";

  setSearchTypeUI("pettypeid");
  setKeywordUI(label);

  dispatch(
    searchFoodsRequest({
      keyword: label,        
      searchType: "pettypeid",
      pageNo: 1,
      condition,
    })
  );
};

//브랜드 서치
const onBrandFilter = (brandname) => {
  dispatch(  //검색모드 전환
    searchFoodsRequest({
      keyword: String(brandname),  
      searchType: "brandname",
      pageNo: 1,
      condition,
    })
  );

  // UI도 같이 맞춰주면 혼란 없음
  setSearchTypeUI("brandname");
  setKeywordUI(String(brandname));
};



  const columns = FoodTableColumns({
    total,
    pageNo,
    pageSize,
    onMoveDetail,
    onQuickDelete,
    deleteLoading,
    onPetTypeFilter,
    onBrandFilter
  });

  const searchTypeOptions = [
    { value: "all", label: "전체" },
    { value: "pettypeid", label: "반려동물 종" },
    { value: "brandname", label: "브랜드명" },
    { value: "foodname", label: "사료명" },
  ];

  if (loading && foods.length === 0) return <Spin tip="불러오는 중..." />;
  if (error) return <Alert type="error" message="목록 조회 실패" description={error} />;





  ///뷰 파트
  return (
    <BoardCard
      title="사료 정보"
      extra={
        <Button type="primary" onClick={() => router.push("/foodboard/write")}>
          사료 등록
        </Button>
      }
    >
      {/* 정렬 */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Select
          value={condition}
          onChange={(v) => dispatch(setCondition(v))}
          style={{ width: 160 }}
        >
          <Option value="">최신</Option>
          <Option value="foodnameAsc">사료명</Option>
          <Option value="foodnameDesc">사료역순</Option>
          <Option value="brandnameAsc">브랜드명</Option>
          <Option value="brandnameDesc">브랜드역순</Option>
        </Select>
      </div>


      {/* 테이블 */}
      <BoardTable
        rowKey="foodid"
        columns={columns}
        dataSource={foods}
        loading={loading}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        onChangePage={onChangePage}
      />

            {/* 검색 */}
      <BoardSearchBar
        searchType={searchType}
        setSearchType={setSearchTypeUI}
        keyword={keyword}
        setKeyword={setKeywordUI}
        searchTypeOptions={searchTypeOptions}
        onSearch={onSearch}
        showBackToList={isSearchMode}
        onBackToList={onBackToList}
      />
    </BoardCard>
  );
}
