const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 24,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 600,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: "12px 0",
    backgroundColor: "#1677ff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 500,
  },
};


function EditForm({
  form,
  onChange,
  onFileChange,
  onSubmit,
  loading,
}) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내 정보 수정</h2>

      <div style={styles.field}>
        <label>새 비밀번호</label>
        <input
          type="password"
          placeholder="변경 시에만 입력"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label>닉네임</label>
        <input
          value={form.nickname}
          onChange={(e) => onChange("nickname", e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label>휴대폰</label>
        <input
          value={form.mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label>프로필 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}

export default EditForm;
