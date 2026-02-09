package com.pawject.dto.exec;


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

    public AdResponseDto(Ad ad) {
        this.id = ad.getId();
        this.title = ad.getTitle();
        this.content = ad.getContent();
        this.img = ad.getImg();
        this.active = ad.isActive();
        this.userEmail = ad.getUser().getEmail();
    }
    
    
}
