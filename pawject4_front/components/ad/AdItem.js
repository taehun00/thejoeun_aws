// components/ad/AdItem.js
// 광고 개별 항목

// components/ad/AdItem.js
//import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
const { Text, Title } = Typography;

/**
 * 광고 개별 항목 컴포넌트
 */
const AdItem = ({ ad, onDelete, onEdit }) => {
  return (
    <Card 
      size="small" 
      style={{ marginBottom: 16 }}
      // 하단 버튼 영역 (수정, 삭제)
      actions={[
        <Button type="link" key="edit" onClick={() => onEdit(ad.id)}>수정</Button>,
        <Button type="link" key="delete" danger onClick={() => onDelete(ad.id)}>삭제</Button>
      ]}
    >

      <Space align="start" size={16} style={{ width: '100%' }}>
        {/* 이미지 영역 */}
        {ad.imageUrl && (
          <img 
            src={ad.imageUrl} 
            alt="광고 이미지" 
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} 
          />
        )}
        
        {/* 텍스트 영역: 제목과 본문 사이의 수직 간격(Space Vertical) */}
        <Space direction="vertical" size={4}>
          <Title level={5} style={{ margin: 0 }}>
            {ad.title}
          </Title>
          <Text type="secondary">
            {ad.content}
          </Text>
        </Space>
      </Space>
    </Card>
  );
};

export default AdItem;