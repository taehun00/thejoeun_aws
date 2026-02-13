package com.pawject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.food.FoodDto;
import com.pawject.dto.tester.TesterAdminRequestDto;
import com.pawject.dto.tester.TesterAdminResponseDto;
import com.pawject.dto.tester.TesterUserRequestDto;
import com.pawject.service.food.FoodService;
import com.pawject.service.tester.TesterService;
import com.pawject.service.user.AuthUserJwtService;
import com.pawject.util.UtilPaging;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Tester", description = "체험단 API")
@RestController
@RequestMapping("/api/tester")
@RequiredArgsConstructor
public class TesterController {

	private final AuthUserJwtService authUserJwtService;
	private final TesterService service;
	private final FoodService fservice;

	@Operation(summary = "게시글 단건 조회 (공개)")
	@GetMapping("/{testerid}")
	public ResponseEntity<TesterAdminResponseDto> getTester(
			@PathVariable("testerid") Long testerid) {
		return ResponseEntity.ok(service.selectTesterById(testerid));
	}

	//카테고리-관리자용
	@GetMapping("/categories/admin")
	public ResponseEntity<List<String>> adminCategories() {
		return ResponseEntity.ok(List.of("공지", "모집중", "모집완료"));
	}

	//카테고리-사용자용
	@GetMapping("/categories/user")
	public ResponseEntity<List<String>> userCategories() {
		return ResponseEntity.ok(List.of("후기"));
	}

	//사료이름리스트
	@GetMapping("/food/selectfoodlist")
	public ResponseEntity<List<FoodDto>> foodSelectList() {
	    return ResponseEntity.ok(fservice.foodselectName());
	}
	
	
	@Operation(summary = "게시글 작성-관리자 (JWT 인증 필요)")
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
	@PostMapping(value = "/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Integer> createTesterAdmin(
	        Authentication authentication,
	        @ModelAttribute TesterAdminRequestDto dto,
	        @RequestPart(name = "files", required = false) List<MultipartFile> files) {

	    Long userid = authUserJwtService.getCurrentUserId(authentication);
	    dto.setUserid(userid);

	    return ResponseEntity.ok(service.testerAdminInsert(dto, files));
	}
	@Operation(summary = "게시글 작성-유저 (JWT 인증 필요)")
	@PreAuthorize("isAuthenticated()")
	@PostMapping(value = "/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Integer> createTesterUser(
			Authentication authentication,
			@ModelAttribute TesterUserRequestDto dto,
			@Parameter(description = "업로드할 이미지 파일")
			@RequestPart(name = "files", required = false) List<MultipartFile> files) {

		Long userid = authUserJwtService.getCurrentUserId(authentication);
		dto.setUserid(userid);

		return ResponseEntity.ok(service.testerUserInsert(dto, files));
	}

	// 수정(관리자)
	@Operation(summary = "게시글 수정-관리자 (JWT 인증 필요)")
	@PutMapping(value = "/admin/{testerid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
	public ResponseEntity<Integer> updateAdmin(
			Authentication authentication,
			@PathVariable("testerid") Long testerid,
			@ModelAttribute TesterAdminResponseDto dto,
			@RequestPart(name ="files", required = false) List<MultipartFile> files,
			@RequestParam(name="keepImgIds", required = false) List<Long> keepImgIds
	) {
		dto.setTesterid(testerid);
		return ResponseEntity.ok(service.testerAdminUpdate(dto, files, keepImgIds));
	}

	//유저수정
	@PutMapping(value = "/user/{testerid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Integer> updateUser(
	        Authentication authentication,
	        @PathVariable("testerid") Long testerid,
	        @ModelAttribute TesterUserRequestDto dto,
	        @RequestPart(name ="files", required = false) List<MultipartFile> files,
	        @RequestParam(name="keepImgIds", required = false) List<Long> keepImgIds
	) {
		System.out.println("### update dto.testerid=" + dto.getTesterid() + ", dto.userid=" + dto.getUserid());
		
	    Long userid = authUserJwtService.getCurrentUserId(authentication); 
	    dto.setUserid(userid);
	    dto.setTesterid(testerid);

	    return ResponseEntity.ok(service.testerUserUpdate(dto, files, keepImgIds));
	}
	
//삭제(공용)
	@DeleteMapping("/{testerid}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Integer> deletePost(
	        Authentication authentication,
	        @PathVariable("testerid") Long testerid) {

	    Long userid = authUserJwtService.getCurrentUserId(authentication);
	    return ResponseEntity.ok(service.testerDeleteById(testerid, authentication));
	}

	@Operation(summary = "체험단 페이징")
	@GetMapping("/paged")
	@ResponseBody
	public Map<String, Object> testerPaged(
			@RequestParam(name ="pageNo", defaultValue = "1") int pageNo,
			@RequestParam(name ="condition", required = false) String condition) {

		Map<String, Object> result = new HashMap<>();

		int total = service.countByTesterPaging(condition);
		List<TesterAdminResponseDto> list = service.select20Tester(condition, pageNo);

		UtilPaging paging = new UtilPaging(total, pageNo);
		result.put("paging", paging);
		result.put("total", total);
		result.put("list", list);

		return result;
	}

	@Operation(summary = "체험단 검색")
	@GetMapping("/search")
	@ResponseBody
	public Map<String, Object> testerSearch(
			@RequestParam("searchType") String searchType,
			@RequestParam(name = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name="condition", required = false) String condition) {

		Map<String, Object> result = new HashMap<>();
		int total = service.searchTesterCnt(keyword, searchType, condition);
		List<TesterAdminResponseDto> list = service.searchTester(keyword, searchType, condition, pageNo);

		UtilPaging paging = new UtilPaging(total, pageNo);

		result.put("total", total);
		result.put("list", list);
		result.put("paging", paging);
		result.put("search", keyword);

		return result;
	}

	@Operation(summary = "공지전환-관리자전용")
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
	@PatchMapping("/{testerid}/notice")
	public ResponseEntity<Long> updateNotice(@PathVariable("testerid") Long testerid) {
	    return ResponseEntity.ok(service.updateIsnotice(testerid));
	}

	@Operation(summary = "모집전환-관리자전용")
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
	@PatchMapping("/{testerid}/status")
	public ResponseEntity<Long> updateStatus(@PathVariable("testerid") Long testerid) {
	    return ResponseEntity.ok(service.updateStatus(testerid));
	}
}