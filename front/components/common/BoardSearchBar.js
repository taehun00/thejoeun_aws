// components/common/BoardSearchBar.js
//Card 공통 레이아웃
import { Button, Input, Select } from "antd";

const { Option } = Select;

export default function BoardSearchBar({
  searchType,
  setSearchType,
  keyword,
  setKeyword,

  searchTypeOptions = [],
  onSearch,
  onBackToList,
  showBackToList = false,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
      <Select
        value={searchType}
        onChange={(v) => setSearchType(v)}
        style={{ width: 170 }}
      >
        {searchTypeOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>

      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어 입력"
        style={{ width: 320 }}
        onPressEnter={onSearch}
      />

      <Button onClick={onSearch}>검색</Button>

      {showBackToList && (
        <Button onClick={onBackToList}>목록보기</Button>
      )}
    </div>
  );
}
