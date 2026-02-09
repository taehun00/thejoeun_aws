package com.pawject.dao.tester;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.security.core.Authentication;

import com.pawject.dto.tester.TesterAdminRequestDto;
import com.pawject.dto.tester.TesterAdminResponseDto;
import com.pawject.dto.tester.TesterUserRequestDto;
@Mapper
public interface TesterDao {

//	<!--페이징+정렬(1)-->
//	<select resultMap="testerMap" id="select20Tester" parameterType="java.util.HashMap">
	public List<TesterAdminResponseDto> select20Tester(HashMap<String,Object> para);
	 
//<!--페이징+정렬-카운트(2)-->
//<select id="countByTesterPaging" parameterType="java.util.HashMap">
	public int countByTesterPaging(HashMap<String,Object> para);
	
//<!--페이징+정렬+검색(3)-->
//<select resultMap="testerMap" id="searchTester" parameterType="java.util.HashMap">
	public List<TesterAdminResponseDto> searchTester(HashMap<String,Object> para);
	
//<!--페이징+정렬+검색-카운트(4)-->
//<select resultType="int" id="searchTesterCnt" parameterType="java.util.HashMap">
	public int searchTesterCnt(HashMap<String,Object> para);

//<!--공지 올리고 내리기 0공지x 1공지중 -->
//<update id="updateIsnotice" parameterType="int">
	public long updateIsnotice(Long testerid);
//반환<select id="selectIsnotice" resultType="int">
	public long selectIsnotice(Long testerid);
//<!--모집 여부 0모집중 1모집완료 -->
//<update id="updateStatus" parameterType="int">
	public long updateStatus(Long testerid);
//반환<select id="selectStatus" resultType="int">
	public long selectStatus(Long testerid);
//<!--조회수 증가-->
//<update id="updateViews" parameterType="int">
	public int updateViews(Long testerid);
	
	
	///추가

//	<!-- 글쓰기(유저)-->
//	<insert id="testerUserInsert" parameterType="com.pawject.dto.tester.TesterUserRequestDto"> 
	public int testerUserInsert(TesterUserRequestDto dto);
	
	//	<!-- 글쓰기(관리자)-->
//	<insert id="testerAdminInsert" parameterType="com.pawject.dto.tester.TesterAdminRequestDto">
	public int testerAdminInsert(TesterAdminRequestDto dto);
	
//	<!-- 수정(유저)-->
//	<update id="testerUserUpdate" parameterType="com.pawject.dto.tester.TesterUserRequestDto">
	public int testerUserUpdate(TesterUserRequestDto dto);
	
//	<!-- 수정(관리자)-->
//	<update id="testerAdminUpdate" parameterType="com.pawject.dto.tester.TesterAdminResponseDto">
	public int testerAdminUpdate(TesterAdminResponseDto dto);
	
//	<!-- 삭제(소프트딜리트) -->
//	<update id="testerDeleteById" parameterType="long">
	public int testerDeleteById(Long testerid);
	
	//단건조회
	public TesterAdminResponseDto selectTesterById(Long testerid);
	
}
