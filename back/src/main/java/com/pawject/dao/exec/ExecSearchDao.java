package com.pawject.dao.exec;

import java.util.HashMap;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.exec.ExecSearchDto;

@Mapper
public interface ExecSearchDao {
	public int insertinfo(  ExecSearchDto idto);
//	public int updateinfo(  ExecSearchDto idto);
//	public int deleteinfo(  int execid);
//	public List<ExecSearchDto> selectAllinfo();
	public ExecSearchDto       selectinfo(int execid);
	
	/* PAGING */
	public List<ExecSearchDto> selectinfo10(HashMap<String,Integer> para);
	public int	       selectinfoTotalCnt();
	/* SEARCH + PAGING */
	public List<ExecSearchDto> selectinfo3(HashMap<String, Object> para); //##
	public int				   selectinfoSearchTotalCnt(String search); //##

	
}
