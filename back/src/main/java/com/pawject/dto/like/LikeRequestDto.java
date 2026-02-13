package com.pawject.dto.like;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LikeRequestDto {

    private Long reviewId;  // 리뷰 게시글 ID
    private Long testerId;  // 체험단 게시글 ID
}
