package com.pawject.service.execsns;

import java.util.List; // ✅ List 사용
import java.util.stream.Collectors; // ✅ Stream API 사용

import org.springframework.stereotype.Service; // ✅ Service 어노테이션
import org.springframework.transaction.annotation.Transactional; // ✅ 트랜잭션 관리

import com.pawject.domain.ExecComment;
import com.pawject.domain.ExecPost;
import com.pawject.domain.User;
import com.pawject.dto.execsns.CommentRequestDto;
import com.pawject.dto.execsns.CommentResponseDto;
import com.pawject.repository.ExecCommentRepository;
import com.pawject.repository.ExecPostRepository;
import com.pawject.repository.ExecUserRepository;

import lombok.RequiredArgsConstructor; // ✅ 생성자 주입

/**
 * 댓글 서비스
 * - 생성(Create), 조회(Read), 수정(Update), 삭제(Delete), 카운트(Count)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ExecCommentService {

    private final ExecCommentRepository commentRepository;    //댓글작성
    private final ExecUserRepository userRepository;    // 사용자
    private final ExecPostRepository    postRepository;  // 게시글

    //////  댓글 생성 
    public CommentResponseDto createComment( Long userId , CommentRequestDto dto    ) {
        // 사용자 조회
    		User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));  

    		ExecPost    post = postRepository.findById(  dto.getPostId()   )
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));  
    		 
        // 댓글 설정 
    		ExecComment comment = new ExecComment();
    		comment.setContent(dto.getContent());
    		comment.setUser(user);
    		comment.setPost(post); 
        commentRepository.save(comment);  
        
        // 댓글 dto 
        return CommentResponseDto.builder()
                .id(comment.getId())
                .authorId(comment.getUser().getUserId())
                .content(comment.getContent())
                .authorNickname(comment.getUser().getNickname())
                .createdAt(comment.getCreatedAt())
                .build();
    }
  
    // 해당 게시글의 댓글들 조회
    public List<CommentResponseDto> getCommentsByPost(Long postId) {
        return commentRepository.findByPost_IdAndDeletedFalse(postId).stream()
                .map(c -> CommentResponseDto.builder()
                        .id(c.getId())
                        .authorId(c.getUser().getUserId())
                        .content(c.getContent())
                        .authorNickname(c.getUser().getNickname())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
 
    // 댓글수정
    public CommentResponseDto updateComment(Long userId, Long commentId, CommentRequestDto dto) {
        // 댓글조회
    	ExecComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));  
        // 작성자 본인
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한 없음");  
        }
        // 댓글 내용 수정
        comment.setContent(dto.getContent()); 
        // 댓글 수정
        commentRepository.save(comment);  
        // 댓글 dto 
        return CommentResponseDto.builder()
                .id(comment.getId())
                .authorId(comment.getUser().getUserId())
                .content(comment.getContent())
                .authorNickname(comment.getUser().getNickname())
                .createdAt(comment.getCreatedAt())
                .build();
    }
    
    // 댓글삭제( 소프트 삭제)
    public void deleteComment(Long userId, Long commentId) {
    		// 댓글 조회
    	ExecComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));  
        // 작성자 본인확인
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한 없음");  
        }
        // 삭제 플래그 설정
        comment.setDeleted(true);  
        commentRepository.save(comment);  // 수정반영
    }
    // 게시글의 댓글 수 집계
    public long countComments(Long postId) {
        return commentRepository.countByPost_IdAndDeletedFalse(postId);  
    }
}
