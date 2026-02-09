package com.pawject.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	private int userId;          // USERID
    private String email;         // EMAIL
    private String nickname;      // NICKNAME
    private String password;      // PASSWORD
    private String ufile;         // UFILE (프로필 이미지 등)
    private String createdAt; // CREATEDAT
    private String mobile;        // MOBILE
    private String provider;      // PROVIDER (소셜 로그인 제공자)
    private String providerId;    // PROVIDERID (소셜 로그인 고유 ID)
    public UserDto(String email, String provider) {
		super();
		this.email = email;
		this.provider = provider;
	}
}
