package com.pawject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pawject.domain.ExecPost;

@Repository
public interface ExecPostRepository extends JpaRepository<ExecPost, Long> {

	// 해쉬태그 이름으로 게시글 검색
	List<ExecPost> findByHashtags_NameAndDeletedFalse(String name);

	// 삭제되지 않은 게시글
	List<ExecPost> findByDeletedFalse();

	// 전체 게시글 페이징 (Oracle 11g)
	@Query(
	      value = "SELECT * FROM ( " +
	              "SELECT p.*, ROWNUM AS rnum " +
	              "FROM (SELECT * FROM EXECPOSTS WHERE DELETED = 0 ORDER BY CREATED_AT DESC) p " +
	              ") " +
	              "WHERE rnum BETWEEN :start AND :end",
	      nativeQuery = true
	)
	List<ExecPost> findPostsWithPaging(@Param("start") int start, @Param("end") int end);


	// 특정 유저가 좋아요한 게시물
	@Query(
	      value = "SELECT * FROM ( " +
	              "SELECT p.*, ROWNUM AS rnum " +
	              "FROM ( " +
	              "   SELECT po.* " +
	              "   FROM EXECPOSTS po " +
	              "   WHERE po.ID IN ( " +
	              "       SELECT DISTINCT pl.EXECPOST_ID " +  
	              "       FROM EXECPOST_LIKES pl " +
	              "       WHERE pl.USERID = :userId " +
	              "   ) AND po.DELETED = 0 " +
	              "   ORDER BY po.CREATED_AT DESC " +
	              ") p " +
	              ") " +
	              "WHERE rnum BETWEEN :start AND :end",
	      nativeQuery = true
	)
	List<ExecPost> findLikedPostsWithPaging(@Param("userId") Long userId,
	                                        @Param("start") int start,
	                                        @Param("end") int end);


	// 내가 쓴 글 + 내가 리트윗한 글
	@Query(
	      value = "SELECT * FROM ( " +
	              "SELECT p.*, ROWNUM AS rnum " +
	              "FROM ( " +
	              "   SELECT po.ID, po.CONTENT, po.CREATED_AT, po.DELETED, po.UPDATED_AT, po.USERID " +
	              "   FROM EXECPOSTS po " +
	              "   WHERE po.USERID = :userId AND po.DELETED = 0 " +
	              "   UNION ALL " +
	              "   SELECT po.ID, po.CONTENT, po.CREATED_AT, po.DELETED, po.UPDATED_AT, po.USERID " +
	              "   FROM EXECPOSTS po " +
	              "   WHERE po.ID IN ( " +
	              "       SELECT DISTINCT r.EXECORIGINAL_POST_ID " +
	              "       FROM EXECRETWEETS r " +
	              "       WHERE r.USERID = :userId " +
	              "   ) AND po.DELETED = 0 " +
	              ") p " +
	              "ORDER BY p.CREATED_AT DESC " +
	              ") " +
	              "WHERE rnum BETWEEN :start AND :end",
	      nativeQuery = true
	)
	List<ExecPost> findMyPostsAndRetweetsWithPaging(@Param("userId") Long userId,
	                                                @Param("start") int start,
	                                                @Param("end") int end);
}
