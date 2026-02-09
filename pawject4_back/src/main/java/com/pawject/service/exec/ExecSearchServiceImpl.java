package com.pawject.service.exec;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pawject.dao.exec.ExecSearchDao;
import com.pawject.dto.exec.ExecSearchDto;

@Service
public class ExecSearchServiceImpl implements ExecSearchService {
	@Autowired ExecSearchDao idao;
	
	@Override public int insertinfo(ExecSearchDto idto) { return idao.insertinfo(idto); }
//	@Override public int updateinfo(ExecSearchDto idto) { return idao.updateinfo(idto); }
//	@Override public int deleteinfo(int execid) { return idao.deleteinfo(execid); }
//	@Override public List<ExecSearchDto> selectAllinfo() {  return idao.selectAllinfo(); }
	@Override public ExecSearchDto selectinfo(int execid) { return idao.selectinfo(execid); }
//	@Override public ExecSearchDto selectinfoUpdateForm(int execid) { return idao.selectinfo(execid); }

	/* PAGING */
	@Override public List<ExecSearchDto> selectinfo10(int pageNo) { 
		HashMap<String,Integer>   para = new HashMap<>();
		int start = (pageNo-1)*10 + 1;  //(1)1    (2)11  (2)21
		int end   = start + 9;
		
		para.put("start", start);
		para.put("end"  , end);

		
		return idao.selectinfo10(para); 
	}
	@Override public int selectinfoTotalCnt() { return idao.selectinfoTotalCnt(); }

	/* SEARCH + PAGING */
	@Override public List<ExecSearchDto> selectinfo3(String keyword, int pageNo) { 
		HashMap<String, Object> para = new HashMap<>();
		//  11-1 (10/10 = 1) 20-1(19/10 = 1)
		int pageSize=3; //3개씩의 페이지
		// 1: start→1, end→3   2: start→4, end→6   3: start→7, end→9 
		para.put("search", keyword);
		int start = (pageNo-1)*pageSize+1;
		para.put("start", start);   // 1→1    2→4 (2-1)*3+1   3→7 (3-1)*3+1
		para.put("end"  , start + pageSize-1);   //4→6 (4+3-1)   , 7→9  (7+3-1)
		return idao.selectinfo3(para); 
	}
	@Override public int selectinfoSearchTotalCnt(String keyword) { return idao.selectinfoSearchTotalCnt(keyword); }

}
