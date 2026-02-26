package com.pawject.dto.execsns;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 로그인 요청 DTO
 * - 이메일, 비밀번호, provider("local" 기본)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // 평문 입력 → 서비스에서 BCrypt matches로 검증   pass123

    private String provider; // "local"
}
