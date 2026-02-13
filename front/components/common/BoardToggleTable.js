// components/common/BoardToggleTable.js
import { Table } from "antd";

/**
 * 토글(확장 row) 전용 공용 테이블
 *
 * props
 * - rowKey
 * - columns
 * - dataSource
 * - loading
 * - pageNo, total, pageSize, onChangePage
 *
 * - expandedRowRender: (record) => ReactNode
 * - rowExpandable?: (record) => boolean
 *
 * 추가(컨트롤 토글용)
 * - expandedRowKeys?: array
 * - onExpand?: (expanded, record) => void
 * - expandRowByClick?: boolean
 * - onExpandedRowsChange?: (keys) => void
 */
export default function BoardToggleTable({
  rowKey,
  columns,
  dataSource,
  loading,

  pageNo,
  total,
  pageSize = 10,
  onChangePage,

  // 토글 전용
  expandedRowRender,
  rowExpandable,

  expandedRowKeys,
  onExpand,
  expandRowByClick = false,
  onExpandedRowsChange,
}) {
  return (
    <Table
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 900 }}
        expandable={{
        expandedRowRender,
        rowExpandable: rowExpandable || (() => true),

        expandedRowKeys,
        onExpand,
        expandRowByClick,

        expandIcon: () => null,      // 아이콘 제거
        expandColumnWidth: 0,        // 공간 제거
        }}
      pagination={{
        current: pageNo,
        total,
        pageSize,
        showSizeChanger: false,
        onChange: onChangePage,
        position: ["bottomCenter"],
      }}
    />
  );
}