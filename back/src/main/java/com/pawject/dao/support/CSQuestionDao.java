package com.pawject.dao.support;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.pawject.dto.support.CSQuestionDto;

@Mapper
public interface CSQuestionDao {
	
	//  <select resultMap="CSQuestionMap" id="selectCSQAll">
	public List<CSQuestionDto> selectCSQAll();
	
	//  <select resultMap="CSQuestionMap" id="selectCSQ" parameterType="int">
	public 	CSQuestionDto selectCSQ(int questionid);
	
	//  <insert id="insertCSQ" parameterType="CSQuestionDto">
	public int insertCSQ(CSQuestionDto dto);
	
	//  <update id="answerCSQ" parameterType="CSQuestionDto">
	public int answerCSQ(CSQuestionDto dto);
	
	//  <delete id="deleteCSQ" parameterType="int">
	public int deleteCSQ(int questionid);
	
	// <select resultMap="CSQuestionMap" id="selectCSQUser" parameterType="CSQuestionDto">
	public List<CSQuestionDto> selectCSQUser(CSQuestionDto dto); 

	@Select("SELECT * FROM CSQUESTION WHERE USERID = (SELECT USERID FROM USERS WHERE EMAIL = #{email})")
	List<CSQuestionDto> selectCSQByEmail(@Param("email") String email);
	
	@Select("SELECT USERID FROM USERS WHERE EMAIL = #{email}")
	int selectUserIdByEmail(@Param("email") String email);
	
	
	
	//관리자용 페이징+서치
	
//	<select  id="select10CSQ"  parameterType="java.util.HashMap"  resultMap="CSQuestionMap">
	public List<CSQuestionDto> select10CSQ (HashMap<String,Object> para);

//	<select  id="selectTotalCntCSQ"  resultType="int">
	public int selectTotalCntCSQ();
	
//	<select  id="selectSearchCSQ"  parameterType="java.util.HashMap"  resultMap="CSQuestionMap">
	public List<CSQuestionDto> selectSearchCSQ(HashMap<String,Object> para);
	
//	<select id="selectSearchTotalCntCSQ" parameterType="string" resultType="int">	
	public int selectSearchTotalCntCSQ(Map<String, Object> para);
}
