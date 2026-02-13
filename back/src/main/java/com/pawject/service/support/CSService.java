package com.pawject.service.support;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.pawject.dto.support.CSAnswerDto;
import com.pawject.dto.support.CSQuestionDto;

public interface CSService {

	//질문
	public List<CSQuestionDto> selectCSQAll();
	public 	CSQuestionDto selectCSQ(int questionid);
	public int insertCSQ(CSQuestionDto dto);
	public int answerCSQ(CSQuestionDto dto);
	public int deleteCSQ(int questionid);
	public List<CSQuestionDto> selectCSQUser(CSQuestionDto dto); 
	
	//메일로 아이디 조회
	List<CSQuestionDto> selectCSQByEmail(@Param("email") String email);
	int selectUserIdByEmail(@Param("email") String email);
	
	//답변
	public int insertCSA(CSAnswerDto dto);
	public List<CSAnswerDto> selectByQuestionid(int questionid);
	
	
	//페이징
	public List<CSQuestionDto> select10CSQ (String condition, int pageNo);
	public int selectTotalCntCSQ();
	
	//페이징+서치
	public List<CSQuestionDto> selectSearchCSQ( String keyword, String searchType, String condition, int pageNo);
	int selectSearchTotalCntCSQ(String keyword, String searchType, String condition);
	
}
