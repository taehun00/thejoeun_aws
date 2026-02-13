package com.pawject.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.pawject.domain.PetType;
import com.pawject.repository.PetTypeRepository;

@Configuration
public class PetTypeInitConfig {

    @Bean
    CommandLineRunner initPetType(PetTypeRepository petTypeRepository) {
        return args -> {
            if (petTypeRepository.count() == 0) {
                petTypeRepository.saveAll(List.of(
                        new PetType(1L, "고양이"),
                        new PetType(2L, "강아지")
                ));
            }
        };
    }
}