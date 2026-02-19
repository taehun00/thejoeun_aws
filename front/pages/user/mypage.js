import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Card, List, Spin, message } from "antd";
import { useRouter } from "next/router";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 사용자 정보와 펫 정보 병렬 호출
        const [userRes, petRes] = await Promise.all([
          api.get("/api/users/mypage"),
          api.get("/api/pets/mypage"),
        ]);

        setUser(userRes.data);
        setPets(petRes.data);
      } catch (err) {
        message.error("마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/api/users/me");
      message.success("탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      router.push("/user/signup");
    } catch (err) {
      message.error("탈퇴 실패");
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 20 }}>
      <Card title="내 정보" style={{ marginBottom: 20 }}>
        {user && (
          <>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <img
              src={`http://localhost:8484/uploads/${user.ufile || "default.png"}`}
              alt={user.nickname}
              style={{ width: 80, height: 80, borderRadius: "50%", marginRight: 15 }}
            />
            </div>
            <p>이메일: {user.email}</p>
            <p>닉네임: {user.nickname}</p>
            <p>휴대폰: {user.mobile}</p>
            <Button type="primary" onClick={() => router.push("/user/edit")}>
              정보 수정
            </Button>
            <Button danger onClick={handleDeleteAccount} style={{ marginLeft: 10 }}>
              탈퇴
            </Button>
            <Button onClick={() => router.push("/cs/myQuestion")} style={{ marginLeft: 10 }}>
              내 1:1 질문 보기
            </Button>

          </>
        )}
      </Card>

      <Card title="내 반려동물">
        <List
          dataSource={pets}
          renderItem={(pet) => (
            <List.Item key={pet.petId}>
              <Card style={{ width: "100%" }}>
                <p>타입: {pet.petTypeId === 1 ? "고양이" : "강아지"}</p>
                <p>이름: {pet.petName}</p>
                <p>종: {pet.petBreed}</p>
                <p>생일: {pet.birthDate}</p>
                <p>나이: {pet.page}</p>
                <p>성별: {pet.pgender}</p>
                <img
                  src={`http://localhost:8484/uploads/${pet.imageUrl || "default.png"}`}
                  alt={pet.petName}
                  style={{ width: 150, marginTop: 10 }}
                />
                <div style={{ marginTop: 15 }}>
                  <Button
                    type="primary"
                    onClick={() =>
                      router.push({
                        pathname: "/pet",
                        query: { petId: pet.petId },
                      })
                    }
                  >
                    상세보기
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Button
            type="dashed"
            onClick={() => router.push("/pet/new")}
            style={{ marginTop: 10 }}
        >
            반려동물 등록하기
        </Button>
      </Card>

    </div>
  );
}