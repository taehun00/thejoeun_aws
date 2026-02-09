package com.pawject.repository;

import java.util.Optional; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.ExecPostLike; 

  
@Repository  //★
public interface ExecPostLikeRepository extends JpaRepository<ExecPostLike, Long> { //Entity , PK ★
	// 특정 게시글의 좋아요 수 집계 
	long countByExecPost_Postid(Long postId);
	
	// 특정 유저가 특정 게시글에 좋아요 했는지 여부 
	// PostLike 엔티티에는  Post post , AppUser user 필드와 각각 id가 있는지 확인
	 long countByUser_UserIdAndExecPost_Postid(Long userId, Long postId);
	
	// 좋아요 취소 (조회없이 바로 삭제) 
	    @Modifying
	    @Transactional
	    @Query("DELETE FROM ExecPostLike pl WHERE pl.user.userId = :userId AND pl.execPost.postid = :postId")
	    void deleteByUserAndPost(@Param("userId") Long userId, @Param("postId") Long postId);
	
	// 특정유저의 특정게시글 좋아요 조회
	    Optional<ExecPostLike> findByUser_UserIdAndExecPost_Postid(Long userId, Long postId);
}
 
/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/