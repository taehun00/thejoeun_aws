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

    // ✅ 특정 유저의 특정 게시글 리트윗 조회
    @Query("SELECT r FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.postid = :postId")
    Optional<ExecRetweet> findByUserAndOriginalPost(@Param("userId") Long userId, @Param("postId") Long postId);

    // ✅ 중복 리트윗 방지
    @Query("SELECT COUNT(r) FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.postid = :postId")
    long countByUserAndOriginalPost(@Param("userId") Long userId, @Param("postId") Long postId);

    // ✅ 리트윗 취소
    @Modifying
    @Transactional
    @Query("DELETE FROM ExecRetweet r WHERE r.user.userId = :userId AND r.originalPost.postid = :postId")
    void deleteByUserAndOriginalPost(@Param("userId") Long userId, @Param("postId") Long postId);

    // ✅ 특정 게시글의 리트윗 수 집계
    long countByOriginalPost_Postid(Long postId);

    // ✅ 특정 유저가 리트윗한 글 목록 조회
    @Query("SELECT r.originalPost.postid FROM ExecRetweet r WHERE r.user.userId = :userId")
    List<Long> findOriginalPostIdsByUserId(@Param("userId") Long userId);

    // ✅ 내가 리트윗한 글 페이징 조회 (Oracle 11g Native Paging)
    @Query(
        value =
            "SELECT * FROM ( " +
            "   SELECT sn.*, ROWNUM AS rnum " +
            "   FROM ( " +
            "       SELECT sns.* " +
            "       FROM EXECSNS sns " +
            "       WHERE sns.POSTID IN ( " +
            "           SELECT DISTINCT r.ORIGINAL_POST_ID " +
            "           FROM EXECRETWEETS r " +
            "           WHERE r.USERID = :userId " +
            "       ) " +
            "       AND sns.DELETED = 0 " +
            "       ORDER BY sns.CREATEDAT DESC " +
            "   ) sn " +
            ") " +
            "WHERE rnum BETWEEN :start AND :end",
        nativeQuery = true
    )
    List<ExecPost> findRetweetedPostsWithPaging(
        @Param("userId") Long userId,
        @Param("start") int start,
        @Param("end") int end
    );
}
