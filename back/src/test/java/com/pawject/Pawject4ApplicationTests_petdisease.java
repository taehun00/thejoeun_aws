//package com.pawject;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.pawject.dto.petdisease.PetdiseaseRequestDto;
//import com.pawject.dto.petdisease.PetdiseaseResponseDto;
//import com.pawject.service.petdisease.PetdiseaseService;
//
//@SpringBootTest
//@Transactional
//class Pawject4ApplicationTests_petdisease {
//	@Autowired PetdiseaseService service;
//
//
//    private Long disno;
//
//    @BeforeEach
//    void setup() {
//    		//글쓰기테스트
//        PetdiseaseRequestDto petreq = new PetdiseaseRequestDto();
//        petreq.setPettypeid(1L);
//        petreq.setDisname("질환명");
//        petreq.setDisexplain("설명");
//        petreq.setRecommend("필터추천");
//
//        PetdiseaseResponseDto petres = service.createPost(1L, petreq, petreq.getPettypeid());
//        this.disno = petres.getDisno();
//
//        assertThat(petres.getDisname()).isEqualTo("질환명");
//    }
//
//    @Test
//    @DisplayName("■ PostService-CRUD ")
//    void testPetdiseaseService() {
//    		//수정
//        PetdiseaseRequestDto updateReq = new PetdiseaseRequestDto();
//        updateReq.setPettypeid(2L);
//        updateReq.setDisname("질환명수정");
//        updateReq.setDisexplain("설명");
//        updateReq.setRecommend("필터추천");
//
//        PetdiseaseResponseDto updated = service.updatePetdis(disno, updateReq, updateReq.getPettypeid());
//        assertThat(updated.getDisname()).isEqualTo("질환명수정");
//
//        	//단건조회
//        PetdiseaseResponseDto found = service.getPetdis(disno);
//        assertThat(found.getDisexplain()).isEqualTo("설명");
//        
//        //삭제
//         service.deletePetdis(disno);
//		 assertThrows(     IllegalArgumentException.class , () ->  service.getPetdis(disno)  );
//    }
//}