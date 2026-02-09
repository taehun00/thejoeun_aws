package com.pawject.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawject.domain.Pet;
import com.pawject.domain.PetType;
import com.pawject.domain.User;
import com.pawject.dto.pet.PetRequestDto;
import com.pawject.dto.pet.PetResponseDto;
import com.pawject.repository.PetRepository;
import com.pawject.repository.PetTypeRepository;
import com.pawject.repository.UserRepository;
import com.pawject.service.pet.PetService;
import com.pawject.service.user.UserService;
import com.pawject.util.UtilUpload;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;
    private final UserService userService;
    private final UtilUpload utilUpload;
    private final UserRepository  userRepository;
    private final PetTypeRepository petTypeRepository;
    private final PetRepository  petRepository;
    private static final String DEFAULT_PROFILE_IMAGE = "default.png";

    
    /** 펫 목록 (마이페이지) */
    @Operation(summary = "내 펫 목록 조회")
    @GetMapping("/mypage")
    public ResponseEntity<List<PetResponseDto>> getMyPets(Authentication authentication) {
    	Long userId = Long.parseLong(authentication.getName());
        List<PetResponseDto> pets = petService.getPetsByUserId(userId);
        return ResponseEntity.ok(pets);
    }

    /** 펫 상세 */
    @Operation(summary = "특정 펫 상세 조회")
    @GetMapping("/{petId}")
    public ResponseEntity<PetResponseDto> getPetDetail(
            @Parameter(description = "조회할 펫의 ID", example = "3")
            @PathVariable(name = "petId") Long petId,
            Authentication authentication) {

    	Long userId = Long.parseLong(authentication.getName());
        PetResponseDto pet = petService.getPetDetail(petId, userId);
        return ResponseEntity.ok(pet);
    }


    /** 펫 등록 */
    @Operation(summary = "펫 등록")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetResponseDto> createPet(
    		Principal principal,
            @ModelAttribute PetRequestDto petRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
    	if (principal == null) {
            throw new IllegalStateException("인증 정보 없음");
        }

        Long userId = Long.valueOf(principal.getName()); // ⭐ JWT subject
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자 없음"));
    	
    	
        String filePath = DEFAULT_PROFILE_IMAGE; // 기본 이미지 경로

        // 이미지 업로드 처리
        if (image != null && !image.isEmpty()) {
            try {
                filePath = utilUpload.fileUpload(image, "petimg");
            } catch (IOException e) {
                filePath = DEFAULT_PROFILE_IMAGE; // 실패 시 기본 이미지
            }
        }


        // PetType 조회
        PetType petType = petTypeRepository.findById(petRequestDto.getPetTypeId())
                .orElseThrow(() -> new IllegalArgumentException("잘못된 펫 타입"));

        // DTO → 엔티티 변환
        Pet pet = petRequestDto.toEntity(user, petType);
        // 엔티티에 파일 경로 저장
        pet.setPFile(filePath);

        // 저장
        Pet savedPet = petRepository.save(pet);

        return ResponseEntity.ok(PetResponseDto.fromEntity(savedPet));
    }





    /** 펫 수정 */
    @Operation(summary = "펫 수정")
    @PutMapping(
        value = "/{petId}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PetResponseDto> updatePet(
    		@Parameter(
    	            description = "수정할 펫 ID",
    	            required = true,
    	            example = "155"
    	        )
    		@PathVariable(name = "petId") Long petId,
            Principal principal,
            @ModelAttribute PetRequestDto petRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Long userId = Long.valueOf(principal.getName());

        String filePath = DEFAULT_PROFILE_IMAGE; // 기본 이미지 경로

        // 이미지 업로드 처리
        if (image != null && !image.isEmpty()) {
            try {
                filePath = utilUpload.fileUpload(image, "petimg");
            } catch (IOException e) {
                filePath = DEFAULT_PROFILE_IMAGE; // 실패 시 기본 이미지
            }
        }
        
        PetResponseDto dto =
                petService.updatePet(petId, userId, petRequestDto, image);

        return ResponseEntity.ok(dto);
    }


    /** 펫 삭제 */
    @Operation(summary = "펫 삭제")
    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(
            @PathVariable(name = "petId") Long petId,
            Authentication authentication) {
    	Long userId = Long.parseLong(authentication.getName());
        petService.deletePet(petId, userId);
        return ResponseEntity.noContent().build();
    }

}