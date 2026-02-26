// src/main/java/com/thejoa703/dto/response/PostResponseDto.java
package com.pawject.dto.execsns;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.pawject.domain.ExecHashtag;
import com.pawject.domain.ExecImage;
import com.pawject.domain.ExecPost;


import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 응답 DTO
 * - 작성자 ID(authorId) 포함
 * - 이미지, 해시태그, 좋아요/댓글 수, 작성일시, 리트윗 수 포함
 * - ✅ soft delete 상태(deleted) 포함하여 테스트/관리 용이성 확보
 *
 * 중요:
 * - DTO는 엔티티의 상태를 표현하는 용도로 사용됩니다.
 * - 테스트에서 setDeleted(boolean)을 호출하는 경우가 있어 deleted 필드를 추가했습니다.
 */
@Getter
@Setter
public class PostResponseDto {
    private Long id;                  // 게시글 ID
    private String content;           // 게시글 내용
    private String authorNickname;    // 작성자 닉네임
    private Long authorId;            // 작성자 ID
    private List<String> imageUrls;   // 이미지 URL 목록
    private List<String> hashtags;    // 해시태그 목록
    private int likeCount;            // 좋아요 수
    private int commentCount;         // 댓글 수
    private LocalDateTime createdAt;  // 작성일시
    private long retweetCount;        // 리트윗 수
    private boolean deleted;          // ✅ soft delete 상태

    /**
     * ✅ 엔티티 → DTO 변환
     * - 엔티티의 모든 주요 상태를 DTO에 반영
     * - deleted 상태 포함
     */
    public static PostResponseDto from(ExecPost post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());

        // 작성자 정보
        if (post.getUser() != null) {
            dto.setAuthorNickname(post.getUser().getNickname());
            dto.setAuthorId(post.getUser().getUserId());
        }

        // 이미지 URL 매핑
        dto.setImageUrls(
            post.getImages().stream()
                .map(ExecImage::getSrc)
                .collect(Collectors.toList())
        );

        // 해시태그 매핑
        dto.setHashtags(
            post.getHashtags().stream()
                .map(ExecHashtag::getName)
                .collect(Collectors.toList())
        );

        // 좋아요/댓글 수
        dto.setLikeCount(post.getLikeCount());
        dto.setCommentCount(post.getCommentCount());

        // 작성일시
        dto.setCreatedAt(post.getCreatedAt());

        // soft delete 상태
        dto.setDeleted(post.isDeleted());

        // ✅ retweetCount는 Service에서 별도 세팅
        return dto;
    }

    /**
     * ✅ 래퍼 메서드 (서비스 코드에서 호출 용이)
     */
    public static PostResponseDto fromEntity(ExecPost post) {
        return from(post);
    }
}
