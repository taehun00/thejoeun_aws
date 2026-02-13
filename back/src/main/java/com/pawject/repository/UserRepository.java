package com.pawject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pawject.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {


	// 로그인 / 회원 조회 (Oracle 11g 호환)
	@Query(
	    value = "SELECT * FROM users u WHERE u.email = :email AND u.provider = :provider AND ROWNUM = 1",
	    nativeQuery = true
	)
	Optional<User> findByEmailAndProviderNative(
	    @Param("email") String email,
	    @Param("provider") String provider
	);

    // 이메일 중복 체크
	@Query(
			value = "SELECT COUNT(*) FROM users u WHERE u.email = :email AND u.provider = :provider",
		    nativeQuery = true
		)
		int existsByEmailAndProviderNative(
		    @Param("email") String email,
		    @Param("provider") String provider
		);

    // 닉네임 중복체크
    Optional<User> findByNickname(String nickname);

    
    // 관리자 기능: 이메일로 사용자 조회
    @Query(
    	    value = "SELECT * FROM users u WHERE u.email = :email AND ROWNUM = 1",
    	    nativeQuery = true
    	)
    Optional<User> findByEmail(@Param("email") String email);


    // 관리자 기능: 이메일로 삭제
    void deleteByEmail(String email);
}