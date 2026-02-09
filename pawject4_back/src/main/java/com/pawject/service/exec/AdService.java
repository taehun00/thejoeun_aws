package com.pawject.service.exec;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.domain.Ad;
import com.pawject.domain.User;
import com.pawject.dto.exec.AdRequestDto;
import com.pawject.dto.exec.AdResponseDto;
import com.pawject.repository.AdRepository;
import com.pawject.repository.UserRepository;
import com.pawject.util.UtilUpload;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdService {

    private final AdRepository adRepository;
    private final UserRepository userRepository;
    private final UtilUpload fileStorageService;

    // 광고 작성
    public AdResponseDto createAd(Long userId, AdRequestDto dto, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 사용자 입력 사항
        Ad ad = new Ad();
        ad.setTitle(dto.getTitle());
        ad.setContent(dto.getContent());
        
        ad.setActive(true); // 항상 true
        ad.setUser(user);

        if (file != null && !file.isEmpty()) {
            String storedPath = fileStorageService.fileUpload(file ,"exec");
            ad.setImg(storedPath);
        }

        Ad saved = adRepository.save(ad);
        return new AdResponseDto(saved);
    }

    // 광고 조회
    public AdResponseDto getAd(Long adId) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Ad not found"));
        return new AdResponseDto(ad);
    }
    
    
    // 광고 수정
    public AdResponseDto updateAd(Long userId, Long adId, AdRequestDto dto, MultipartFile file) throws IOException {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Ad not found"));

        if (!ad.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        if (dto.getTitle() != null) ad.setTitle(dto.getTitle());
        if (dto.getContent() != null) ad.setContent(dto.getContent());
        ad.setActive(true); // 항상 true

        if (file != null && !file.isEmpty()) {
            String storedPath = fileStorageService.fileUpload(file, "exec" );
            ad.setImg(storedPath);
        }

        Ad updated = adRepository.save(ad);
        return new AdResponseDto(updated);
    }

    // 광고 삭제
    public void deleteAd(Long userId, Long adId) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Ad not found"));

        if (!ad.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        adRepository.delete(ad);
    }
}
