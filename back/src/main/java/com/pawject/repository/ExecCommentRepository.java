package com.pawject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.ExecComment;


@Repository  //★
public interface ExecCommentRepository extends JpaRepository<ExecComment, Long> { //Entity , PK ★
	//특정게시글의 삭제되지 않은 댓글 목록 조회 
	List<ExecComment> findByExecPost_PostidAndDeletedFalse(Long execPost); // Comment 엔티티 post필드 확인, 그 안에 id가 매핑
	
	//삭제되지 않은 댓글 수 집계
	 long countByExecPost_PostidAndDeletedFalse(Long postid);// Comment 엔티티 post필드 확인, 그 안에 id가 매핑
}

/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/