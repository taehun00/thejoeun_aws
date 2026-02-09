package com.pawject.dao.support;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.support.FAQDto;
@Mapper
public interface FAQDao {
	
	//<select resultMap="FAQMap" id="selectFAQAll">
	public List<FAQDto> selectFAQAll();
	
	//<select resultMap="FAQMap" id="selectFAQ" parameterType="int">
	public FAQDto selectFAQ(Long faqid);
	
	//  <update id="updateFAQ" parameterType="FAQDto">
	public int updateFAQ(FAQDto dto);
	
	//<insert id="insertFAQ" parameterType="FAQDto">
	public int insertFAQ(FAQDto dto);
	
	//<update id="activeFAQ" parameterType="FAQDto">
	public int activeFAQ(FAQDto dto);

	//<select resultMap="FAQMap" id="selectFAQActive">
	public List<FAQDto> selectFAQActive();
}
