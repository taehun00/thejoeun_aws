package com.pawject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.ExecPost;
import com.pawject.domain.ExecRetweet;

public interface ExecRetweetRepository extends JpaRepository<ExecRetweet, Long> {

    // 특정 유저의 특정 게시글 리트윗 조회
    @Query("SELECT r FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.id = :postId")
    Optional<ExecRetweet> findByUserAndOriginalPost(@Param("userId") Long userId,
                                                    @Param("postId") Long postId);

    // 중복 리트윗 방지
    @Query("SELECT COUNT(r) FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.id = :postId")
    long countByUserAndOriginalPost(@Param("userId") Long userId,
                                    @Param("postId") Long postId);

    // 리트윗 취소
    @Modifying
    @Transactional
    @Query("DELETE FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.id = :postId")
    void deleteByUserAndOriginalPost(@Param("userId") Long userId,
                                     @Param("postId") Long postId);

    // 특정 게시글 리트윗 수
    long countByOriginalPost_Id(Long postId);

    // 특정 유저가 리트윗한 글 ID 목록
    @Query("SELECT r.originalPost.id FROM ExecRetweet r WHERE r.user.userId = :userId")
    List<Long> findOriginalPostIdsByUserId(@Param("userId") Long userId);


    // 내가 리트윗한 글 페이징 (Oracle 11g)
    @Query(
      value = "SELECT * FROM ( " +
              "SELECT p.*, ROWNUM AS rnum " +
              "FROM ( " +
              "   SELECT po.* " +
              "   FROM EXECPOSTS po " +
              "   WHERE po.ID IN ( " +
              "       SELECT DISTINCT r.ORIGINAL_POST_ID " +
              "       FROM EXECRETWEETS r " +
              "       WHERE r.USERID = :userId " +
              "   ) AND po.DELETED = 0 " +
              "   ORDER BY po.CREATED_AT DESC " +
              ") p " +
              ") " +
              "WHERE rnum BETWEEN :start AND :end",
      nativeQuery = true
    )
    List<ExecPost> findRetweetedPostsWithPaging(@Param("userId") Long userId,
                                                @Param("start") int start,
                                                @Param("end") int end);
}
