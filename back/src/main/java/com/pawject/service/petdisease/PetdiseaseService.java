package com.pawject.service.petdisease;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawject.domain.PetType;
import com.pawject.domain.Petdisease;
import com.pawject.domain.User;
import com.pawject.dto.petdisease.PetdiseaseRequestDto;
import com.pawject.dto.petdisease.PetdiseaseResponseDto;
import com.pawject.repository.PetTypeRepository;
import com.pawject.repository.PetdiseaseReopsitory;
import com.pawject.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PetdiseaseService {

    private final PetdiseaseReopsitory disrepo;
    private final UserRepository urepo;
    private final PetTypeRepository petrepo;

    // 게시글 작성
    public PetdiseaseResponseDto createPost(Long userid, PetdiseaseRequestDto dto, Long pettypeid) {

        User user = urepo.findById(userid)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        PetType pettype = petrepo.findById(pettypeid)
                .orElseThrow(() -> new IllegalArgumentException("펫타입 없음"));

        Petdisease petdis = new Petdisease();
        petdis.setAdmin(user);
        petdis.setPettype(pettype);

        petdis.setDisname(dto.getDisname());
        petdis.setDefinition(dto.getDefinition());
        petdis.setCause(dto.getCause());
        petdis.setSymptom(dto.getSymptom());
        petdis.setTreatment(dto.getTreatment());
        petdis.setTip(dto.getTip());

        Petdisease saved = disrepo.save(petdis);

        return PetdiseaseResponseDto.from(saved);
    }

    // 게시글 수정
    public PetdiseaseResponseDto updatePetdis(Long disno, PetdiseaseRequestDto dto, Long pettypeid) {

        Petdisease petdis = disrepo.findById(disno)
                .orElseThrow(() -> new IllegalArgumentException("질환정보 없음"));

        PetType pettype = petrepo.findById(pettypeid)
                .orElseThrow(() -> new IllegalArgumentException("펫타입 없음"));

        petdis.setPettype(pettype);

        petdis.setDisname(dto.getDisname());
        petdis.setDefinition(dto.getDefinition());
        petdis.setCause(dto.getCause());
        petdis.setSymptom(dto.getSymptom());
        petdis.setTreatment(dto.getTreatment());
        petdis.setTip(dto.getTip());

        Petdisease updated = disrepo.save(petdis);

        return PetdiseaseResponseDto.from(updated);
    }

    // 게시글 삭제
    public void deletePetdis(Long disno) {
        Petdisease petdis = disrepo.findById(disno)
                .orElseThrow(() -> new IllegalArgumentException("질환정보 없음"));

        disrepo.delete(petdis);
    }

    // 단일 게시글 조회
    @Transactional(readOnly = true)
    public PetdiseaseResponseDto getPetdis(Long disno) {
        Petdisease petdis = disrepo.findById(disno)
                .orElseThrow(() -> new IllegalArgumentException("질환정보 없음"));
        return PetdiseaseResponseDto.from(petdis);
    }

    // 게시글 조회
    @Transactional(readOnly = true)
    public Page<Petdisease> getPetdiseasePage(int page, int size, String condition, Long pettypeid) {

        if (page < 1) page = 1;
        if (size < 1) size = 10;
        if (condition == null || condition.isBlank()) condition = "new";

        int start = (page - 1) * size + 1;
        int end = page * size;

        List<Petdisease> list = disrepo.findPetdiseaseWithPaging(pettypeid, condition, start, end);
        long total = disrepo.countByPettypeid(pettypeid);

        Pageable pageable = PageRequest.of(page - 1, size);

        return new PageImpl<>(list, pageable, total);
    }

    // 검색 
    @Transactional(readOnly = true)
    public Page<PetdiseaseResponseDto> list(Long pettypeid, String keyword, Pageable pageable, String condition) {

        if (pageable == null) pageable = PageRequest.of(0, 10);
        if (condition == null || condition.isBlank()) condition = "new";

        int page = pageable.getPageNumber() + 1;
        int size = pageable.getPageSize();

        int start = (page - 1) * size + 1;
        int end = page * size;

        List<Petdisease> list = disrepo.searchPetdiseaseWithPaging(pettypeid, keyword, condition, start, end);
        long total = disrepo.countSearch(pettypeid, keyword);

        Page<Petdisease> pageResult = new PageImpl<>(list, pageable, total);

        return pageResult.map(PetdiseaseResponseDto::from);
    }
}
