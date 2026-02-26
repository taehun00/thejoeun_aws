// src/main/java/com/thejoa703/dto/response/FollowResponseDto.java
package com.pawject.dto.execsns;

import java.time.LocalDateTime;

import com.pawject.domain.ExecFollow;
import com.pawject.domain.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class FollowResponseDto {
    private Long id;
    private Long followerId;
    private Long followeeId;
    private LocalDateTime createdAt;

    private String nickname;
    private String email;
    private String ufile;

    private boolean blocked;  

    public static FollowResponseDto of(ExecFollow follow, User targetUser, boolean blocked) {
        FollowResponseDto dto = new FollowResponseDto();
        dto.id = follow.getId();
        dto.followerId = follow.getFollower().getUserId();
        dto.followeeId = follow.getFollowee().getUserId();
        dto.createdAt = follow.getCreatedAt();

        dto.nickname = targetUser.getNickname();
        dto.email = targetUser.getEmail();
        dto.ufile = targetUser.getUfile();

        dto.blocked = blocked;
        return dto;
    }
}
