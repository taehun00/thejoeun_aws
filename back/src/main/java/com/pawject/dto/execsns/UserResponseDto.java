// src/main/java/com/thejoa703/dto/response/UserResponseDto.java
package com.pawject.dto.execsns;

import com.pawject.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 응답 DTO
 * - 엔티티(AppUser) → DTO 변환용 정적 메서드 제공
 * - 필요 시 DTO → 엔티티 변환(toEntity)도 제공하여 테스트/매핑 유연성 확보
 *
 * 중요:
 * - 응답 DTO는 보통 읽기 전용이지만, 테스트에서 DTO→엔티티 변환을 요구하는 경우가 있어 toEntity()를 제공합니다.
 * - 비밀번호 등 민감정보는 응답 DTO에 포함하지 않습니다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    // ✅ 응답에 필요한 필드만 노출
    private Long id;
    private String email;
    private String nickname;
    private String provider;
    private String role;
    private java.time.LocalDateTime createdAt;
    private String ufile;

    /**
     * ✅ 엔티티 → DTO 변환
     * - 서비스/컨트롤러에서 안전하게 응답 생성
     */
    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .provider(user.getProvider())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .ufile(user.getUfile())
                .build();
    }
 
    /**
     * ✅ DTO → 엔티티 변환
     * - 테스트나 특정 매핑 시 필요할 수 있어 제공
     * - 응답 DTO이므로 모든 필드를 채우지 않을 수 있음(주의)
     *
     * 설명:
     * - 보안상 응답 DTO에서 password를 다루지 않습니다.
     * - provider, role 등은 기본값을 설정하거나 null 허용합니다.
     */
    public User toEntity() {
        User user = new User();
        user.setUserId(this.id);                 // 테스트에서 ID 매핑이 필요할 수 있음
        user.setEmail(this.email);
        user.setNickname(this.nickname);
        user.setProvider(this.provider != null ? this.provider : "local");
        user.setRole(this.role != null ? this.role : "ROLE_USER");
        user.setUfile(this.ufile);
        // createdAt은 엔티티 @PrePersist에서 자동 세팅되므로 여기서는 생략
        return user;
    }
}
