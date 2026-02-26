package com.pawject.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.execsns.FollowRequestDto;
import com.pawject.dto.execsns.FollowResponseDto;
import com.pawject.service.execsns.ExecFollowService;
import com.pawject.service.user.AuthUserJwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exec/follows")
public class ExecFollowController {

    private final ExecFollowService followService;
    private final AuthUserJwtService authUserJwtService;

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PostMapping
    public ResponseEntity<?> follow(Authentication authentication,
                                    @Valid @RequestBody FollowRequestDto dto) {
        try {
            Long followerId = authUserJwtService.getCurrentUserId(authentication);
            FollowResponseDto body = followService.follow(followerId, dto);
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/me/followings")
    public ResponseEntity<List<FollowResponseDto>> getMyFollowings(Authentication authentication) {
        Long followerId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(followService.getFollowings(followerId));
    }

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/me/followers")
    public ResponseEntity<List<FollowResponseDto>> getMyFollowers(Authentication authentication) {
        Long followeeId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(followService.getFollowers(followeeId));
    }

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/me/followings/count")
    public ResponseEntity<Long> countMyFollowings(Authentication authentication) {
        Long followerId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(followService.countFollowings(followerId));
    }

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/me/followers/count")
    public ResponseEntity<Long> countMyFollowers(Authentication authentication) {
        Long followeeId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(followService.countFollowers(followeeId));
    }

    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @DeleteMapping
    public ResponseEntity<?> unfollow(Authentication authentication,
                                      @Valid @RequestBody FollowRequestDto dto) {
        Long followerId = authUserJwtService.getCurrentUserId(authentication);
        Long followeeId = followService.unfollow(followerId, dto.getFolloweeId());
        return ResponseEntity.ok().body(followeeId);
    }
}
