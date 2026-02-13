import React from 'react';
import AdWritePage from './AdWritePage';

export default function WritePage() {
  // 글쓰기 전용 페이지 → isEditing=false로 고정
  return <AdWritePage isEditing={false} />;
}

