package com.pawject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")   // application.yml
    private String host;

    @Value("${spring.data.redis.port}") 
    private int port;

    // Redis 연결을 생성하고 관리 (JWT 저장소)
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {  //Lettuce  비동기/반응형 지원
        return new LettuceConnectionFactory(host, port);
    }
    // StringRedisTemplate - Redis 문자열기반 데이터를  저장/조회할수 있도록 해주는 템플릿
    @Bean
    public StringRedisTemplate stringRedisTemplate(LettuceConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }
}