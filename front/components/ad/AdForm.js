import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Input, Button, Space, Typography } from 'antd';
import { createAdRequest, updateAdRequest } from '../../reducers/ad/adReducer';

const { TextArea } = Input;
const { Title } = Typography;

const AdForm = ({ isEditing, currentAd, setIsEditing }) => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // 단건 조회로 currentAd가 변경되면 폼에 값을 채움
  useEffect(() => {
    if (isEditing && currentAd) {
      setTitle(currentAd.title || '');
      setContent(currentAd.content || '');
    }
  }, [isEditing, currentAd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dto = { title, content };

    if (isEditing) {
      dispatch(updateAdRequest({ adId: currentAd.id, dto, file }));
      setIsEditing(false); // 수정 모드 해제
    } else {
      dispatch(createAdRequest({ dto, file }));
    }

    // 폼 리셋
    setTitle('');
    setContent('');
    setFile(null);
  };

  return (
    <Card bordered>
      <Title level={4}>{isEditing ? '광고 수정' : '광고 등록'}</Title>
      <form onSubmit={handleSubmit}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input 
            placeholder="제목" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <TextArea 
            placeholder="내용" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows={4} 
            required 
          />
          <input 
            type="file" 
            ref={fileRef} 
            style={{ display: 'none' }} 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <Button onClick={() => fileRef.current.click()}>
            {file ? file.name : '이미지 선택'}
          </Button>
          <Button type="primary" htmlType="submit" block>
            {isEditing ? '저장하기' : '등록하기'}
          </Button>
          {isEditing && (
            <Button onClick={() => {
              setIsEditing(false);
              setTitle('');
              setContent('');
            }} block>취소</Button>
          )}
        </Space>
      </form>
    </Card>
  );
};

export default AdForm;