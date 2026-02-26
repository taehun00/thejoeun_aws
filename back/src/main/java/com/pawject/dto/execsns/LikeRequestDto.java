// LikeRequestDto.java
package com.pawject.dto.execsns;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 좋아요 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequestDto {
    @NotNull
    private Long postId;
}
