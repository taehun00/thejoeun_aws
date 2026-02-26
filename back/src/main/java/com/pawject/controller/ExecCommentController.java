package com.pawject.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.execsns.CommentRequestDto;
import com.pawject.dto.execsns.CommentResponseDto;
import com.pawject.service.execsns.ExecCommentService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Comment", description = "댓글 API")
@RestController
@RequestMapping("/api/exec/comments")
@RequiredArgsConstructor
public class ExecCommentController {

    private final ExecCommentService commentService;
    private final AuthUserJwtService authUserJwtService;  

    @Operation(summary = "댓글 작성 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            Authentication authentication,
            @RequestBody CommentRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(commentService.createComment(userId, dto));
    }

    @Operation(summary = "게시글의 댓글 조회 (공개)")
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(
            @Parameter(description = "조회할 게시글 ID") 
            @PathVariable("postId") Long postId
    ) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @Operation(summary = "댓글 수정 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            Authentication authentication,
            @Parameter(description = "수정할 댓글 ID") 
            @PathVariable("commentId") Long commentId,
            @RequestBody CommentRequestDto dto 
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(commentService.updateComment(userId, commentId, dto)); 
    }

    @Operation(summary = "댓글 삭제 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            Authentication authentication,
            @Parameter(description = "삭제할 댓글 ID") 
            @PathVariable("commentId") Long commentId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        commentService.deleteComment(userId, commentId); 
        return ResponseEntity.noContent().build();
    }
}
