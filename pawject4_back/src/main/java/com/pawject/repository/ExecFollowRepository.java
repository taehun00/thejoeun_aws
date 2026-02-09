package com.pawject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.ExecFollow;


@Repository  //★
public interface ExecFollowRepository extends JpaRepository<ExecFollow, Long> { //Entity , PK ★
    // 팔로우 관계 단건 조회  (findBy)
	Optional<ExecFollow>  findByFollower_UserIdAndFollowee_UserId(Long followerId  , Long followeeId);

	
    // 팔로잉 목록 조회 (지연 로딩 방지: followee 조인 : findBy)  
	@EntityGraph(attributePaths = {"followee"})
	List<ExecFollow> findByFollower_UserId(Long followerId);

    // 팔로워 목록 조회 (지연 로딩 방지: follower 조인 :  findBy) 
	@EntityGraph(attributePaths = {"follower"})
	List<ExecFollow> findByFollowee_UserId(Long followeeId);
	
	
    /////////////////////////////////////////////
    // 팔로잉 수 집계   (countBy)

	long countByFollower_UserId(Long followerId); 

    // 팔로워 수 집계   (countBy)
	long countByFollowee_UserId(Long followeeId);   	

	
}

/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/