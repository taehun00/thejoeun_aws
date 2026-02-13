package com.pawject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.ExecImage;


@Repository  //★
public interface ExecImageRepository extends JpaRepository<ExecImage, Long> { //Entity , PK ★
    // 특정 게시글에 속한 이미지 목록 조회
    List<ExecImage> findByExecPost_Postid(Long execPostId);
}

/*
CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
READ   : findAll  -   SELECT  * from 테이블명  
         findById -   SELECT  * from 테이블명   where id=? 
UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
DELETE : deleteById - delete from 테이블명   where id=?
*/