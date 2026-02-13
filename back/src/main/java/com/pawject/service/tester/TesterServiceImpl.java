package com.pawject.service.tester;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.pawject.dao.tester.TesterDao;
import com.pawject.dao.tester.TesterImgDao;
import com.pawject.dto.tester.TesterAdminRequestDto;
import com.pawject.dto.tester.TesterAdminResponseDto;
import com.pawject.dto.tester.TesterImgDto;
import com.pawject.dto.tester.TesterUserRequestDto;
import com.pawject.service.user.AuthUserJwtService;
import com.pawject.util.UtilUpload;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TesterServiceImpl implements TesterService {

	private final TesterDao dao;
	private final TesterImgDao idao;
	private final UtilUpload utilUpload;
	private final AuthUserJwtService authUserJwtService;

	// 파일 삭제
	private void filedelete(String savedPath) {
		try {
			if (savedPath == null || savedPath.isBlank()) return;

			File imgFile;
			if (savedPath.matches("^[a-zA-Z]:\\\\.*") || savedPath.matches("^[a-zA-Z]:/.*")) {
				imgFile = new File(savedPath);
			} else {
				String normalized = savedPath.replace("\\", "/");
				if (normalized.startsWith("/")) normalized = normalized.substring(1);

				imgFile = new File("C:/upload/", normalized);
			}

			if (imgFile.exists()) imgFile.delete();
		} catch (Exception e) {
		}
	}
	
	//아이디->이미지 삭제
	private void deleteTesterImages(Long testerid) {
	    List<TesterImgDto> imgs = idao.selectImgsByTesterid(testerid);
	    if (imgs != null) {
	        for (TesterImgDto img : imgs) {
	            if (img == null) continue;
	            TesterImgDto full = idao.testerImgSelectByImgid(img.getTesterimgid());
	            if (full != null) filedelete(full.getImgsrc());
	        }
	    }
	    idao.deleteImgsByTesterid(testerid);
	}

	// 이미지 insert
	private void saveTesterImagesMybatis(Long testerid, List<MultipartFile> files) {
		if (testerid == null) return;
		if (files == null || files.isEmpty()) return;

		for (MultipartFile file : files) {
			if (file == null || file.isEmpty()) continue;

			String savedPath;
			try {
				savedPath = utilUpload.fileUpload(file, "testerimg");
			} catch (Exception e) {
				throw new RuntimeException("이미지 업로드 실패", e);
			}

			Map<String, Object> param = new HashMap<>();
			param.put("testerid", testerid);
			param.put("imgsrc", savedPath);

			idao.insertTesterImg(param);
		}
	}

	//  목록/검색 이미지맵 
	private Map<Long, List<TesterImgDto>> buildImgMapByMybatis(List<Long> testerids) {
		if (testerids == null || testerids.isEmpty()) return Map.of();

		Map<Long, List<TesterImgDto>> map = new HashMap<>();
		for (Long testerid : testerids) {
			if (testerid == null) continue;
			List<TesterImgDto> imgs = idao.selectImgsByTesterid(testerid);
			map.put(testerid, imgs == null ? List.of() : imgs);
		}
		return map;
	}


	
	/////////////////////////////////////////
	
	
	// 단건조회 
	@Transactional(readOnly = true)
	@Override
	public TesterAdminResponseDto selectTesterById(Long testerid) {
		TesterAdminResponseDto dto = dao.selectTesterById(testerid);
		if (dto == null) throw new IllegalArgumentException("글 없음");

		dao.updateViews(testerid);

		List<TesterImgDto> imgs = idao.selectImgsByTesterid(testerid);
		dto.setImgList(imgs == null ? List.of() : imgs);

		return dto;
	}

	//  목록
	@Transactional(readOnly = true)
	@Override
	public List<TesterAdminResponseDto> select20Tester(String condition, int pageNo) {

		HashMap<String, Object> para = new HashMap<>();
		int start = (pageNo - 1) * 20 + 1;
		int end = start + 19;

		para.put("start", start);
		para.put("end", end);

		if (condition != null) {
			switch (condition) {
				case "old": para.put("condition", "old"); break;
				case "new": para.put("condition", "new"); break;
				case "close": para.put("condition", "close"); break;
				case "open": para.put("condition", "open"); break;
				case "openOnly": para.put("condition", "openOnly"); break;
				case "closeOnly": para.put("condition", "closeOnly"); break;
				default: para.put("condition", "new"); break;
			}
		}

		List<TesterAdminResponseDto> list = dao.select20Tester(para);

		List<Long> ids = list.stream()
				.map(TesterAdminResponseDto::getTesterid)
				.filter(x -> x != null)
				.toList();

		Map<Long, List<TesterImgDto>> imgMap = buildImgMapByMybatis(ids);

		for (TesterAdminResponseDto dto : list) {
			if (dto == null || dto.getTesterid() == null) continue;
			dto.setImgList(imgMap.getOrDefault(dto.getTesterid(), List.of()));
		}

		return list;
	}

	// CNT
	@Override
	public int countByTesterPaging(String condition) {
		HashMap<String, Object> para = new HashMap<>();
		if (condition != null) {
			switch (condition) {
				case "openOnly": para.put("condition", "openOnly"); break;
				case "closeOnly": para.put("condition", "closeOnly"); break;
				default: para.put("condition", "new"); break;
			}
		}
		return dao.countByTesterPaging(para);
	}

	// 검색
	@Transactional(readOnly = true)
	@Override
	public List<TesterAdminResponseDto> searchTester(String keyword, String searchType, String condition, int pageNo) {

		if (keyword == null) keyword = "";
		keyword = keyword.toLowerCase();
		if (searchType == null) searchType = "all";

		HashMap<String, Object> para = new HashMap<>();
		int start = (pageNo - 1) * 20 + 1;
		int end = start + 19;

		para.put("start", start);
		para.put("end", end);

		String searchLike = "%" + keyword + "%";

		switch (searchType) {
			case "title": para.put("searchType", "title"); para.put("search", searchLike); break;
			case "content": para.put("searchType", "content"); para.put("search", searchLike); break;
			case "nickname": para.put("searchType", "nickname"); para.put("search", searchLike); break;
			default: para.put("searchType", "all"); para.put("search", searchLike); break;
		}

		if (condition != null) {
			switch (condition) {
				case "old":
				case "new":
				case "openOnly":
				case "closeOnly":
					para.put("condition", condition);
					break;
				default:
					para.put("condition", "new");
					break;
			}
		}

		List<TesterAdminResponseDto> list = dao.searchTester(para);

		List<Long> ids = list.stream()
				.map(TesterAdminResponseDto::getTesterid)
				.filter(x -> x != null)
				.toList();

		Map<Long, List<TesterImgDto>> imgMap = buildImgMapByMybatis(ids);

		for (TesterAdminResponseDto dto : list) {
			if (dto == null || dto.getTesterid() == null) continue;
			dto.setImgList(imgMap.getOrDefault(dto.getTesterid(), List.of()));
		}

		return list;
	}

	// CNT
	@Override
	public int searchTesterCnt(String keyword, String searchType, String condition) {

		if (keyword == null) keyword = "";
		keyword = keyword.toLowerCase();
		if (searchType == null) searchType = "all";

		HashMap<String, Object> para = new HashMap<>();
		String searchLike = "%" + keyword + "%";

		switch (searchType) {
			case "title": para.put("searchType", "title"); para.put("search", searchLike); break;
			case "content": para.put("searchType", "content"); para.put("search", searchLike); break;
			case "nickname": para.put("searchType", "nickname"); para.put("search", searchLike); break;
			default: para.put("searchType", "all"); para.put("search", searchLike); break;
		}

		if (condition != null) {
			switch (condition) {
				case "openOnly": para.put("condition", "openOnly"); break;
				case "closeOnly": para.put("condition", "closeOnly"); break;
				default: para.put("condition", "new"); break;
			}
		}

		return dao.searchTesterCnt(para);
	}

	@Override
	public Long updateIsnotice(Long testerid) {
		dao.updateIsnotice(testerid);
		return dao.selectIsnotice(testerid);
	}

	@Override
	public Long updateStatus(Long testerid) {
		dao.updateStatus(testerid);
		return dao.selectStatus(testerid);
	}

	@Override
	public int updateViews(Long testerid) {
		return dao.updateViews(testerid);
	}

	@Override
	public Long selectIsnotice(Long testerid) {
		return dao.selectIsnotice(testerid);
	}

	@Override
	public Long selectStatus(Long testerid) {
		return dao.selectStatus(testerid);
	}

	// 글쓰기(유저)
	@Override
	public int testerUserInsert(TesterUserRequestDto dto, List<MultipartFile> files) {
		int result = dao.testerUserInsert(dto);

		Long testerid = dto.getTesterid();
		if (testerid != null) {
			saveTesterImagesMybatis(testerid, files);
		}

		return result;
	}

	// 글쓰기(관리자)
	@Override
	public int testerAdminInsert(TesterAdminRequestDto dto, List<MultipartFile> files) {
		int result = dao.testerAdminInsert(dto);

		Long testerid = dto.getTesterid();
		if (testerid != null) {
			saveTesterImagesMybatis(testerid, files);
		}

		return result;
	}

	//유저수정
	@Override
	public int testerUserUpdate(TesterUserRequestDto dto, List<MultipartFile> files, List<Long> keepImgIds) {

	    Long testerid = dto.getTesterid();
	    Long userid = dto.getUserid();

	    if (testerid == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testerid 누락");
	    if (userid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보 없음");

	    
	    System.out.println("### dto.testerid=" + dto.getTesterid()
	    + ", dto.userid=" + dto.getUserid()
	    + ", title=" + dto.getTitle()
	    + ", content=" + dto.getContent());
	    
	    
	    int updated = dao.testerUserUpdate(dto);
	    if (updated == 0) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 글만 수정할 수 있습니다.");
	    }

	    if (keepImgIds == null) keepImgIds = List.of();

	    List<TesterImgDto> oldImgs = idao.selectImgsByTesterid(testerid);
	    if (oldImgs != null) {
	        for (TesterImgDto img : oldImgs) {
	            if (img == null) continue;
	            Long imgId = img.getTesterimgid();
	            if (imgId == null) continue;

	            if (!keepImgIds.contains(imgId)) {
	                TesterImgDto full = idao.testerImgSelectByImgid(imgId);
	                if (full != null) filedelete(full.getImgsrc());
	                idao.deleteTesterImgById(imgId);
	            }
	        }
	    }
	   
	    

	    saveTesterImagesMybatis(testerid, files);

	    return updated;
	}

	// 수정(관리자)
	@Override
	public int testerAdminUpdate(TesterAdminResponseDto dto, List<MultipartFile> files, List<Long> keepImgIds) {

	    int result = dao.testerAdminUpdate(dto);

	    Long testerid = dto.getTesterid();
	    if (testerid == null) return result;

	    if (keepImgIds == null) keepImgIds = List.of();

	    List<TesterImgDto> oldImgs = idao.selectImgsByTesterid(testerid);
	    if (oldImgs != null) {
	        for (TesterImgDto img : oldImgs) {
	            if (img == null) continue;
	            Long imgId = img.getTesterimgid();
	            if (imgId == null) continue;

	            if (!keepImgIds.contains(imgId)) {
	                TesterImgDto full = idao.testerImgSelectByImgid(imgId);
	                if (full != null) filedelete(full.getImgsrc());
	                idao.deleteTesterImgById(imgId);
	            }
	        }
	    }

	    saveTesterImagesMybatis(testerid, files);

	    return result;
	}
	
	// 삭제
	@Override
	public int testerDeleteById(Long testerid, Authentication authentication) {

	    TesterAdminResponseDto origin = dao.selectTesterById(testerid);
	    if (origin == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "글 없음");

	    boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
	        .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));


	    Long loginUserid = null;
	    if (!isAdmin) {
	        loginUserid = authUserJwtService.getCurrentUserId(authentication);
	        if (loginUserid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보 없음");

	        if (origin.getUserid() == null || !origin.getUserid().equals(loginUserid)) {
	            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 글만 삭제할 수 있습니다.");
	        }
	    }

	    // 이미지 삭제
	    deleteTesterImages(testerid);

	    int deleted = dao.testerDeleteById(testerid);
	    if (deleted == 0) {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제 대상 없음");
	    }

	    return deleted;
	}
	
	
	// img
	@Override
	public TesterImgDto testerImgSelectByImgid(Long testerimgid) {
		return idao.testerImgSelectByImgid(testerimgid);
	}

	@Override
	public int insertTesterImg(Map<String, Object> param) {
		return idao.insertTesterImg(param);
	}

	@Override
	public List<TesterImgDto> selectImgsByTesterid(Long testerid) {
		return idao.selectImgsByTesterid(testerid);
	}

	@Override
	public int deleteTesterImgById(Long testerimgid) {
		return idao.deleteTesterImgById(testerimgid);
	}

	@Override
	public int deleteImgsByTesterid(Long testerid) {
		return idao.deleteImgsByTesterid(testerid);
	}
}