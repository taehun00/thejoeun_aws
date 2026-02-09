package com.pawject.dto.like;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikeResponseDto {
    private Long reviewId;
    private Long testerId;
    private Long count;      // 현재 좋아요 수
}
