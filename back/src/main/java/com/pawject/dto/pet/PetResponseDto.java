package com.pawject.dto.pet;

import java.time.LocalDateTime;

import com.pawject.domain.Pet;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "펫 등록 요청 DTO")
public class PetResponseDto {
	private Long petId;
    private Long userId;
    private String petName;
    private String petBreed;
    private String birthDate;
    private Long petTypeId;
    private LocalDateTime createdAt;
    private Integer pAge;
    private String pGender;
    private String imageUrl;
    
    // 엔티티 → DTO 변환
    public static PetResponseDto fromEntity(Pet pet) {
        PetResponseDto dto = new PetResponseDto();
        dto.petId = pet.getPetId();
        dto.userId = pet.getUser().getUserId();
        dto.petName = pet.getPetName();
        dto.petBreed = pet.getPetBreed();
        dto.birthDate = pet.getBirthDate();
        dto.petTypeId = pet.getPetType() != null ? pet.getPetType().getPetTypeId() : null;
        dto.createdAt = pet.getCreatedAt();
        dto.pAge = pet.getPAge();
        dto.pGender = pet.getPGender();
        dto.imageUrl = pet.getPFile();
        return dto;
    }


}
