// pages/admin/testReports.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function TestReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 관리자 토큰 필요
    axios
      .get("http://localhost:8484/api/admin/reports?page=0&size=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>테스트용 관리자 신고 목록</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
