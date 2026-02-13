package com.pawject.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthDto {
    private int authId;     // ROLES PK
    private int userId;     // USERS PK (FK)
    private String email;   // 사용자 이메일 (표시용)
    private String auth;    // 권한명

    public AuthDto(String auth, String email) {
        this.auth = auth;
        this.email = email;
    }
}
