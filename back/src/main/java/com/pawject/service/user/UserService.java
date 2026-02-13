package com.pawject.service.user;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.domain.User;
import com.pawject.dto.user.LoginRequest;
import com.pawject.dto.user.UserRequestDto;
import com.pawject.dto.user.UserResponseDto;
import com.pawject.dto.user.UserUpdateRequestDto;
import com.pawject.repository.UserRepository;
import com.pawject.security.JwtProvider;
import com.pawject.util.UtilUpload;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UtilUpload utilUpload;


    private static final String DEFAULT_PROVIDER = "local";
    private static final String DEFAULT_PROFILE_IMAGE = "default.png";

    /* =========================
       회원가입 (프로필 이미지 포함)
     ========================= */
    public UserResponseDto signup(UserRequestDto request, MultipartFile profileImage) {

        String provider = request.getProvider() != null
                ? request.getProvider()
                : DEFAULT_PROVIDER;

        // 이메일 + provider 중복 체크
        if (userRepository.existsByEmailAndProviderNative(request.getEmail(), provider) > 0) {
            throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
        }

        // 닉네임 중복 체크
        if (userRepository.findByNickname(request.getNickname()).isPresent()) {
            throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
        }


        String profilePath = DEFAULT_PROFILE_IMAGE; // 기본 이미지
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profilePath = utilUpload.fileUpload(profileImage, "userimg"); // 업로드 성공 시 경로 반환
            } catch (IOException e) {
                profilePath = DEFAULT_PROFILE_IMAGE; // 실패 시 기본 이미지로 대체
            }
        }


        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .provider(provider)
                .role("ROLE_MEMBER")
                .ufile(profilePath)
                .build();

        return UserResponseDto.fromEntity(userRepository.save(user));
    }

    /* =========================
       로그인
     ========================= */
    public UserResponseDto login(LoginRequest request) {

        String provider = request.getProvider() != null
                ? request.getProvider()
                : DEFAULT_PROVIDER;

        User user = userRepository.findByEmailAndProviderNative(
                request.getEmail(), provider
        ).orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        // ★ 토큰 발급
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("provider", user.getProvider());


        String accessToken = jwtProvider.createAccessToken(String.valueOf(user.getUserId()), claims);
        String refreshToken = jwtProvider.createRefreshToken(String.valueOf(user.getUserId()));

        
        return UserResponseDto.fromEntity(user, accessToken, refreshToken);

    }

    /* =========================
       사용자 조회
     ========================= */
    public UserResponseDto findById(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponseDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
    }
    
    public UserResponseDto findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponseDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
    }


    public Optional<User> findByEmailAndProviderNative(String email, String provider) {
        return userRepository.findByEmailAndProviderNative(email, provider);
    }
    
	 /* =========================
	    전체 정보 수정
	  ========================= */
    public UserResponseDto updateUserInfo(Long userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        // 수정 가능한 필드만 업데이트
        if (request.getNickname() != null && !request.getNickname().isBlank()) {

            userRepository.findByNickname(request.getNickname())
                .filter(u -> !u.getUserId().equals(userId))
                .ifPresent(u -> {
                    throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
                });

            user.setNickname(request.getNickname());
        }
        if (request.getMobile() != null) {
            user.setMobile(request.getMobile());
        }
        
        // local 사용자만 비밀번호 수정 가능
        if ("local".equals(user.getProvider()) && request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }


        return UserResponseDto.fromEntity(userRepository.save(user));
    }



    /* =========================
       닉네임 변경
     ========================= */
    public UserResponseDto updateNickname(Long userId, String newNickname) {

    	if (userRepository.findByNickname(newNickname).isPresent()) {

            throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        user.setNickname(newNickname);

        return UserResponseDto.fromEntity(userRepository.save(user));
    }
    
	 // 프로필 이미지 변경
    public UserResponseDto updateProfileImage(Long userId, MultipartFile profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        String profilePath = DEFAULT_PROFILE_IMAGE; // 기본 이미지
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profilePath = utilUpload.fileUpload(profileImage); // 업로드 성공 시 경로 반환
            } catch (IOException e) {
                profilePath = DEFAULT_PROFILE_IMAGE; // 실패 시 기본 이미지로 대체
            }
        }

        user.setUfile(profilePath);
        return UserResponseDto.fromEntity(userRepository.save(user));
    }



    /* =========================
       사용자 탈퇴
     ========================= */
//    public void deleteUserByEmail(String email) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
//
//        // 연관 데이터 있다면 여기서 처리
//        // petRepository.deleteByUser(user);
//
//        userRepository.deleteByEmail(email);
//    }
	    
	    public void deleteUserById(Long userId) {
	        User user = userRepository.findById(userId)
	                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
	        userRepository.delete(user);
	    }


    /* =========================
       소셜 로그인 사용자 저장
     ========================= */
    public User saveSocialUser(
            String email,
            String provider,
            String providerId,
            String nickname
    ) {
        User user = User.builder()
                .email(email)
                .provider(provider)
                .providerId(providerId)
                .nickname(nickname)
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }

    /* =========================
       권한 조회
     ========================= */
    public String findRoleByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(User::getRole)
                .orElse("ROLE_USER");
    }
}