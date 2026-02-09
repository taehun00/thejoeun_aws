// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAdRequest, deleteAdRequest, clearAdError } from '../../reducers/ad/adReducer';
// import AdForm from './AdForms';
// import AdItem from './AdItems';

// const AdManagementPage = () => {
//   const dispatch = useDispatch();
//   // Reducer에서 초기설정한 initialState 값들을 가져옵니다
//   const { ads, loading, error, currentAd } = useSelector((state) => state.ad);
//   const [isEditing, setIsEditing] = useState(false);

//   // 에러 상태 처리: error 값이 존재하면 알림을 띄우고 상태를 초기화합니다
//   useEffect(() => {
//     if (error) {
//       alert(`에러 발생: ${error}`);
//       dispatch(clearAdError());
//     }
//   }, [error, dispatch]);

//   const handleDelete = (adId) => {
//     if (window.confirm('정말 삭제하시겠습니까?')) {
//       // deleteAdRequest 액션을 디스패치하여 Saga를 실행합니다
//       dispatch(deleteAdRequest({ adId }));
//     }
//   };

//   const handleEdit = (adId) => {
//     // 특정 광고 정보를 불러오기 위해 fetchAdRequest를 호출합니다
//     dispatch(fetchAdRequest({ adId }));
//     setIsEditing(true);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       <h1>광고 관리 시스템</h1>
      
//       {/* 폼 섹션: 등록과 수정을 동시에 처리 */}
//       <section style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
//         <h2>{isEditing ? '광고 수정' : '새 광고 등록'}</h2>
//         <AdForm 
//           isEditing={isEditing} 
//           currentAd={currentAd} 
//           setIsEditing={setIsEditing} 
//         />
//       </section>

//       <hr />

//       {/* 리스트 섹션 */}
//       <section>
//         <h2>광고 목록</h2>
//         {loading && <p>데이터 처리 중...</p>}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {ads && ads.length > 0 ? (
//             ads.map((ad) => (
//               <AdItem 
//                 key={ad.id} 
//                 ad={ad} 
//                 onDelete={handleDelete} 
//                 onEdit={handleEdit} 
//               />
//             ))
//           ) : (
//             <p>등록된 광고가 없습니다.</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AdManagementPage;