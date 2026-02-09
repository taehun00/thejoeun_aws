package com.pawject.dao.exec;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.pawject.dto.exec.ExecSnsDto;

@Mapper
public interface ExecSnsDao {
	public int insertsns(  ExecSnsDto sdto);
	public int updatesns(  ExecSnsDto sdto);
	public int updateHitsns( int postid ); 
	public int deletesns(  int postid  );
	public List<ExecSnsDto> selectAllsns();
	public ExecSnsDto       selectsns(int postid);
	
	/* SELECT POSTS - AI_검색결과 */
	public List<ExecSnsDto> selectPosts(String keyword); 
	
	
	/* PAGING */
	public List<ExecSnsDto> selectsns10(HashMap<String,Integer> para);
	public int		    selectsnsTotalCnt();
	
	/* SEARCH + PAGING */
	public List<ExecSnsDto> selectsns3(HashMap<String, Object> para); //##
	public int				  selectsnsSearchTotalCnt(String search); //##
	
}

