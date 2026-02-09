// components/reviewboard/ReviewTableColumns.js

export function ratingToStar(rating) {
  if (rating === 5) return "★★★★★";
  if (rating === 4) return "★★★★☆";
  if (rating === 3) return "★★★☆☆";
  if (rating === 2) return "★★☆☆☆";
  if (rating === 1) return "★☆☆☆☆";
  return "-";
}

export default function ReviewTableColumns({
  total,
  pageNo,
  pageSize = 10,

  onPetTypeFilter,
  onBrandFilter,
  onFoodFilter,
  onTitleFilter,
}) {
  return [
    {
      title: "NO",
      key: "no",
      width: 70,
      align: "center",
      render: (_, record, idx) => total - ((pageNo - 1) * pageSize + idx),
    },

    // 펫타입 태그
    {
      title: "펫",
      dataIndex: "pettypeid",
      key: "pettypeid",
      width: 90,
      align: "center",
      render: (pettypeid) => {
        const isCat = Number(pettypeid) === 1;
        const label = isCat ? "고양이" : "강아지";

        return (
          <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPetTypeFilter?.(Number(pettypeid));
          }}

            
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              userSelect: "none",

              border: "1px solid #d9d9d9",
              background: isCat ? "#fff7e6" : "#f6ffed",
              color: "#222",
            }}
            title="클릭하면 펫타입으로 검색"
          >
            {label}
          </span>
        );
      },
    },
    // 사료 정보 (2줄, 부가정보)
    {
      title: "사료",
      key: "foodinfo",
      width: 200,
      align: "left",
      render: (_, record) => {
        const brand = record?.brandname || "";
        const food = record?.foodname || "";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              onClick={() => onBrandFilter?.(brand)}
              style={{
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "#666",
                userSelect: "none",
                width: "fit-content",
              }}
              title="클릭하면 브랜드로 검색"
            >
              {brand}
            </span>

            <span
              // onClick={() => onFoodFilter?.(food)}


              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFoodFilter?.(food);
              }}
              style={{
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                color: "#333",
                userSelect: "none",
                width: "fit-content",
              }}
              title="클릭하면 사료명으로 검색"
            >
              {food}
            </span>
          </div>
        );
      },
    },    

    // 제목
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      align: "left",
      ellipsis: true,
      render: (title) => (
        <span
          onClick={() => onTitleFilter?.(title)}
          style={{
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 14,
            color: "#111",
            letterSpacing: "-0.2px",
            userSelect: "none",
          }}
          title="클릭하면 제목으로 검색"
        >
          {title}
        </span>
      ),
    },

    // 평점
    {
      title: "평점",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      align: "center",
      render: (rating) => (
        <span
          style={{
            fontWeight: 800,
            letterSpacing: 1,
            color: "#b4b106",
          }}
        >
          {ratingToStar(Number(rating))}
        </span>
      ),
    },



    // 작성자
    {
      title: "작성자",
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
      align: "center",
      ellipsis: true,
      render: (nickname) => (
        <span style={{ fontSize: 12, color: "#333", fontWeight: 600 }}>
          {nickname || "-"}
        </span>
      ),
    },

    //작성일 + 수정일
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
}
