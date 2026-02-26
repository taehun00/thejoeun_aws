package com.pawject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pawject.domain.ExecHashtag;

@Repository  //★
public interface ExecHashtagRepository extends JpaRepository<ExecHashtag, Long> { //Entity , PK ★
	// 해쉬태그 키워드를 넣어주면 post에서 join해서 데이터 가져오기 > join sql 구문찾기 ##
	@Query("SELECT h  FROM  ExecHashtag  h  JOIN FETCH h.posts  WHERE h.name= :name")
	Optional<ExecHashtag> findByNameWithPosts( @Param("name") String name);
	//java.util.Optional
	//org.springframework.data.repository.query.Param
	
	Optional<ExecHashtag> findByName(String name);
}

/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/