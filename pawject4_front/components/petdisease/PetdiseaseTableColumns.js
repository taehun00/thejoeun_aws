// components/petdisease/PetdiseaseTableColumns.js
import { Tag } from "antd";
import PetdiseaseCardCover from "./PetdiseaseCardCover";

/**
 * Petdisease BoardToggleTable columns
 *
 * props
 * - total, pageNo, pageSize
 * - pettypeid
 * - onOpenDetail(disno)
 */
export default function PetdiseaseTableColumns({
  total,
  pageNo,
  pageSize = 10,

  pettypeid,
  onOpenDetail,
}) {
  const pettypeLabel = pettypeid === 1 ? "고양이" : pettypeid === 2 ? "강아지" : "반려동물";

  return [
    {
      title: "NO",
      key: "no",
      width: 70,
      align: "center",
      render: (_, __, idx) => total - ((pageNo - 1) * pageSize + idx),
    },

    {
      title: "질환정보",
      key: "card",
      render: (_, record) => (
        <PetdiseaseCardCover
          item={record}
          pettypeLabel={pettypeLabel}
          onOpen={(disno) => onOpenDetail?.(disno)}
        />
      ),
    },

    // 펫타입 태그 
    {
      title: "종류",
      dataIndex: "pettypeid",
      key: "pettypeid",
      width: 120,
      align: "center",
      render: () => <Tag color="blue">{pettypeLabel}</Tag>,
    },
  ];
}
