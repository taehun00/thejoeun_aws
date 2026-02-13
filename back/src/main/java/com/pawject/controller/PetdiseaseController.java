package com.pawject.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.domain.Petdisease;
import com.pawject.dto.petdisease.PetdiseaseRequestDto;
import com.pawject.dto.petdisease.PetdiseaseResponseDto;
import com.pawject.service.petdisease.PetdiseaseService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Petdisease", description = "질병정보 API")
@RestController
@RequestMapping("/api/petdisease")
@RequiredArgsConstructor
public class PetdiseaseController {
	private final PetdiseaseService service;
	private final AuthUserJwtService authUserJwtService;  
	
	@Operation(summary = "게시글 단건 조회 (공개)")
	@GetMapping("/{disno}")
	public ResponseEntity<PetdiseaseResponseDto> getPetdis(
			@PathVariable("disno") Long disno){
		return ResponseEntity.ok(service.getPetdis(disno));
	}

	@Operation(summary = "페이징+정렬(공개)")
	@GetMapping("/list")
	public ResponseEntity<Page<PetdiseaseResponseDto>> list(
	        @RequestParam(name="pettypeid") Long pettypeid,
	        @RequestParam(name="page", defaultValue = "1") int page,
	        @RequestParam(name="size", defaultValue = "10") int size,
	        @RequestParam(name="condition", required = false) String condition
	) {
	    Page<Petdisease> result = service.getPetdiseasePage(page, size, condition, pettypeid);
	    return ResponseEntity.ok(result.map(PetdiseaseResponseDto::from));
	}
	
	@Operation(summary = "페이징+정렬+검색(공개)")
    @GetMapping("/search")
    public Page<PetdiseaseResponseDto> search(
            @RequestParam("pettypeid") Long pettypeid,
            @RequestParam(name="keyword", required = false) String keyword,
            @RequestParam(name="page", defaultValue = "1") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="condition", required = false) String condition
    ) {
        Pageable pageable = PageRequest.of(page - 1, size); 
        return service.list(pettypeid, keyword, pageable, condition);
    }
	
	@Operation(summary = "게시글 작성 (JWT 인증 필요)")
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<PetdiseaseResponseDto> createPetdis(
	        Authentication authentication,
	        @RequestParam("pettypeid") Long pettypeid,
	        @ModelAttribute PetdiseaseRequestDto dto){
	    Long userid = authUserJwtService.getCurrentUserId(authentication);
	    return ResponseEntity.ok(service.createPost(userid, dto, pettypeid));
	}
	
	@Operation(summary = "게시글 수정 (JWT 인증 필요)")
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping(value = "/{disno}")
	public ResponseEntity<PetdiseaseResponseDto> updatePetdis(
	        Authentication authentication,
	        @PathVariable("disno") Long disno,
	        @RequestParam("pettypeid") Long pettypeid,
	        @ModelAttribute PetdiseaseRequestDto dto){
		return ResponseEntity.ok(service.updatePetdis(disno, dto, pettypeid));
	}
	
    @Operation(summary = "게시글 삭제 (JWT 인증 필요)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{disno}")
    public ResponseEntity<Void> deletePetdis(
            Authentication authentication,
            @PathVariable("disno") Long disno){
    	service.deletePetdis(disno);
    	return ResponseEntity.noContent().build(); 
    }


}
