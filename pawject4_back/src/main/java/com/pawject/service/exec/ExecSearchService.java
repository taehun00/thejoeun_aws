package com.pawject.service.exec;

import java.util.List;

import com.pawject.dto.exec.ExecSearchDto;

public interface ExecSearchService {
	public int insertinfo(  ExecSearchDto idto);
//	public int updateinfo(  ExecSearchDto idto);
//	public int deleteinfo(  int execid);
//	public List<ExecSearchDto> selectAllinfo();
	public ExecSearchDto       selectinfo(int execid);
//	public ExecSearchDto		 selectinfoUpdateForm(int execid);
	
	/* PAGING */
	public List<ExecSearchDto> selectinfo10(int pageNo);
	public int	       selectinfoTotalCnt();
	
	/* SEARCH + PAGING */
	public List<ExecSearchDto> selectinfo3( String keyword, int pageNo ); //##
	public int				   selectinfoSearchTotalCnt(String keyword); //##

}
