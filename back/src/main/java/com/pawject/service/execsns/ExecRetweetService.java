package com.pawject.service.execsns;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.ExecPost;
import com.pawject.domain.ExecRetweet;
import com.pawject.domain.User;
import com.pawject.dto.execsns.RetweetRequestDto;
import com.pawject.dto.execsns.RetweetResponseDto;
import com.pawject.repository.ExecPostRepository;
import com.pawject.repository.ExecRetweetRepository;
import com.pawject.repository.ExecUserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class ExecRetweetService {

    private final ExecRetweetRepository retweetRepository;
    private final ExecUserRepository userRepository;
    private final ExecPostRepository postRepository;
    // 리트윗추가
    public RetweetResponseDto addRetweet(Long userId, RetweetRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        ExecPost post = postRepository.findById(dto.getOriginalPostId())
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        if (retweetRepository.countByUserAndOriginalPost(userId, dto.getOriginalPostId()) > 0) {
            throw new IllegalStateException("이미 리트윗한 게시글입니다.");
        }

        ExecRetweet saved = retweetRepository.save(new ExecRetweet(user, post));
        long count = retweetRepository.countByOriginalPost_Id(post.getId());  

        return RetweetResponseDto.builder()
                .id(saved.getId())
                .userId(user.getUserId())
                .originalPostId(post.getId())
                .createdAt(saved.getCreatedAt())
                .retweetCount(count) 
                .build();
    }

    // 특정유저가 특정게시글의 리트윗했는지 여부
    @Transactional(readOnly = true)
    public boolean hasRetweeted(Long userId, Long postId) {
        return retweetRepository.countByUserAndOriginalPost(userId, postId) > 0;
    }

    // 게시글의 리트윗수
    @Transactional(readOnly = true)
    public long countRetweets(Long postId) {
        return retweetRepository.countByOriginalPost_Id(postId);
    }

    // 리트윗 취소
    public RetweetResponseDto removeRetweet(Long userId, Long postId) {
        ExecRetweet retweet = retweetRepository.findByUserAndOriginalPost(userId, postId)
                .orElseThrow(() -> new IllegalStateException("리트윗 없음"));

        if (!retweet.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한 없음");
        }

        retweetRepository.delete(retweet);
        long count = retweetRepository.countByOriginalPost_Id(postId);  

        return RetweetResponseDto.builder()
                .id(retweet.getId())
                .userId(userId)
                .originalPostId(postId)
                .createdAt(retweet.getCreatedAt())
                .retweetCount(count)  
                .build();
    }
 
	@Transactional(readOnly = true)
	public List<Long> findMyRetweets(Long userId) {
	    return retweetRepository.findOriginalPostIdsByUserId(userId);  
	}
}
