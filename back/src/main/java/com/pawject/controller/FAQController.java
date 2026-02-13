package com.pawject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.support.FAQDto;
import com.pawject.service.support.FAQService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "FAQ", description = "고객센터 FAQ") 
@RestController 
@RequestMapping("/api/faqBoard") 
@RequiredArgsConstructor 
public class FAQController {
	@Autowired private FAQService service;

	//리스트 - 유저용
	@Operation(summary = " 유저 FAQ 리스트")
	@GetMapping("/faquser")
	public ResponseEntity<List<FAQDto>> forUserList() {
	    return ResponseEntity.ok(service.selectFAQActive());
	}
	//리스트 - 관리자용
	@Operation(summary = "관리자 FAQ 리스트")
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/faqadmin")
	public ResponseEntity<List<FAQDto>> forAdminList() {
	    return ResponseEntity.ok(service.selectFAQAll());
	}
	
	// 글쓰기
	@Operation(summary = "FAQ 카테고리 지정")
	@GetMapping("/categories")   //model 말고 주소창에서 받아오기
	public ResponseEntity<List<String>> categories() {
	    return ResponseEntity.ok(
	        List.of("계정", "서비스", "이벤트", "기타")
	    );
	}
	
	@Operation(summary = "FAQ 글쓰기")
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<Void> write(@RequestBody FAQDto dto) {
	    service.insertFAQ(dto);
	    return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// 수정
	@Operation(summary = "FAQ 수정")
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/{faqid}")
	public ResponseEntity<Void> updatePost(
	        @PathVariable("faqid") Long faqid,
	        @RequestBody FAQDto dto
	) {
	    dto.setFaqid(faqid);  // id 기준은 URL
	    service.updateFAQ(dto);
	    return ResponseEntity.ok().build();
	}
	@Operation(summary = "빠른 활성화")
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{faqid}/active")
	public ResponseEntity<Void> quickActive(
	        @PathVariable("faqid") Long faqid,
	        @RequestBody FAQDto dto
	) {
	    dto.setFaqid(faqid);
	    service.activeFAQ(dto);
	    return ResponseEntity.ok().build();
	}

}