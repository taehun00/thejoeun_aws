package com.pawject.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.execsns.PostRequestDto;
import com.pawject.dto.execsns.PostResponseDto;
import com.pawject.service.execsns.ExecPostService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Post", description = "게시글 API")
@RestController
@RequestMapping("/api/exec/posts")
@RequiredArgsConstructor
public class ExecPostController {

    private final ExecPostService postService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "게시글 전체 조회 (공개)")
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @Operation(summary = "게시글 단건 조회 (공개)")
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(
            @PathVariable(name = "postId") Long postId
    ) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    @Operation(summary = "전체 게시글 페이징 조회 (공개)")
    @GetMapping("/paged")
    public ResponseEntity<List<PostResponseDto>> getAllPostsPaged(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllPostsPaged(page, size));
    }

    @Operation(summary = "좋아요한 게시글 페이징 조회 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/liked")
    public ResponseEntity<List<PostResponseDto>> getLikedPostsPaged(
            Authentication authentication,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(postService.getLikedPostsPaged(userId, page, size));
    }

    @Operation(summary = "게시글 작성 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPost(
            Authentication authentication,
            @ModelAttribute PostRequestDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(postService.createPost(userId, dto, files));
    }

    @Operation(summary = "해시태그로 게시글 검색 (공개)")
    @GetMapping("/search/hashtag")
    public ResponseEntity<List<PostResponseDto>> searchByHashtag(
            @RequestParam("tag") String tag
    ) {
        return ResponseEntity.ok(postService.getPostsByHashtag(tag));
    }

    @Operation(summary = "게시글 수정 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> updatePost(
            Authentication authentication,
            @PathVariable(name = "postId") Long postId,
            @ModelAttribute PostRequestDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(postService.updatePost(userId, postId, dto, files));
    }

    @Operation(summary = "게시글 삭제 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable(name = "postId") Long postId
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        postService.deletePost(userId, postId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "내가 쓴 글 + 내가 리트윗한 글 페이징 조회 (JWT 인증 필요)")
    @PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
    @GetMapping("/myPostRetweets/paged")
    public ResponseEntity<List<PostResponseDto>> getMyPostsAndRetweetsPaged(
            Authentication authentication,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        List<PostResponseDto> result = postService.getMyPostsAndRetweetsPaged(userId, page, size);
        return ResponseEntity.ok(result);
    }
}
