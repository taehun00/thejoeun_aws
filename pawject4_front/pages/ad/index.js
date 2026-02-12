import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Image, Popconfirm, message } from "antd"; // ✅ Popconfirm, message 추가
import { useRouter } from "next/router";
import {
  fetchLatestAdsRequest,
  deleteAdRequest,
} from "../../reducers/ad/adReducer";

export default function AdListPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { latestAds, loading, error } = useSelector((state) => state.ad); // ✅ error도 가져오기

  useEffect(() => {
    // ✅ 광고 목록 불러오기 (예: 최신 20개)
    dispatch(fetchLatestAdsRequest({ start: 1, end: 20 }));
  }, [dispatch]);

  // ✅ 삭제 핸들러 보완: 성공/실패 메시지 표시
  const handleDelete = (id) => {
    dispatch(deleteAdRequest({ adId: id }));
    message.success("광고가 삭제되었습니다."); // 성공 메시지
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8484";

  const columns = [
    {
      title: "이미지",
      dataIndex: "img",
      key: "img",
      render: (img, record) => {
        const imageUrl =
          record.imgUrl || (img ? `${API_URL}/upload/${img}` : null);
        return imageUrl ? (
          <Image src={imageUrl} alt={record.title} width={80} />
        ) : (
          "-"
        );
      },
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "액션",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* ✅ 수정 버튼 → /ad/edit/:id */}
          <Button
            type="link"
            onClick={() => router.push(`/ad/edit/${record.id}`)}
          >
            수정
          </Button>
          {/* ✅ 삭제 버튼 → Popconfirm으로 안전하게 처리 */}
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="예"
            cancelText="아니오"
          >
            <Button type="link" danger>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>광고 목록</h2>
      {/* ✅ 새 광고 작성 버튼 → /ad/write */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => router.push("/ad/write")}
      >
        새 광고 작성
      </Button>

      {/* ✅ 에러 메시지 표시 */}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={latestAds}
        loading={loading}
        pagination={false}
      />
    </div>
  );
}
