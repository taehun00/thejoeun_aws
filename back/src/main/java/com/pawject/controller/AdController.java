package com.pawject.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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
@RequestMapping("/api/ads")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "광고 단건 조회")
    @GetMapping("/{adId}")
    public ResponseEntity<AdResponseDto> getAd(@PathVariable(name = "adId") Long adId) {
        return ResponseEntity.ok(adService.getAd(adId)); 
    }
    
//    //@Operation(summary = "광고 전체 목록") ...???  
//    
//    @Operation(summary = "최신 광고 페이징 조회")
//    @GetMapping("/latest")
//    public ResponseEntity<List<AdResponseDto>> getLatestAds(
//            @RequestParam(defaultValue = "1") int start,
//            @RequestParam(defaultValue = "10") int end) {
//        // JWT + Redis 인증을 통해 현재 사용자 ID 확인
//        //Long userId = authUserJwtService.getCurrentUserId(authentication);
//
//        // 현재 사용자 ID를 활용해 권한 체크나 로그 기록 등을 추가할 수 있음
//        List<AdResponseDto> ads = adService.getLatestAdsWithPaging(start, end);
//        return ResponseEntity.ok(ads);
//    }

    @Operation(summary = "최신 광고 페이징 조회", description = "누구나 접근 가능. start/end rownum 지정 필요")
    @GetMapping("/latest")
    public ResponseEntity<List<AdResponseDto>> getLatestAds(
    		@RequestParam(name = "start", defaultValue = "1") int start,
            @RequestParam( name="end" , defaultValue = "10") int end) {
        List<AdResponseDto> ads = adService.getLatestAdsWithPaging(start, end);
        return ResponseEntity.ok(ads);
    }

    
    @Operation(summary = "광고 작성")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdResponseDto> createAd(
            Authentication authentication,
            @ModelAttribute AdRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(adService.createAd(userId, dto, file));
    }
    
 
   
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