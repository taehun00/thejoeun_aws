// pages/ad/adform.js
// 광고 입력 폼

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAdRequest, updateAdRequest } from '../../reducers/ad/adReducer';

const AdForm = ({ isEditing, currentAd, setIsEditing }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // 수정 모드 시 기존 광고 정보를 입력란에 채워넣음
  useEffect(() => {
    if (isEditing && currentAd) {
      setTitle(currentAd.title || '');
      setContent(currentAd.content || '');
    }
  }, [isEditing, currentAd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Saga가 요구하는 데이터 구조 (dto 객체)
    const dto = { title, content };

    if (isEditing) {
      // 수정 요청
      dispatch(updateAdRequest({ adId: currentAd.id, dto, file }));
      setIsEditing(false);
    } else {
      // 신규 등록 요청
      dispatch(createAdRequest({ dto, file }));
    }

    // 전송 후 입력창 초기화
    setTitle('');
    setContent('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input 
        type="text" 
        placeholder="광고 제목" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="광고 내용" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        rows="4"
        required 
      />
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <div style={{ display: 'flex', gap: '5px' }}>
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
          {isEditing ? '수정하기' : '등록하기'}
        </button>
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)}>취소</button>
        )}
      </div>
    </form>
  );
};

export default AdForm;