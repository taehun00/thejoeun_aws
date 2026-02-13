package com.pawject.dao.tester;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.tester.TesterImgDto;

@Mapper
public interface TesterImgDao {
	

	public TesterImgDto testerImgSelectByImgid(Long testerimgid);

	public int insertTesterImg(Map<String, Object> param);

	public List<TesterImgDto> selectImgsByTesterid(Long testerid);

	public int deleteTesterImgById(Long testerimgid);

	public int deleteImgsByTesterid(Long testerid);
}
