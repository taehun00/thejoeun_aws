package com.pawject.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "회원 정보 수정 요청 DTO")
public class UserUpdateRequestDto {

    @Schema(description = "비밀번호 (local 사용자만 수정 가능)", example = "newPassword123")
    private String password;

    @Schema(description = "닉네임", example = "태훈이")
    private String nickname;

    @Schema(description = "휴대폰 번호", example = "010-1234-5678")
    private String mobile;
}