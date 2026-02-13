package com.pawject.service.like;

import com.pawject.dao.review.ReviewDao;
import com.pawject.domain.Like;
import com.pawject.domain.Tester;
import com.pawject.domain.User;
import com.pawject.dto.like.LikeRequestDto;
import com.pawject.dto.like.LikeResponseDto;
import com.pawject.repository.LikeRepository;
import com.pawject.repository.TesterRepository;
import com.pawject.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final TesterRepository testerRepository;
    private final ReviewDao reviewDao;

    // 좋아요 추가
    public LikeResponseDto addLike(Long userId, LikeRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        if(dto.getReviewId() != null) { // 리뷰 좋아요
            Long reviewId = dto.getReviewId();
            if(reviewDao.reviewSelect(dto.getReviewId().intValue()) == null) {
                throw new IllegalArgumentException("리뷰 게시글 없음");
            }

            if(likeRepository.countByUser_UserIdAndReviewId(userId, reviewId) > 0) {
                long count = likeRepository.countByReviewId(reviewId);
                return LikeResponseDto.builder()
                        .reviewId(reviewId)
                        .count(count)
                        .build();
            }

            likeRepository.save(new Like(user, reviewId));
            long count = likeRepository.countByReviewId(reviewId);
            return LikeResponseDto.builder()
                    .reviewId(reviewId)
                    .count(count)
                    .build();
        } else if(dto.getTesterId() != null) { // 체험단 좋아요
            Tester tester = testerRepository.findById(dto.getTesterId())
                    .orElseThrow(() -> new IllegalArgumentException("체험단 게시글 없음"));

            if(likeRepository.countByUser_UserIdAndTester_Testerid(userId, tester.getTesterid()) > 0) {
                long count = likeRepository.countByTester_Testerid(tester.getTesterid());
                return LikeResponseDto.builder()
                        .testerId(tester.getTesterid())
                        .count(count)
                        .build();
            }

            likeRepository.save(new Like(user, tester));
            long count = likeRepository.countByTester_Testerid(tester.getTesterid());
            return LikeResponseDto.builder()
                    .testerId(tester.getTesterid())
                    .count(count)
                    .build();
        } else {
            throw new IllegalArgumentException("게시글 ID 필요");
        }
    }

    // 좋아요 수 조회
    @Transactional(readOnly = true)
    public long countLikesReview(Long reviewId) {
        return likeRepository.countByReviewId(reviewId);
    }

    @Transactional(readOnly = true)
    public long countLikesTester(Long testerId) {
        return likeRepository.countByTester_Testerid(testerId);
    }

    // 좋아요 취소
    public LikeResponseDto removeLikeReview(Long userId, Long reviewId) {
        likeRepository.deleteByUserAndReview(userId, reviewId);
        long count = likeRepository.countByReviewId(reviewId);
        return LikeResponseDto.builder()
                .reviewId(reviewId)
                .count(count)
                .build();
    }

    public LikeResponseDto removeLikeTester(Long userId, Long testerId) {
        likeRepository.deleteByUserAndTester(userId, testerId);
        long count = likeRepository.countByTester_Testerid(testerId);
        return LikeResponseDto.builder()
                .testerId(testerId)
                .count(count)
                .build();
    }

    // 좋아요 여부
    @Transactional(readOnly = true)
    public boolean hasLikedReview(Long userId, Long reviewId) {
        return likeRepository.countByUser_UserIdAndReviewId(userId, reviewId) > 0;
    }

    @Transactional(readOnly = true)
    public boolean hasLikedTester(Long userId, Long testerId) {
        return likeRepository.countByUser_UserIdAndTester_Testerid(userId, testerId) > 0;
    }
    
    @Transactional(readOnly = true)
    public boolean isLikedReview(Long userId, Long reviewId) {
        return likeRepository.isLikedReview(userId, reviewId) == 1;
    }
}
