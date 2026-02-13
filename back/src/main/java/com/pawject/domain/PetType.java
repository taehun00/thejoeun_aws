package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "PETTYPE")
public class PetType {

    @Id
    @Column(name = "PETTYPEID")
    private Long petTypeId;

    @Column(name = "PETTYPENAME", nullable = false, length = 100)
    private String petTypeName;

    protected PetType() {
        // JPA 기본 생성자
    }

    public PetType(Long petTypeId, String petTypeName) {
        this.petTypeId = petTypeId;
        this.petTypeName = petTypeName;
    }
    
	@OneToMany(mappedBy = "pettype", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Petdisease> petdisease = new ArrayList<>();


}
