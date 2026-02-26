// src/main/java/com/thejoa703/dto/request/BlockRequestDto.java
package com.pawject.dto.execsns;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BlockRequestDto {
    @NotNull
    private Long targetUserId; // 차단/해제 대상 사용자
    @NotNull
    private Boolean blocked;   // true=차단, false=해제
}
