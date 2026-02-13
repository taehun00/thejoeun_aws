package com.pawject;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.Ad;
import com.pawject.domain.User;
import com.pawject.repository.AdRepository;
import com.pawject.repository.UserRepository;

@SpringBootTest
@Transactional
public class Pawject4ApplicationTests_Exec_AdRepository {

    @Autowired AdRepository adRepository;
    @Autowired UserRepository userRepository;

    private Long adId;

    @BeforeEach
    void setup() {
        // User 먼저 생성
        User user = new User("test@test.com", "닉네임", "1234");
        userRepository.save(user);

        // Ad 생성
        Ad ad = new Ad();
        ad.setTitle("광고 제목");
        ad.setContent("광고 내용");
        ad.setImg("test.png");
        ad.setActive(true);
        ad.setUser(user);

        Ad saved = adRepository.save(ad);
        this.adId = saved.getId();

        assertThat(saved.getTitle()).isEqualTo("광고 제목");
        assertThat(saved.getUser().getEmail()).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("■ AdRepository - CRUD")
    void adRepositoryCrud() {
        // Update
        Ad ad = adRepository.findById(adId).orElseThrow();
        ad.setActive(false);
        Ad updated = adRepository.save(ad);

        assertThat(updated.isActive()).isFalse();

        // Read
        Optional<Ad> found = adRepository.findById(adId);
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("광고 제목");

        // Delete
        adRepository.deleteById(adId);
        assertThrows(RuntimeException.class, () -> {
            adRepository.findById(adId).orElseThrow(() -> new RuntimeException("Ad not found"));
        });
    }
    
    @Test
    @DisplayName("■ 활성화된 광고만 조회")
    void findAllByActiveTrueTest() {
        User user = userRepository.findByEmail("test@test.com").orElseThrow();

        Ad ad1 = new Ad();
        ad1.setTitle("활성 광고1");
        ad1.setContent("내용1");
        ad1.setActive(true);
        ad1.setUser(user);
        adRepository.save(ad1);

        Ad ad2 = new Ad();
        ad2.setTitle("비활성 광고");
        ad2.setContent("내용2");
        ad2.setActive(false);
        ad2.setUser(user);
        adRepository.save(ad2);

        var ads = adRepository.findAllByActiveTrue();
        assertThat(ads).isNotEmpty();
        assertThat(ads).allMatch(Ad::isActive); // 모두 active=true
    }

    @Test
    @DisplayName("■ 제목 키워드 검색 (활성 광고만)")
    void findByTitleContainingAndActiveTrueTest() {
        User user = userRepository.findByEmail("test@test.com").orElseThrow();

        Ad ad1 = new Ad();
        ad1.setTitle("광고 키워드 포함");
        ad1.setContent("내용1");
        ad1.setActive(true);
        ad1.setUser(user);
        adRepository.save(ad1);

        Ad ad2 = new Ad();
        ad2.setTitle("광고 키워드 포함 (비활성)");
        ad2.setContent("내용2");
        ad2.setActive(false);
        ad2.setUser(user);
        adRepository.save(ad2);

        var ads = adRepository.findByTitleContainingAndActiveTrue("광고");
        assertThat(ads).isNotEmpty();
        assertThat(ads).allMatch(Ad::isActive); // active=true만 조회됨
    }
    
    @Test
    @DisplayName("■ 네이티브 쿼리 페이징 조회")
    void findAdsWithPagingTest() {
        User user = userRepository.findByEmail("test@test.com").orElseThrow();

        for (int i = 1; i <= 15; i++) {
            Ad ad = new Ad();
            ad.setTitle("광고 " + i);
            ad.setContent("내용 " + i);
            ad.setActive(true);
            ad.setUser(user);
            adRepository.save(ad);
        }

        var ads = adRepository.findAdsWithPaging(1, 5); // 1~5번 광고만 조회
        assertThat(ads).hasSize(5);
        assertThat(ads.get(0).getTitle()).contains("광고"); // 최신순 정렬 확인
    }

    
    
    
    
    
    
    
//    @Test
//    @DisplayName("■ 활성화된 광고만 조회")
//    void findAllByActiveTrueTest() {
//        // given: setup에서 active=true 광고 저장됨
//        var ads = adRepository.findAllByActiveTrue();
//        assertThat(ads).isNotEmpty();
//        assertThat(ads.get(0).isActive()).isTrue();
//    }
//    
//    @Test
//    @DisplayName("■ 활성화된 광고 페이징 조회")
//    void findAllByActiveTruePagingTest() {
//        User user = userRepository.findByEmail("test@test.com").orElseThrow();
//
//        Ad ad1 = new Ad();
//        ad1.setTitle("첫 번째 광고");
//        ad1.setContent("내용1");
//        ad1.setActive(true);
//        ad1.setUser(user);
//        adRepository.save(ad1);
//
//        Ad ad2 = new Ad();
//        ad2.setTitle("두 번째 광고");
//        ad2.setContent("내용2");
//        ad2.setActive(true);
//        ad2.setUser(user);
//        adRepository.save(ad2);
//
//        var pageable = org.springframework.data.domain.PageRequest.of(
//            0, 5, org.springframework.data.domain.Sort.by("createdAt").descending()
//        );
//        var page = adRepository.findAllByActiveTrue(pageable);
//
//        assertThat(page.getContent()).isNotEmpty();
//        assertThat(page.getContent().get(0).getTitle()).isEqualTo("두 번째 광고");
//        assertThat(page.getTotalElements()).isGreaterThanOrEqualTo(2);
//    }
//
//    
//    @Test
//    @DisplayName("■ 특정 사용자가 올린 광고 조회")
//    void findAllByUserUserIdTest() {
//        var ads = adRepository.findAllByUserUserId(
//            userRepository.findByEmail("test@test.com").get().getUserId()
//        );
//        assertThat(ads).isNotEmpty();
//        assertThat(ads.get(0).getUser().getEmail()).isEqualTo("test@test.com");
//    }
//    
//    @Test
//    @DisplayName("■ 제목 키워드 검색")
//    void findByTitleContainingAndActiveTrueTest() {
//        var ads = adRepository.findByTitleContainingAndActiveTrue("광고");
//        assertThat(ads).isNotEmpty();
//        assertThat(ads.get(0).getTitle()).contains("광고");
//    }
//    
//    @Test
//    @DisplayName("■ 네이티브 쿼리 페이징 조회")
//    void findAdsWithPagingTest() {
//        var ads = adRepository.findAdsWithPaging(1, 10);
//        assertThat(ads).isNotEmpty();
//        assertThat(ads.get(0).getTitle()).isEqualTo("광고 제목");
//    }
    
    
    
}
