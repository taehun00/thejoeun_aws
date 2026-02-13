package com.pawject.service.exec;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dao.exec.ExecSnsDao;
import com.pawject.dto.exec.ExecSnsDto;
import com.pawject.util.UtilUpload;

@Service
public class ExecSnsServiceImpl implements ExecSnsService {

	@Autowired ExecSnsDao sdao;
	@Autowired UtilUpload   supload;
	
	@Override public int insertsns(MultipartFile file, ExecSnsDto sdto) { 
		if(!file.isEmpty()) {
			try { sdto.setEimg(supload.fileUpload(file)); } 
			catch (IOException e) { e.printStackTrace(); }
		}
		return sdao.insertsns(sdto); 
	}
	
	@Override public int updatesns(MultipartFile file, ExecSnsDto sdto) {
		if(!file.isEmpty()) {
			try { sdto.setEimg(supload.fileUpload(file)); } 
			catch (IOException e) { e.printStackTrace(); }
		}
		return sdao.updatesns(sdto); 
	}
	
	@Override public int deletesns(int postid) { return sdao.deletesns(postid); }
	@Override public List<ExecSnsDto> selectAllsns() { return sdao.selectAllsns(); }
	@Override public ExecSnsDto selectsns(int postid) { sdao.updateHitsns(postid); return sdao.selectsns(postid); }
	@Override public ExecSnsDto selectsnsUpdateForm(int postid) { return sdao.selectsns(postid); }

	/* SELECT POSTS - AI_검색결과 */
	@Override
	public List<ExecSnsDto> selectPosts(String keyword) {
		return sdao.selectPosts(keyword);
	}
	
	
	
	
	
	/* PAGING */
	@Override 
	public List<ExecSnsDto> selectsns10(int pageNo) {
		HashMap<String, Integer> para = new HashMap<>();
		int start = (pageNo-1)*10 + 1; //(1)1
		int end   = start + 9;
		
		para.put("start", start);
		para.put("end", end);
		
		return sdao.selectsns10(para); 
	}
	@Override public int selectsnsTotalCnt() { return sdao.selectsnsTotalCnt(); }
	
	/* SEARCH + PAGING */
	@Override public List<ExecSnsDto> selectsns3(String keyword, int pageNo) {
		HashMap<String, Object> para = new HashMap<>();
		int pageSize=3;
		para.put("search", keyword);
		
		int start = (pageNo-1)*pageSize+1;
		para.put("start", start);
		para.put("end", start + pageSize-1);
		
		return sdao.selectsns3(para); 
	}
	@Override public int selectsnsSearchTotalCnt(String keyword) { return sdao.selectsnsSearchTotalCnt(keyword); }

}
