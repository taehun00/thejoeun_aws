package com.pawject.dto.execsns;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회원가입 요청 DTO
 * - 이메일, 비밀번호, 닉네임, provider("local" 기본)
 * - Controller에서 @Valid로 유효성 검사
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // 평문 입력 → 서비스에서 BCrypt 해시 저장

    @NotBlank
    private String nickname;

    private String provider; // "local" 기본
}
