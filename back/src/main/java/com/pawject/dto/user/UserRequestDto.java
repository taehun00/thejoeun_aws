package com.pawject.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

    private String email;
    private String password;
    private String nickname;
    private String mobile;

    // 소셜 로그인용
    private String provider;    // local, google, kakao ...

}