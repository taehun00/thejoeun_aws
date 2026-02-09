package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ROLES")
@SequenceGenerator(
        name = "ROLE_SEQ_GENERATOR",
        sequenceName = "ROLE_SEQ",
        allocationSize = 1
)
@Getter  @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_SEQ_GENERATOR")
    @Column(name = "AUTHID")
    private Long authId;


    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "AUTH", nullable = false, length = 100)
    private RoleType auth;


    public Role(RoleType auth) {
        this.auth = auth;
    }


    /**
     * FK: ROLES.USERID → USERS.USERID
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USERID", nullable = false)
    private User user;
}