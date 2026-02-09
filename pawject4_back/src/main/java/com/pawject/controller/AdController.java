package com.pawject.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.pawject.dto.exec.AdRequestDto;
import com.pawject.dto.exec.AdResponseDto;
import com.pawject.service.exec.AdService;
import com.pawject.service.user.AuthUserJwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Ad", description = "광고 API")
@RestController
@RequestMapping("/ads")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "광고 단건 조회")
    @GetMapping("/{adId}")
    public ResponseEntity<AdResponseDto> getAd(@PathVariable(name = "adId") Long adId) {
        return ResponseEntity.ok(adService.getAd(adId)); 
    }
    
    //@Operation(summary = "광고 전체 목록") ...???  
    
    
    
    @Operation(summary = "광고 작성")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdResponseDto> createAd(
            Authentication authentication,
            @ModelAttribute AdRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(adService.createAd(userId, dto, file));
    }
    
//    @Operation(summary = "광고 작성")
//    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<AdResponseDto> createAd(
//            Authentication authentication,
//            @ModelAttribute AdRequestDto dto, // ✅ multipart form-data 필드로 매핑
//            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
//        Long userId = authUserJwtService.getCurrentUserId(authentication);
//        // ✅ Service 호출 시 IOException 처리
//        return ResponseEntity.ok(adService.createAd(userId, dto, file));
//    }
    
    @Operation(summary = "광고 수정")
    @PutMapping(value = "/{adId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdResponseDto> updateAd(
            Authentication authentication,
            @PathVariable(name = "adId") Long adId,
            @ModelAttribute AdRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(adService.updateAd(userId, adId, dto, file));
    }

    @Operation(summary = "광고 삭제")
    @DeleteMapping("/{adId}")
    public ResponseEntity<Void> deleteAd(
            Authentication authentication,
            @PathVariable(name = "adId") Long adId) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        adService.deleteAd(userId, adId);
        return ResponseEntity.noContent().build();
    }
    
}