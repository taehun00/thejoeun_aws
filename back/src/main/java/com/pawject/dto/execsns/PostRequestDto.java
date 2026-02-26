// PostRequestDto.java
package com.pawject.dto.execsns;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 게시글 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    @NotBlank
    private String content;

    // 실제 업로드는 MultipartFile로 처리하므로 imageUrls는 제거하거나 설명 추가
    // private List<String> imageUrls;

    private String hashtags;   // ✅ 해시태그를 "#tag1,#tag2" 형태의 문자열로 받음
}
