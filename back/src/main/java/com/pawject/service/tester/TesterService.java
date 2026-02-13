package com.pawject.service.tester;

import java.util.List;
import java.util.Map;

import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.tester.TesterAdminRequestDto;
import com.pawject.dto.tester.TesterAdminResponseDto;
import com.pawject.dto.tester.TesterImgDto;
import com.pawject.dto.tester.TesterUserRequestDto;
import com.pawject.dto.tester.TesterUserResponseDto;

public interface TesterService {

	public TesterAdminResponseDto selectTesterById(Long testerid);
	public List<TesterAdminResponseDto> select20Tester(String condition, int pageNo);
	public int countByTesterPaging(String condition);

	public List<TesterAdminResponseDto> searchTester( String keyword, String searchType, String condition, int pageNo);
	public int searchTesterCnt(String keyword, String searchType, String condition);


	public Long updateIsnotice(Long testerid);
	public Long selectIsnotice(Long testerid);
	public Long updateStatus(Long testerid);
	public Long selectStatus(Long testerid);
	public int updateViews(Long testerid);
	

	public int testerUserInsert(TesterUserRequestDto dto, List<MultipartFile> files);
	public int testerAdminInsert(TesterAdminRequestDto dto, List<MultipartFile> files);
	public int testerUserUpdate(TesterUserRequestDto dto, List<MultipartFile> files, List<Long> keepImgIds);
	public int testerAdminUpdate(TesterAdminResponseDto dto, List<MultipartFile> files, List<Long> keepImgIds);
	public int testerDeleteById(Long testerid, Authentication authentication);

	
	//img
	public TesterImgDto testerImgSelectByImgid(Long testerimgid);
	public int insertTesterImg(Map<String, Object> param);
	public List<TesterImgDto> selectImgsByTesterid(Long testerid);
	public int deleteTesterImgById(Long testerimgid);
	public int deleteImgsByTesterid(Long testerid);
	
}
