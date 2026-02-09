package com.pawject.oauth2;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.pawject.domain.User;
import com.pawject.security.JwtProperties;
import com.pawject.security.JwtProvider;
import com.pawject.security.TokenStore;
import com.pawject.service.user.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


/**
 * OAuth2 로그인 성공핸들러 ( 리다이렉트 방식)
 * - UserInfoOAuth2 :  공급자별 사용자 정보 매핑 (googke, kakao, naver)
 * - DB 저장/조회
 * - JWT 발급 및 Redis 저장
 * - Refresh Token  을 HttpOnly 쿠키로 저달
 * - Access Token 을 프론트엔드(react)로 리다이렉트하면서 전달
 * */
//org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;  //  DB 저장/조회
    private final JwtProvider jwtProvider;  // JWT 토큰 발급/검증
    private final TokenStore tokenStore;  // Redis  - Refresh Token
    private final JwtProperties props;  // JWT 토큰 - 출입증
 
    @Value("${app.oauth2.redirect-url}")
    private String redirectUrl;  //   Access Token 을 프론트엔드(react)로 리다이렉트하면서 전달

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attrs = oAuth2User.getAttributes();

        // 공급자 식별(googke, kakao, naver)
        String registrationId = ((OAuth2AuthenticationToken) authentication)
                .getAuthorizedClientRegistrationId();
        
        // 공급자 사용자 정보매핑
        UserInfoOAuth2 userInfo;
        switch (registrationId) {
            case "google": userInfo = new UserInfoGoogle(attrs); break;
            case "kakao":  userInfo = new UserInfoKakao(attrs); break;
            case "naver":  userInfo = new UserInfoNaver(attrs); break;
            default: throw new IllegalArgumentException("지원하지 않는 Provider: " + registrationId);
        }
        // DB 조회 / 저장
        User user = userService.findByEmailAndProviderNative(userInfo.getEmail(), userInfo.getProvider())
                .orElseGet(() -> userService.saveSocialUser(
                        userInfo.getEmail(),
                        userInfo.getProvider(),
                        userInfo.getProviderId(),
                        userInfo.getNickname()
                ));

        // JWT 발급
        String access = jwtProvider.createAccessToken(user.getUserId().toString(), Map.of(
                "nickname", user.getNickname(),
                "provider", user.getProvider(),
//                "role", user.getRole(),
                "email", user.getEmail()
        ));
        String refresh = jwtProvider.createRefreshToken(user.getUserId().toString());
 
        // Redis에 refresh:<userId> 형태로 저장
        tokenStore.saveRefreshToken(
                user.getUserId().toString(),
                refresh,
                (long) props.getRefreshTokenExpSeconds()
        );
 
        // RefreshToken 을  HttpOnly 쿠키로 설정
        Cookie refreshCookie = new Cookie("refreshToken", refresh);
        refreshCookie.setHttpOnly(true);
        boolean isLocal = request.getServerName().equals("localhost") || request.getServerName().equals("127.0.0.1");
        refreshCookie.setSecure(!isLocal);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) props.getRefreshTokenExpSeconds());
        response.addCookie(refreshCookie);
        
        // 프론트엔드 react 에서 accessToken을 쿼리 파라미터로 전달
        String targetUrl = redirectUrl + "?accessToken=" + access;
        response.sendRedirect(targetUrl);
    }
}



