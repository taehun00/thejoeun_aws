package com.pawject.controller;

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

import com.pawject.dto.execsns.LikeRequestDto;
import com.pawject.dto.execsns.LikeResponseDto;
import com.pawject.service.execsns.ExecPostLikeService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Like", description = "좋아요 API")
@RestController
@RequestMapping("/api/exec/likes")
@RequiredArgsConstructor
public class ExecLikeController {

    private final ExecPostLikeService likeService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "좋아요 추가 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PostMapping
    public ResponseEntity<LikeResponseDto> addLike(
            Authentication authentication,
            @RequestBody LikeRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        LikeResponseDto response = likeService.addLike(userId, dto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게시글 좋아요 수 조회 (공개)")
    @GetMapping("/count/{postId}")
    public ResponseEntity<LikeResponseDto> countLikes(
            @Parameter(description = "좋아요 수를 조회할 게시글 ID")
            @PathVariable("postId") Long postId
    ) {
        Long count = likeService.countLikes(postId);
        return ResponseEntity.ok(
            LikeResponseDto.builder()
                .postId(postId)
                .count(count)
                .build()
        );
    }

    @Operation(summary = "좋아요 취소 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @DeleteMapping("/{postId}")
    public ResponseEntity<LikeResponseDto> removeLike(
            Authentication authentication,
            @Parameter(description = "좋아요 취소할 게시글 ID")
            @PathVariable("postId") Long postId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        LikeResponseDto response = likeService.removeLike(userId, postId);  
        return ResponseEntity.ok(response);
    }
}
