package com.pawject;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.User;
import com.pawject.dto.exec.AdRequestDto;
import com.pawject.dto.exec.AdResponseDto;
import com.pawject.repository.AdRepository;
import com.pawject.repository.UserRepository;
import com.pawject.service.exec.AdService;

@SpringBootTest
@Transactional
class Pawject4ApplicationTests_Exec_AdService {

    @Autowired AdService adService;
    @Autowired AdRepository adRepository;
    @Autowired UserRepository userRepository;

    private Long userId;
    private Long adId;

    @BeforeEach
    void setup() throws IOException {
        // 유저 생성
        User user = new User("test@test.com", "닉네임", "1234");
        userRepository.save(user);
        this.userId = user.getUserId();

        // 광고 작성
        AdRequestDto dto = new AdRequestDto();
        dto.setTitle("테스트 광고");
        dto.setContent("테스트 내용");

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.png", "image/png", "dummy".getBytes()
        );

        AdResponseDto res = adService.createAd(userId, dto, file);
        this.adId = res.getId();

        assertThat(res.getTitle()).isEqualTo("테스트 광고");
        assertThat(res.isActive()).isTrue(); // 무조건 true
    }

    @Test
    @DisplayName("■ AdService - 최신 광고 페이징 조회")
    void testGetLatestAdsWithPaging() throws IOException {
        // given: 테스트 데이터 여러 개 삽입
        for (int i = 0; i < 15; i++) {
            AdRequestDto dto = new AdRequestDto();
            dto.setTitle("광고 " + i);
            dto.setContent("내용 " + i);

            MockMultipartFile file = new MockMultipartFile(
                    "file", "img" + i + ".png", "image/png", ("dummy" + i).getBytes()
            );

            adService.createAd(userId, dto, file);
        }

        // when
        List<AdResponseDto> latestAds = adService.getLatestAdsWithPaging(1, 10);

        // then
        assertThat(latestAds).isNotNull();
        assertThat(latestAds.size()).isEqualTo(10);

        // 최신순 정렬 확인
        for (int i = 0; i < latestAds.size() - 1; i++) {
            LocalDateTime first = latestAds.get(i).getCreatedAt();
            LocalDateTime second = latestAds.get(i + 1).getCreatedAt();
            assertThat(!first.isBefore(second)).isTrue(); // first >= second
        }
    }


    
    
    
    
    @Test
    @DisplayName("■ AdService - CRUD")
    void adServiceCrud() {
//        // 조회
//        AdResponseDto found = adService.getAd(adId);
//        assertThat(found.getContent()).isEqualTo("테스트 내용");
//
//        // 수정
//        AdRequestDto updateDto = new AdRequestDto();
//        updateDto.setTitle("수정된 광고");
//        updateDto.setContent("수정된 내용");
//
//        MockMultipartFile newFile = new MockMultipartFile(
//                "file", "new.png", "image/png", "newdummy".getBytes()
//        );
//
//        AdResponseDto updated = adService.updateAd(adId, updateDto, newFile);
//        assertThat(updated.getTitle()).isEqualTo("수정된 광고");
//        assertThat(updated.isActive()).isTrue(); // 여전히 true
//
//        // 삭제
//        adService.deleteAd(adId);
//        assertThrows(RuntimeException.class, () -> adService.getAd(adId));
    }
}
