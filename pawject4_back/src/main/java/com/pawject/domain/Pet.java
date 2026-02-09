package com.pawject.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PETS")
@SequenceGenerator(
        name = "PET_SEQ_GENERATOR",
        sequenceName = "PET_SEQ",
        allocationSize = 1
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PET_SEQ_GENERATOR")
    @Column(name = "PETID")
    private Long petId;

    /** USER (1) : PET (N) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USERID", nullable = false)
    private User user;

    @Column(name = "PETNAME", nullable = false, length = 100)
    private String petName;

    @Column(name = "PETBREED", length = 100)
    private String petBreed;

    @Column(name = "BIRTHDATE", length = 100)
    private String birthDate;

    /** PET (N) : PETTYPE (1) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PETTYPEID", nullable = false)
    private PetType petType;

    @Column(name = "PFILE", length = 255)
    private String pFile;

    @Column(name = "CREATEDAT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "PAGE")
    private Integer pAge;

    @Column(name = "PGENDER", length = 10)
    private String pGender;


    public Pet(User user, String petName) {
        this.user = user;
        this.petName = petName;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
