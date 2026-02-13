package com.pawject.dao.support;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.support.CSAnswerDto;

@Mapper
public interface CSAnswerDao {

	//  <insert id="insertCSA" parameterType="CSAnswerDto">
	public int insertCSA(CSAnswerDto dto);
	
	//  <select resultMap="CSAnswerMap" id="selectByQuestionid" parameterType="int">
	public List<CSAnswerDto> selectByQuestionid(int questionid);
}
