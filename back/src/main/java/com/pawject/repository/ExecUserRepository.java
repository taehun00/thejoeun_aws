package com.pawject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.User;


@Repository  //★
public interface ExecUserRepository extends JpaRepository<User, Long> { //Entity , PK ★
	//email + provider로 사용자 조회
	Optional<User> findByEmailAndProvider(String email, String provider);
	Optional<User> findByEmail(String email);

	//닉네임중복
	long  countByNickname(String nickname);
	default boolean existsByNickname(String nickname) {
		return  countByNickname(nickname) >0 ;
	} 

	//이메일중복
	long  countByEmail(   String email   );
	default boolean existsByEmail(String email) {
		return  countByEmail(email) >0 ;
	}  
}

/*
CREATE : save     -   INSERT INTO appuser (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from appuser 
         findById -   SELECT  * from appuser  where id=? 
UPDATE : save     -   update  appuser  set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from appuser  where id=?
 
          사용자      관리자
CREATE    ◎회원가입    ◎회원가입
READ      로그인, 이메일중복, 닉네임중복 
UPDATE    ◎닉네임수정, ◎이미지수정
DELETE    ◎회원탈퇴
*/