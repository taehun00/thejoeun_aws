package com.pawject.oauth2;

import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * Kakao OAuth2 사용자 정보 매핑
 * - kakao_account / profile 구조를 안전하게 파싱
 */
@AllArgsConstructor
public class UserInfoKakao implements UserInfoOAuth2 {
    private final Map<String, Object> attributes;

    @Override
    public String getProvider() { return "kakao"; }

    @Override
    public String getProviderId() {
        Object id = attributes.get("id");
        return id != null ? id.toString() : null;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getAccount() {
        Object account = attributes.get("kakao_account");
        return account instanceof Map ? (Map<String, Object>) account : null;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getProfile() {
        Map<String, Object> account = getAccount();
        if (account != null) {
            Object profile = account.get("profile");
            return profile instanceof Map ? (Map<String, Object>) profile : null;
        }
        return null;
    }

    @Override
    public String getEmail() {
        Map<String, Object> account = getAccount();
        Object email = account != null ? account.get("email") : null;
        return email != null ? email.toString() : null;
    }

    @Override
    public String getNickname() {
        Map<String, Object> profile = getProfile();
        Object nickname = profile != null ? profile.get("nickname") : null;
        if (nickname != null) return nickname.toString();

        Object props = attributes.get("properties");
        if (props instanceof Map) {
            Object nk = ((Map<?, ?>) props).get("nickname");
            return nk != null ? nk.toString() : null;
        }
        return null;
    }

    @Override
    public String getImage() {
        Map<String, Object> profile = getProfile();
        Object img = profile != null ? profile.get("profile_image_url") : null; // ✅ 최신 필드명
        if (img != null) return img.toString();

        Object props = attributes.get("properties");
        if (props instanceof Map) {
            Object tn = ((Map<?, ?>) props).get("thumbnail_image");
            return tn != null ? tn.toString() : "no.png";
        }
        return "no.png";
    }
}
