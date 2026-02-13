package com.pawject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.TesterComment;
@Repository
public interface TesterCommentRepository extends JpaRepository<TesterComment, Long> {
	//글-댓글들 목록
	List<TesterComment> findByTester_TesteridOrderByCreatedatAsc(Long testerid);
	
	Optional<TesterComment> findByTestercommentidAndUser_UserId(Long testercommentid, Long userId);

	// edited state 반영
    List<TesterComment> findByTester_TesteridAndDeletedFalseOrderByCreatedatAsc(Long testerid);
    // 권한체크(본인 댓글만 수정/삭제)
    Optional<TesterComment> findByTestercommentidAndDeletedFalse(Long testercommentid);
}

/**
 */
 