package com.pawject.dto.exec;


import java.time.LocalDateTime;

import com.pawject.domain.Ad;

import lombok.Getter;

@Getter
public class AdResponseDto {
    private Long id;
    private String title;
    private String content;
    private String img;       // 저장된 이미지 경로
    private boolean active;
    private String userEmail; // 작성자 이메일
    private LocalDateTime createdAt; // 생성일시
    private LocalDateTime updatedAt; // 수정일시

    public AdResponseDto(Ad ad) {
        this.id = ad.getId();
        this.title = ad.getTitle();
        this.content = ad.getContent();
        this.img = ad.getImg();
        this.active = ad.isActive();
        this.userEmail = ad.getUser().getEmail();
        this.createdAt = ad.getCreatedAt();   // ✅ 추가
        this.updatedAt = ad.getUpdatedAt();   // ✅ 추가
    }
}
