// src/main/java/com/thejoa703/service/FollowService.java
package com.pawject.service.execsns;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.ExecFollow;
import com.pawject.domain.User;
import com.pawject.dto.execsns.FollowRequestDto;
import com.pawject.dto.execsns.FollowResponseDto;
import com.pawject.repository.ExecFollowRepository;
import com.pawject.repository.ExecUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ExecFollowService { 
    private final ExecFollowRepository followRepository; 
    private final ExecUserRepository userRepository;
    //팔로우
    public FollowResponseDto follow(Long followerId, FollowRequestDto dto) {
        Long followeeId = dto.getFolloweeId();

        if (followerId.equals(followeeId)) {
            throw new IllegalStateException("자기 자신은 팔로우할 수 없습니다.");
        }

        // 이미 팔로우 상태 확인 (핵심 추가)
        return followRepository
                .findByFollower_UserIdAndFollowee_UserId(followerId, followeeId)
                .map(existing -> {
                    // 이미 팔로우 → 언팔 (토글)
                    followRepository.delete(existing);
                    User followee = existing.getFollowee();
                    return FollowResponseDto.of(existing, followee, false);
                })
                .orElseGet(() -> {
                    // 팔로우 안한 상태 → 팔로우 생성
                    User follower = userRepository.findById(followerId)
                            .orElseThrow(() -> new IllegalArgumentException("팔로워 없음"));

                    User followee = userRepository.findById(followeeId)
                            .orElseThrow(() -> new IllegalArgumentException("팔로잉 대상 없음"));

                    ExecFollow saved = followRepository.save(new ExecFollow(follower, followee));
                    return FollowResponseDto.of(saved, followee, true);
                });
    }
    
    // 언팔로우
    public Long unfollow(Long followerId, Long followeeId) {
        followRepository.findByFollower_UserIdAndFollowee_UserId(followerId, followeeId)
            .ifPresent(followRepository::delete);
        return followeeId;
    } 
    //////////////////////////////////////////////////////
    // ✅ Followings 조회  
    @Transactional(readOnly = true)
    public List<FollowResponseDto> getFollowings(Long followerId) {
        return followRepository.findByFollower_UserId(followerId).stream()
            .map(f -> FollowResponseDto.of(f, f.getFollowee(), false))  
            .collect(Collectors.toList());
    }
    // ✅ Followers 조회
    @Transactional(readOnly = true)
    public List<FollowResponseDto> getFollowers(Long followeeId) {
        return followRepository.findByFollowee_UserId(followeeId).stream()
            .map(f -> FollowResponseDto.of(f, f.getFollower(), false))  
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countFollowings(Long followerId) {
        return getFollowings(followerId).size();
    }

    @Transactional(readOnly = true)
    public long countFollowers(Long followeeId) {
        return getFollowers(followeeId).size();
    }
}
