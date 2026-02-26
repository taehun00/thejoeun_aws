// src/main/java/com/thejoa703/dto/request/FollowRequestDto.java
package com.pawject.dto.execsns;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FollowRequestDto {
    @NotNull
    private Long followeeId;
}
