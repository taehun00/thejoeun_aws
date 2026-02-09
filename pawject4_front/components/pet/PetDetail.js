export default function PetDetail({ pet, onEdit, onDelete }) {
  if (!pet) return null;

  return (
    <div>
      <img src={pet.imageUrl} width={200} />
      <p>이름: {pet.petName}</p>
      <p>종: {pet.petBreed}</p>
      <p>생일: {pet.birthDate}</p>
      <p>나이: {pet.page}</p>
      <p>성별: {pet.pgender}</p>

      <button onClick={onEdit}>수정</button>
      <button onClick={onDelete}>삭제</button>
    </div>
  );
}
