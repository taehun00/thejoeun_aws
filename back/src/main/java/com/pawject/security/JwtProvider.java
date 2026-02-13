package com.pawject.security;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

// 2. 토큰 발급/검증
@Component
public class JwtProvider {
    private final JwtProperties props; // 토큰 - 출입증
    private final SecretKey key;  //JWT 서명에 사용할 SecretKey

    // 생성자
    public JwtProvider(JwtProperties props) {
        this.props = props;
        this.key = Keys.hmacShaKeyFor(props.getSecret().getBytes()); // SHA-256 서명용키 생성
    }
 
    // AccessToken 생성
    public String createAccessToken(String subject, Map<String, Object> claims) { // 사용자식별자, 추가정보
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(props.getAccessTokenExpSeconds());
        return Jwts.builder()
                .setIssuer(props.getIssuer()) // 발급자
                .setSubject(subject)     // 사용자
                .addClaims(claims)       // 추가정보들
                .setIssuedAt(Date.from(now))  //발급시간
                .setExpiration(Date.from(exp)) // 만료시간
                .signWith(key, SignatureAlgorithm.HS256)  // HS256 알고리즘 서명
                .compact();
    }
    
    // RefreshToken 생성
    public String createRefreshToken(String subject) {   // 추가정보필요 x
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(props.getRefreshTokenExpSeconds());  // 시간더 길게
        return Jwts.builder()
                .setIssuer(props.getIssuer())
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    // 토큰 파싱과 검증
    public Jws<Claims> parse(String token) {  // jwt 문자열
        return Jwts.parserBuilder()
                .setSigningKey(key)  // 서명키를 이용해서 토큰 검증
                .requireIssuer(props.getIssuer())  // 발급자와 일치하는지 확인
                .build()
                .parseClaimsJws(token);
    }
}
