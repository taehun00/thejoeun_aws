package com.pawject.dto.user;

import java.time.LocalDateTime;

import com.pawject.domain.User;
import com.pawject.dto.user.UserResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String email;
    private String nickname;
    private String ufile;
    private String mobile;
    private String provider;
    private String role;
    
    
    private LocalDateTime createdAt;
    
 // ★ 토큰 필드 추가
    private String accessToken;
    private String refreshToken;


    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .ufile(user.getUfile())
                .mobile(user.getMobile())
                .provider(user.getProvider())
                .createdAt(user.getCreatedAt())
                .build();
    }
 // ★ 토큰 포함 버전
    public static UserResponseDto fromEntity(User user, String accessToken, String refreshToken) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .ufile(user.getUfile())
                .mobile(user.getMobile())
                .provider(user.getProvider())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

}
