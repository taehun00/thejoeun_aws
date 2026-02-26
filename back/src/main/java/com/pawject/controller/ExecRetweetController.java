package com.pawject.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.execsns.RetweetRequestDto;
import com.pawject.dto.execsns.RetweetResponseDto;
import com.pawject.service.execsns.ExecRetweetService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Retweet", description = "리트윗 API")
@RestController
@RequestMapping("/api/exec/retweets")
@RequiredArgsConstructor
public class ExecRetweetController {

    private final ExecRetweetService retweetService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "리트윗 추가 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PostMapping
    public ResponseEntity<RetweetResponseDto> addRetweet(
            Authentication authentication,
            @RequestBody RetweetRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(retweetService.addRetweet(userId, dto));
    }

    @Operation(summary = "리트윗 여부 확인 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/{postId}")
    public ResponseEntity<Boolean> hasRetweeted(
            Authentication authentication,
            @Parameter(description = "리트윗 여부를 확인할 게시글 ID")
            @PathVariable("postId") Long postId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(retweetService.hasRetweeted(userId, postId));
    }

    @Operation(summary = "리트윗 취소 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @DeleteMapping("/{postId}")
    public ResponseEntity<RetweetResponseDto> removeRetweet(
            Authentication authentication,
            @Parameter(description = "리트윗 취소할 게시글 ID")
            @PathVariable("postId") Long postId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(retweetService.removeRetweet(userId, postId));
    }

    @Operation(summary = "특정 게시글의 리트윗 수 조회")
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> countRetweets(
            @Parameter(description = "리트윗 수를 확인할 게시글 ID")
            @PathVariable("postId") Long postId
    ) {
        return ResponseEntity.ok(retweetService.countRetweets(postId));
    }

    @Operation(summary = "내가 리트윗한 글 목록 조회 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Long>> getMyRetweets(
            Authentication authentication,
            @Parameter(description = "리트윗한 글을 조회할 사용자 ID")
            @PathVariable("userId") Long userId
    ) {
        Long currentUserId = authUserJwtService.getCurrentUserId(authentication);
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(retweetService.findMyRetweets(userId));
    }
}
