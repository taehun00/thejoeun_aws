// components/ad/AdManagementPage.js
// 광고 통합관리
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdRequest, deleteAdRequest, clearAdError } from '../../reducers/ad/adReducer';
import { Empty, Spin, message } from 'antd';
import AdForm from './AdForm';
import AdItem from './AdItem';
import AppLayout from './AppLayout';

const AdManagementPage = () => {
  const dispatch = useDispatch();
  const { ads, loading, error, currentAd } = useSelector((state) => state.ad);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (error) {
      message.error(`에러 발생: ${error}`);
      dispatch(clearAdError());
    }
  }, [error, dispatch]);

  const handleDelete = (adId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      dispatch(deleteAdRequest({ adId }));
    }
  };

  const handleEdit = (adId) => {
    dispatch(fetchAdRequest({ adId }));
    setIsEditing(true);
  };

  return (
    <AppLayout>
      <AdForm 
        isEditing={isEditing} 
        currentAd={currentAd} 
        setIsEditing={setIsEditing} 
      />
      
      <div style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 16 }}>등록된 광고 목록</h2>
        {loading && <Spin tip="데이터 로딩 중..." style={{ display: 'block', margin: '20px auto' }} />}
        
        {ads && ads.length > 0 ? (
          ads.map((ad) => (
            <AdItem 
              key={ad.id} 
              ad={ad} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />
          ))
        ) : (
          !loading && <Empty description="등록된 광고가 없습니다." />
        )}
      </div>
    </AppLayout>
  );
};

export default AdManagementPage;
