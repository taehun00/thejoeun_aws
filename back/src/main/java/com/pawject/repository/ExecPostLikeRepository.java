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
	long countByPost_Id(Long postId);

	long countByUser_UserIdAndPost_Id(Long userId, Long postId);

	@Modifying
	@Transactional
	@Query("DELETE FROM ExecPostLike pl WHERE pl.user.userId = :userId AND pl.post.id = :postId")
	void deleteByUserAndPost(@Param("userId") Long userId, @Param("postId") Long postId);

	Optional<ExecPostLike> findByUser_UserIdAndPost_Id(Long userId, Long postId);
}
 
/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/