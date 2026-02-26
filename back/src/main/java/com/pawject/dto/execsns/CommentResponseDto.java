// CommentResponseDto.java
package com.pawject.dto.execsns;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponseDto {
    private Long id;
    private String content;
    private String authorNickname;
    private LocalDateTime createdAt;
    private Long authorId;
}
