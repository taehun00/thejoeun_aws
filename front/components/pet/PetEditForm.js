export default function PetEditForm({ form, onChange, onFileChange, onSubmit, loading }) {
  return (
    <div>
      <input value={form.petName || ""} onChange={(e)=>onChange("petName", e.target.value)} />
      <input value={form.petBreed || ""} onChange={(e)=>onChange("petBreed", e.target.value)} />
      <input type="date" value={form.birthDate || ""} onChange={(e)=>onChange("birthDate", e.target.value)} />
      <input value={form.page || ""} onChange={(e)=>onChange("page", e.target.value)} />
      <select value={form.pgender || ""} onChange={(e)=>onChange("pgender", e.target.value)}>
        <option value="M">수컷</option>
        <option value="F">암컷</option>
      </select>

      <input type="file" onChange={onFileChange} />

      <button onClick={onSubmit} disabled={loading}>저장</button>
    </div>
  );
}
