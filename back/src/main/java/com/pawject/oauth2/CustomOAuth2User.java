package com.pawject.oauth2;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import lombok.Getter;


/**
 * JWT/OAUTH2  사용자 통합클래스
 * - JWT 사용자와 OAUTH2 사용자 모두 UserDetails 기반으로 관리
 * - SecurityContext에서 principal 타입으로 일관되게 유지
 * */

@Getter
public class CustomOAuth2User implements OAuth2User, UserDetails {
 
    private static final long serialVersionUID = 1L;
	
    private final Long id;             // JWT subject     
    private final String provider;     //  OAUTH2 provider (google, kakao, naver 등)
    private final String email;
    private final String nickname;
    private final String role;
    private final Map<String, Object> attributes;
 
    // JWT 사용자용 생성자
    public CustomOAuth2User(Long id, String role) {
        this.id = id;
        this.role = role;
        this.provider = null;
        this.email = null;
        this.nickname = null;
        this.attributes = null;
    }
    // OAUTH2 사용자용 생성자
    public CustomOAuth2User(String provider, String email, String nickname,
                               String role, Map<String, Object> attributes) {
        this.id = null;
        this.provider = provider;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.attributes = attributes;
    }
    // OAUTH2 구현
    @Override
    public Map<String, Object> getAttributes() { return attributes; }

    @Override
    public String getName() { return email != null ? email : String.valueOf(id); }
 
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() { return "N/A"; }     //비밀번호 불일치

    @Override
    public String getUsername() { return email != null ? email : String.valueOf(id); }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
 
    public Long getId() { return id; }
    public String getProvider() { return provider; }
    public String getNickname() { return nickname; }
    public String getRole() { return role; }
}
