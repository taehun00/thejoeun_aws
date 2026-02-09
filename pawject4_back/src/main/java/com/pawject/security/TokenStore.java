package com.pawject.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;


//토큰냉장고 - redis  
@Component
@RequiredArgsConstructor
public class TokenStore {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * Refresh Token 저장
     * @param   userId  사용자 ID
     * @param   token Refresh Token 
     * @param   long ttlSeconds  만료 시간 (초)
     * */
    public void saveRefreshToken(String userId, String token, long ttlSeconds) {
        String key = buildKey(userId);
        redisTemplate.opsForValue().set(key, token, ttlSeconds, TimeUnit.SECONDS);
    }

    /**
     * Refresh Token 조회
     * @param   userId  사용자 ID
     * @param   저장된 Refresh Token (없으면 null) 
     * */
    public String getRefreshToken(String userId) {
        String key = buildKey(userId);
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * Refresh Token 삭제 (로그아웃시)
     * @param   userId  사용자 ID 
     * */
    public void deleteRefreshToken(String userId) {
        String key = buildKey(userId);
        redisTemplate.delete(key);
    }

    /**
     * Redis 키생성 규치
     * @param   userId  사용자 ID 
     * @param   refresh:<userId>
     * */
    private String buildKey(String userId) {
        return "refresh:" + userId;
    }
}
