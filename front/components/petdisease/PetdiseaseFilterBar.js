// components/petdisease/PetdiseaseFilterBar.js
import { Button, Input, Radio, Select, Space, Typography } from "antd";
import {
  SearchOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

/**
 * 질환정보 검색/필터 바
 *
 * props
 * - pettypeid, onChangePettypeid
 * - condition, onChangeCondition
 * - keyword, onChangeKeyword
 * - onSearch
 * - onBackToList
 * - showBackToList
 *
 * (관리자 옵션)
 * - isAdmin
 * - onOpenWrite
 */
export default function PetdiseaseFilterBar({
  pettypeid,
  onChangePettypeid,

  condition,
  onChangeCondition,

  keyword,
  onChangeKeyword,

  onSearch,
  onBackToList,
  showBackToList = false,

  isAdmin = false,
  onOpenWrite,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
      {/* 좌측: 펫타입 + 정렬 */}
      <Space wrap>
        <Text strong>종류</Text>
        <Radio.Group
          value={pettypeid}
          onChange={(e) => onChangePettypeid?.(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value={1}>고양이</Radio.Button>
          <Radio.Button value={2}>강아지</Radio.Button>
        </Radio.Group>

        <Text strong style={{ marginLeft: 6 }}>
          정렬
        </Text>
        <Select
          value={condition}
          onChange={(v) => onChangeCondition?.(v)}
          style={{ width: 180 }}
        >
          <Option value="new">최신순</Option>
          <Option value="old">오래된순</Option>
          <Option value="disnameAsc">질환명 ↑</Option>
          <Option value="disnameDesc">질환명 ↓</Option>
        </Select>
      </Space>

      {/* 우측: 검색 + 버튼 */}
      <Space wrap>
        <Input
          value={keyword}
          onChange={(e) => onChangeKeyword?.(e.target.value)}
          placeholder="질환명 검색"
          style={{ width: 260 }}
          onPressEnter={onSearch}
          allowClear
        />

        <Button icon={<SearchOutlined />} onClick={onSearch}>
          검색
        </Button>

        {showBackToList && (
          <Button icon={<UnorderedListOutlined />} onClick={onBackToList}>
            목록
          </Button>
        )}

        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenWrite}
          >
            등록
          </Button>
        )}
      </Space>
    </div>
  );
}
