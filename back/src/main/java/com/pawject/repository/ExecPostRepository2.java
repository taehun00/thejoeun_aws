//package com.pawject.repository;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import com.pawject.domain.ExecPost;
// 
//
//@Repository  //★
//public interface ExecPostRepository2 extends JpaRepository<ExecPost, Long> { //Entity , PK ★
//	// 해쉬태그 이름으로 게시글 검색 (글 쓰기후 검색확인)
//	List<ExecPost> findByExecHashtags_NameAndDeletedFalse(String name);
//
//	// 조회 :  삭제되지 않은 게시글 
//	List<ExecPost> findByDeletedFalse();
//	
//	// 전체게시글 조회 - Oracle 네이티브 페이징  
//	//org.springframework.data.jpa.repository.Query;
//	//org.springframework.data.repository.query.Param  ##
//    @Query(
//    	      value = "SELECT * FROM ( " +
//    	              "SELECT sn.*, ROWNUM AS rnum " +
//    	              "FROM (SELECT * FROM EXECSNS WHERE DELETED = 0 ORDER BY CREATEDAT DESC) sn " + 
//    	              ") " +
//    	              "WHERE rnum BETWEEN :start AND :end",
//    	      nativeQuery = true
//    	)  
//    List<ExecPost> findPostsWithPaging(@Param("start") int start, @Param("end") int end);  
// 
//    // 특정유저가 좋아요한 게시물
//    @Query(
//    	      value = "SELECT * FROM ( " +
//    	              "SELECT sn.*, ROWNUM AS rnum " +
//    	              "FROM ( " +
//    	              "   SELECT sns.* " +
//    	              "   FROM EXECSNS sns " +
//    	              "   WHERE sn.POSTID IN ( " +
//    	              "       SELECT DISTINCT sn.EXECPOSTID" +
//    	              "       FROM EXECPOSTLIKES pl " +
//    	              "       WHERE pl.USERID = :userId " +
//    	              "   ) AND sns.DELETED = 0 " +  
//    	              "   ORDER BY sns.CREATEDAT DESC " +  
//    	              ") sn " +
//    	              ") " +
//    	              "WHERE rnum BETWEEN :start AND :end",
//    	      nativeQuery = true
//    	 ) 
//    List<ExecPost> findLikedPostsWithPaging(@Param("userId") Long userId , @Param("start") int start, @Param("end") int end);
//	    	     
//    // 내가 쓴글 + 내가 리트윗한 글 (합쳐서 조회)
//    @Query(
//    	      value = "SELECT * FROM ( " +
//    	              "SELECT sn.*, ROWNUM AS rnum " +
//    	              "FROM ( " +
//    	              "   SELECT sn.POSTID, sn.ECONTENT, sn.CREATEDAT, sn.DELETED, sn.UPDATEDAT, sn.USERID " +  
//    	              "   FROM EXECSNS sns " +
//    	              "   WHERE sns.USERID = :userId AND sns.DELETED = 0 " +
//    	              "   UNION ALL " +
//    	              "   SELECT sns.POSTID, sns.ECONTENT, sns.CREATEDAT, sns.DELETED, sns.UPDATEDAT, sns.USERID " + 
//    	              "   FROM EXECSNS sns " +
//    	              "   WHERE sns.POSTID IN ( " +
//    	              "       SELECT DISTINCT r.ORIGINAL_POST_ID " +
//    	              "       FROM RETWEETS r " +
//    	              "       WHERE r.USERID = :userId " +
//    	              "   ) AND po.DELETED = 0 " +
//    	              "   ORDER BY CREATEDAT DESC " +  
//    	              ") sn " +
//    	              ") " +
//    	              "WHERE rnum BETWEEN :start AND :end",
//    	      nativeQuery = true
//    	    )  
//    List<ExecPost> findMyPostsAndRetweetsWithPaging(@Param("userId") Long userId , @Param("start") int start, @Param("end") int end);
//
//    /////////////////////////////////
//    //List<ExecPost>  findPostsWithPaging( @Param("start") int start, @Param("end") int end );
//}
//
//
///*
//CREATE : save     -   INSERT INTO  테이블명 (컬럼1,컬럼2,,) values (?,?,,)
//READ   : findAll  -   SELECT  * from 테이블명  
//         findById -   SELECT  * from 테이블명   where id=? 
//UPDATE : save     -   update  테이블명   set 컬럼1=? ,컬럼2=?  where   id=? 
//DELETE : deleteById - delete from 테이블명   where id=?
//*/