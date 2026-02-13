package com.pawject.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.security.JwtProvider;

import jakarta.servlet.http.HttpServletResponse;

//@Profile("dev") // ✅ dev 프로필에서만 작동
@RestController
@RequestMapping("/dev")
public class DevAuthController {

    private final JwtProvider jwtTokenService; // ✅ 네 토큰서비스 클래스명으로 변경

    public DevAuthController(JwtProvider jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    /**
     * 주소창 호출:
     * http://localhost:8484/dev/login?userid=9&role=ROLE_ADMIN
     */
    @GetMapping("/login")
    public String devLogin(
            @RequestParam(name = "userid", defaultValue = "1") String userid,
            @RequestParam(name = "role", defaultValue = "ROLE_ADMIN") String role,
            HttpServletResponse response
    ) {
        String subject = userid;

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        String accessToken = jwtTokenService.createAccessToken(subject, claims);

        response.setHeader("Set-Cookie",
                "accessToken=" + accessToken + "; Path=/; SameSite=Lax");

        // 프론트 이동
        return "redirect:http://localhost:3000/foodboard";
    }
}
