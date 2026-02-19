import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, Button, Spin, message } from "antd";

export default function PetDetailPage() {
  const router = useRouter();
  const { petId } = router.query;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!petId) return; // ⭐ 중요 (Next.js 특성)

    const fetchPet = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        message.error("펫 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading || !pet) return <Spin />;

  return (
    <Card title="펫 상세 정보" style={{ maxWidth: 500, margin: "0 auto" }}>
      <p>타입: {pet.petTypeId === 1 ? "고양이" : "강아지"}</p>
      <p>이름: {pet.petName}</p>
      <p>종: {pet.petBreed}</p>
      <p>생일: {pet.birthDate}</p>
      <p>나이: {pet.page}</p>
      <p>성별: {pet.pgender}</p>

      <img
        src={`http://localhost:8484/uploads/${pet.imageUrl || "default.png"}`}
        alt={pet.petName}
        style={{ width: 200, marginTop: 10 }}
      />

      <div style={{ marginTop: 20 }}>
        <Button
            onClick={() =>
            router.push({
              pathname: "/user/mypage",
            })
          }
        >
            마이페이지
        </Button>
        <Button
          type="primary"
          onClick={() =>
            router.push({
              pathname: "/pet/edit",
              query: { petId },
            })
          }
        >
          수정
        </Button>

        <Button
          danger
          style={{ marginLeft: 10 }}
          onClick={async () => {
            try {
              await api.delete(`/api/pets/${petId}`);
              message.success("삭제되었습니다.");
              router.push("/user/mypage");
            } catch {
              message.error("삭제 실패");
            }
          }}
        >
          삭제
        </Button>
      </div>
    </Card>
  );
}
