package com.pawject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pawject.domain.Pet;

public interface PetRepository extends JpaRepository<Pet, Long> {

    // 사용자 펫 목록
    List<Pet> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    // 펫 상세 (사용자)
    Optional<Pet> findByPetIdAndUserUserId(Long petId, Long userId);

    // 유저 탈퇴 시 모든 펫 삭제
    void deleteByUserUserId(Long userId);
}