package com.pawject.oauth2;

/**
 * OAuth2 사용자 정보 인터페이스
 * - 공급자별 공통 속성 추출을 위한 계약
 */
public interface UserInfoOAuth2 {
    String getProvider();     // 공급자 이름 (google, kakao, naver)
    String getProviderId();   // 공급자 고유 사용자 ID
    String getEmail();        // 사용자 이메일
    String getNickname();     // 사용자 닉네임
    String getImage();        // 프로필 이미지 URL
}
