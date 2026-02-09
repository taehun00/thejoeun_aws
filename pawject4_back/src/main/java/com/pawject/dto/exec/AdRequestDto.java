package com.pawject.dto.exec;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdRequestDto {
    private String title;

    private String content;
	    
    private boolean active;   // 활성 여부
    // 이미지 파일은 MultipartFile로 컨트롤러에서 별도로 받음
}
