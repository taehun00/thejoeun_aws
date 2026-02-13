package com.pawject.oauth2;

import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * Naver OAuth2 사용자 정보 매핑
 * - response 객체 내부에서 값 추출
 */
@AllArgsConstructor
public class UserInfoNaver implements UserInfoOAuth2 {
    private final Map<String, Object> attributes;

    @SuppressWarnings("unchecked")
    private Map<String, Object> getResponse() {
        Object response = attributes.get("response");
        return response instanceof Map ? (Map<String, Object>) response : null;
    }

    @Override
    public String getProvider() { return "naver"; }

    @Override
    public String getProviderId() {
        Map<String, Object> resp = getResponse();
        Object id = resp != null ? resp.get("id") : null;
        return id != null ? id.toString() : null;
    }

    @Override
    public String getEmail() {
        Map<String, Object> resp = getResponse();
        Object email = resp != null ? resp.get("email") : null;
        return email != null ? email.toString() : null;
    }

    @Override
    public String getNickname() {
        Map<String, Object> resp = getResponse();
        Object nickname = resp != null ? resp.get("nickname") : null;
        return nickname != null ? nickname.toString() : null;
    }

    @Override
    public String getImage() {
        Map<String, Object> resp = getResponse();
        Object img = resp != null ? resp.get("profile_image") : null;
        return img != null ? img.toString() : "no.png";
    }
}
