package com.pawject.service.exec;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.pawject.dto.exec.ExecSnsDto;


public interface ExecSnsService {
	public int insertsns( MultipartFile file , ExecSnsDto sdto);
	public int updatesns( MultipartFile file , ExecSnsDto sdto);
	public int deletesns(  int postid );
	public List<ExecSnsDto> selectAllsns();
	public ExecSnsDto       selectsns(int postid);
	public ExecSnsDto       selectsnsUpdateForm(int postid); 
	
	/* SELECT POSTS - AI_검색결과 */
	public List<ExecSnsDto> selectPosts(String keyword); 

	
	/* PAGING */
	public List<ExecSnsDto> selectsns10(int pageNo);
	public int		    selectsnsTotalCnt();
	
	/* SEARCH + PAGING */
	public List<ExecSnsDto> selectsns3( String keyword, int pageNo ); //##
	public int				  selectsnsSearchTotalCnt(String keyword); //##

}
