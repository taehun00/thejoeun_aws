// components/cs/AdminCsToolbar.js
import { Button, Select, Space } from "antd";
import BoardSearchBar from "../common/BoardSearchBar";

const { Option } = Select;

export default function AdminCsToolbar({
  // search ui state
  searchType,
  setSearchType,
  keyword,
  setKeyword,

  // mode
  mode = "list", // "list" | "search"

  // condition
  condition = "",
  setCondition,

  // handlers
  onSearch,
  onBackToList,
}) {
  const searchTypeOptions = [
    { value: "", label: "제목+내용" },  
    { value: "title", label: "제목" },
    { value: "content", label: "내용" },
    { value: "nickname", label: "닉네임" },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        {/* 검색바 + 목록보기 */}
        <BoardSearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          keyword={keyword}
          setKeyword={setKeyword}
          searchTypeOptions={searchTypeOptions}
          onSearch={onSearch}
          onBackToList={onBackToList}
          showBackToList={mode === "search"}
        />

        {/* 정렬(condition) */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Select
            value={condition}
            onChange={(v) => setCondition(v)}
            style={{ width: 140 }}
          >
            <Option value="">최신</Option>
            <Option value="noanswer">답변대기</Option>
            <Option value="answerend">답변완료</Option>
          </Select>

          {/* 필요 시 버튼 추가 자리 확보용 */}
          <Button style={{ visibility: "hidden" }}>space</Button>
        </div>
      </Space>
    </div>
  );
}
