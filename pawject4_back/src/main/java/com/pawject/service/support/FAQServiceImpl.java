package com.pawject.service.support;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pawject.dao.support.FAQDao;
import com.pawject.dto.support.FAQDto;
@Service
public class FAQServiceImpl implements FAQService {
	@Autowired FAQDao dao;
	
	@Override
	public List<FAQDto> selectFAQAll() {
		return dao.selectFAQAll();
	}

	@Override
	public FAQDto selectFAQ(Long faqid) {
		return dao.selectFAQ(faqid);
	}

	@Override
	public int insertFAQ(FAQDto dto) {
		return dao.insertFAQ(dto);
	}

	@Override
	public int activeFAQ(FAQDto dto) {
		return dao.activeFAQ(dto);
	}

	@Override
	public int updateFAQ(FAQDto dto) {
		return dao.updateFAQ(dto);
	}

	@Override
	public List<FAQDto> selectFAQActive() {
		return dao.selectFAQActive();
	}

}
