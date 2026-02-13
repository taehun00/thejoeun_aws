package com.pawject.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pawject.oauth2.CustomOAuth2User;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//보안게이트
/**
 * JWT 인증필터
 * - Authorization 헤더에서 Bearer 토큰추출
 * - JwtProvider로 Claims파싱
 * - CustomUserPincipal 기반   Pincipal 생성후 SecurityContext에 저장
 * */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	//JWT 토큰 발급/검증
    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwtProvider.parse(token).getBody();  
                // subject  →  userId( Long ) , role 추출
                Long userId = Long.parseLong(claims.getSubject());
                String role = claims.get("role", String.class);
                
	             //CustomUserPincipal
                 CustomOAuth2User userPrincipal = new CustomOAuth2User(userId, role);

                 UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal, null, userPrincipal.getAuthorities()
                 );

                 SecurityContextHolder.getContext().setAuthentication(auth);
 
                // log.debug("JWT 인증 성공: userId={}, role={}", userId, role);

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                // log.warn("JWT 인증 실패: {}", e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                return; // 필터 체인 중단

            }
        }

        chain.doFilter(request, response);
    }
}
