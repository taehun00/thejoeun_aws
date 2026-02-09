package com.pawject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pawject.domain.PetType;

public interface PetTypeRepository extends JpaRepository<PetType, Long> {
}