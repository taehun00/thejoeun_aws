package com.pawject.dto.pet;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.pawject.domain.Pet;
import com.pawject.domain.PetType;
import com.pawject.domain.User;
import com.pawject.dto.user.UserRequestDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "펫 등록 요청 DTO")
public class PetRequestDto {
    private String petName;     // 펫 이름
    private String petBreed;    // 품종
    private String birthDate;   // 생일 (문자열로 저장됨)
    private Long petTypeId;     // 펫 타입 ID (필수)

    private Integer page;

    private String pgender;

    
    // RequestDto → Entity 변환
    public Pet toEntity(User user, PetType petType) {
        return Pet.builder()
                .user(user)
                .petName(petName)
                .petBreed(petBreed)
                .birthDate(birthDate)
                .petType(petType)
                .pAge(page)
                .pGender(pgender)
                .build();
    }


}
