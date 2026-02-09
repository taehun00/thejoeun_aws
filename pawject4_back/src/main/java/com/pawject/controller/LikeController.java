package com.pawject.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.pawject.dto.like.LikeRequestDto;
import com.pawject.dto.like.LikeResponseDto;
import com.pawject.service.like.LikeService;
import com.pawject.service.user.AuthUserJwtService;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "Like", description = "좋아요 API")
public class LikeController {

    private final LikeService likeService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "좋아요 추가 (JWT 인증 필요)")
    @PostMapping
    public ResponseEntity<LikeResponseDto> addLike(
            Authentication authentication,
            @RequestBody LikeRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        LikeResponseDto response = likeService.addLike(userId, dto);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/review/{reviewId}/me")
    public ResponseEntity<Map<String, Object>> isLikedByMe(
            Authentication authentication,
            @Parameter(description = "조회할 리뷰 ID", required = true)
            @PathVariable("reviewId") Long reviewId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        boolean liked = likeService.isLikedReview(userId, reviewId);

        Map<String, Object> response = new HashMap<>();
        response.put("reviewId", reviewId);
        response.put("liked", liked);

        return ResponseEntity.ok(response);
    }
    @Operation(summary = "리뷰 좋아요 수 조회 (공개)")
    @GetMapping("/review/count/{reviewId}")
    public ResponseEntity<LikeResponseDto> countLikesReview(
            @Parameter(description = "조회할 리뷰 ID", required = true)
            @PathVariable("reviewId") Long reviewId) {
        long count = likeService.countLikesReview(reviewId);
        return ResponseEntity.ok(LikeResponseDto.builder()
                .reviewId(reviewId)
                .count(count)
                .build());
    }

    @Operation(summary = "참여단 게시글 좋아요 수 조회 (공개)")
    @GetMapping("/tester/count/{testerId}")
    public ResponseEntity<LikeResponseDto> countLikesTester(
            @Parameter(description = "조회할 참여단 게시글 ID", required = true)
            @PathVariable("testerId") Long testerId) {
        long count = likeService.countLikesTester(testerId);
        return ResponseEntity.ok(LikeResponseDto.builder()
                .testerId(testerId)
                .count(count)
                .build());
    }


    @Operation(summary = "리뷰 좋아요 취소 (JWT 인증 필요)")
    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<LikeResponseDto> removeLikeReview(
            Authentication authentication,
            @Parameter(description = "좋아요를 취소할 리뷰 ID", required = true)
            @PathVariable("reviewId") Long reviewId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        LikeResponseDto response = likeService.removeLikeReview(userId, reviewId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "체험단 좋아요 취소 (JWT 인증 필요)")
    @DeleteMapping("/tester/{testerId}")
    public ResponseEntity<LikeResponseDto> removeLikeTester(
            Authentication authentication,
            @Parameter(description = "좋아요를 취소할 체험단 게시글 ID", required = true)
            @PathVariable("testerId") Long testerId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        LikeResponseDto response = likeService.removeLikeTester(userId, testerId);
        return ResponseEntity.ok(response);
    }
}
