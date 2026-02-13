// 테이블 공통 wrapper// components/common/BoardTable.js
import { Table } from "antd";

export default function BoardTable({
  rowKey,
  columns,
  dataSource,
  loading,

  pageNo,
  total,
  pageSize = 10,
  onChangePage,
}) {
  return (
    <Table
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
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
