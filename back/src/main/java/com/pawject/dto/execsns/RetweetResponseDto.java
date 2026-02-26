package com.pawject.dto.execsns;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

/**
 * ✅ 리트윗 응답 DTO
 * - 리트윗 ID, 유저 ID, 원본 게시글 ID, 생성 시점
 * - 리트윗 수 포함 (프론트에서 즉시 반영 가능)
 */
@Getter
@Builder
public class RetweetResponseDto {
    private Long id;
    private Long userId;
    private Long originalPostId;
    private LocalDateTime createdAt;
    private long retweetCount;  
    
}
