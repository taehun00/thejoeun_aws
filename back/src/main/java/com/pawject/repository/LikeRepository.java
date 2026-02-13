package com.pawject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.Like;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    // 리뷰 좋아요 수
    long countByReviewId(Long reviewId);

    // 체험단 좋아요 수
    long countByTester_Testerid(Long testerId);
    
    // 특정 유저가 리뷰 좋아요 여부
    long countByUser_UserIdAndReviewId(Long userId, Long reviewId);

    // 특정 유저가 체험단 좋아요 여부
    long countByUser_UserIdAndTester_Testerid(Long userId, Long testerId);

    // 리뷰 좋아요 취소
    @Modifying
    @Transactional
    @Query("DELETE FROM Like l WHERE l.user.id = :userId AND l.reviewId = :reviewId")
    void deleteByUserAndReview(@Param("userId") Long userId, @Param("reviewId") Long reviewId);

    // 체험단 좋아요 취소
    @Modifying
    @Transactional
    @Query("DELETE FROM Like l WHERE l.user.id = :userId AND l.tester.id = :testerId")
    void deleteByUserAndTester(@Param("userId") Long userId, @Param("testerId") Long testerId);

    Optional<Like> findByUser_UserIdAndReviewId(Long userId, Long reviewId);
    Optional<Like> findByUser_UserIdAndTester_Testerid(Long userId, Long testerId);

    @Query(
            value = """
                SELECT CASE
                         WHEN COUNT(*) > 0 THEN 1
                         ELSE 0
                       END
                FROM likes
                WHERE user_id = :userId
                  AND review_id = :reviewId
            """,
            nativeQuery = true
        )
        int isLikedReview(
                @Param("userId") Long userId,
                @Param("reviewId") Long reviewId
        );
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Like l WHERE l.tester.testerid = :testerId")
    void deleteByTesterId(@Param("testerId") Long testerId);
}	
