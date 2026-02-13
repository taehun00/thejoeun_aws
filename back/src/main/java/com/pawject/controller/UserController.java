package com.pawject.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.domain.User;
import com.pawject.dto.user.LoginRequest;
import com.pawject.dto.user.UserRequestDto;
import com.pawject.dto.user.UserResponseDto;
import com.pawject.dto.user.UserUpdateRequestDto;
import com.pawject.security.JwtProvider;
import com.pawject.security.TokenStore;
import com.pawject.service.user.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;
    private final JwtProvider jwtProvider;
    private final TokenStore tokenStore;

	
	/* =========================
	    회원가입 (프로필 이미지 포함)
	  ========================= */
    @Operation(summary = "회원가입 (프로필 이미지 포함)")
    @PostMapping(
        value = "/signup",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponseDto> signup(
            @ModelAttribute UserRequestDto request,
            @RequestPart(value = "ufile", required = false) MultipartFile profileImage
    ) {
        return ResponseEntity.ok(userService.signup(request, profileImage));
    }
	
	 /* =========================
	    로그인
	  ========================= */
	 @PostMapping("/login")
	 public ResponseEntity<UserResponseDto> login(
	         @RequestBody LoginRequest request
	 ) {
	     return ResponseEntity.ok(userService.login(request));
	 }
	
	 /* =========================
	    사용자 조회
	  ========================= */
	 @GetMapping("/{userId}")
	 public ResponseEntity<UserResponseDto> findById(@PathVariable("userId") Long userId) {
	     return ResponseEntity.ok(userService.findById(userId));
	 }
	 
	 /* =========================
	    전체 정보 수정
	  ========================= */
	 @PutMapping("/me")
	 public ResponseEntity<UserResponseDto> updateMyInfo(
	         Authentication authentication,
	         @RequestBody UserUpdateRequestDto request
	 ) {
	     Long userId = Long.parseLong(authentication.getName());
	     UserResponseDto updated = userService.updateUserInfo(userId, request);
	     return ResponseEntity.ok(updated);
	 }

	
	 /* =========================
	    닉네임 변경
	  ========================= */
	 @PatchMapping("/{userId}/nickname")
	 public ResponseEntity<UserResponseDto> updateNickname(
	         @PathVariable("userId") Long userId,
	         @RequestParam(name = "nickname") String nickname
	 ) {
	     return ResponseEntity.ok(userService.updateNickname(userId, nickname));
	 }
	 
	 /* =========================
	     프로필 이미지 변경
	 ========================= */
	 @PostMapping(
	    value = "/me/profile-image",
	    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	)
	public ResponseEntity<UserResponseDto> updateProfileImage(
			Authentication authentication,
	        @RequestPart("ufile") MultipartFile ufile
	) {
		 Long userId = Long.parseLong(authentication.getName());
	    return ResponseEntity.ok(
	            userService.updateProfileImage(userId, ufile)
	    );
	}
	
	 /* =========================
	     Access Token 재발급
	 ========================= */
	 @PostMapping("/refresh")
	 public ResponseEntity<Map<String, Object>> refresh(@CookieValue("refreshToken") String refreshToken) {
	     var claims = jwtProvider.parse(refreshToken).getBody();
	     String userId = claims.getSubject();
	
	     String stored = tokenStore.getRefreshToken(userId);
	     if (stored == null || !stored.equals(refreshToken)) {
	         return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
	     }
	
	     String role = userService.findRoleByUserId(Long.valueOf(userId));
	     String newAccessToken = jwtProvider.createAccessToken(
	             userId,
	             Map.of("role", role)
	     );
	
	     return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	 }

	
	 /* =========================
	    사용자 탈퇴
	  ========================= */
//	 @DeleteMapping
//	 public ResponseEntity<Void> deleteByEmail(@RequestParam("email") String email) {
//	     userService.deleteUserByEmail(email);
//	     return ResponseEntity.noContent().build();
//	 }
	 
	 @DeleteMapping("/me")
	 public ResponseEntity<Void> deleteMyAccount(Authentication authentication) {
	     // JWT 토큰의 sub 값이 userId로 들어있다고 가정
	     Long userId = Long.parseLong(authentication.getName());
	     userService.deleteUserById(userId);
	     return ResponseEntity.noContent().build();
	 }

	 
	 /* =========================
	    마이페이지
	  ========================= */
	    @GetMapping("/mypage")
	    public ResponseEntity<UserResponseDto> getMyPage(Authentication authentication) {
	        Long userId = Long.parseLong(authentication.getName());
	        UserResponseDto dto = userService.findById(userId);
	        return ResponseEntity.ok(dto);
	    }


}