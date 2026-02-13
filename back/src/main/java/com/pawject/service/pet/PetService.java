package com.pawject.service.pet;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.domain.Pet;
import com.pawject.domain.PetType;
import com.pawject.domain.User;
import com.pawject.dto.pet.PetRequestDto;
import com.pawject.dto.pet.PetResponseDto;
import com.pawject.repository.PetRepository;
import com.pawject.repository.PetTypeRepository;
import com.pawject.repository.UserRepository;
import com.pawject.util.UtilUpload;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetTypeRepository petTypeRepository;
    private final UtilUpload utilUpload;
    private static final String DEFAULT_PET_IMAGE = "default.png"; 

    /** 사용자 펫 목록 조회 */
    @Transactional(readOnly = true)
    public List<PetResponseDto> getPetsByUserId(Long userId) {
        return petRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PetResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /** 펫 상세 조회 */
    @Transactional(readOnly = true)
    public PetResponseDto getPetDetail(Long petId, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new IllegalArgumentException("펫을 찾을 수 없습니다."));
        return PetResponseDto.fromEntity(pet);
    }

    /** 펫 등록 */
    public PetResponseDto createPet(Long userId, PetRequestDto request, MultipartFile image) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        PetType petType = petTypeRepository.findById(request.getPetTypeId())
                .orElseThrow(() -> new IllegalArgumentException("펫 타입을 찾을 수 없습니다."));

        // DTO → Entity 변환
        Pet pet = request.toEntity(user, petType);

        String filePath = DEFAULT_PET_IMAGE;

        if (image != null && !image.isEmpty()) {
            try {
                filePath = utilUpload.fileUpload(image, "petimg"); // "petimg/파일명"
            } catch (IOException e) {
                filePath = DEFAULT_PET_IMAGE;
            }
        }

        pet.setPFile(filePath);
        
        // 등록 날짜는 엔티티에서 자동 생성되도록 설정 (@CreationTimestamp)
        Pet saved = petRepository.save(pet);
        return PetResponseDto.fromEntity(saved);
    }


    /** 펫 수정 */
    public PetResponseDto updatePet(Long petId, Long userId, PetRequestDto request, MultipartFile image) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new IllegalArgumentException("펫을 찾을 수 없습니다."));

        pet.setPetName(request.getPetName());
        pet.setPetBreed(request.getPetBreed());
        pet.setBirthDate(request.getBirthDate());
        pet.setPAge(request.getPage());
        pet.setPGender(request.getPgender());

        PetType petType = petTypeRepository.findById(request.getPetTypeId())
                .orElseThrow(() -> new IllegalArgumentException("펫 타입을 찾을 수 없습니다."));
        pet.setPetType(petType);
        
        if (image != null && !image.isEmpty()) {
            try {
                String filePath = utilUpload.fileUpload(image, "petimg");
                pet.setPFile(filePath);
            } catch (IOException e) {
                throw new RuntimeException("펫 이미지 업로드 실패", e);
            }
        }

        return PetResponseDto.fromEntity(pet);
    }

    /** 펫 삭제 */
    public void deletePet(Long petId, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new IllegalArgumentException("펫을 찾을 수 없습니다."));
        petRepository.delete(pet);
    }
}
