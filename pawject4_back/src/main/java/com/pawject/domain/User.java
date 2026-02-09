package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "USERS",
   uniqueConstraints = @UniqueConstraint(
         name="UK_APPUSER_EMAIL_PROVIDER" ,   
         columnNames = {"EMAIL" , "PROVIDER"}
      )
)
@SequenceGenerator(
        name = "USER_SEQ_GENERATOR",
        sequenceName = "USER_SEQ",
        allocationSize = 1
)
@Getter  @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_SEQ_GENERATOR")
    @Column(name = "USERID")
    private Long userId;

    @Column(name = "EMAIL", nullable = false, length = 200, unique = true)
    private String email;

    @Column(name = "NICKNAME", nullable = false, length = 100)
    private String nickname;

    @Column(name = "PASSWORD", nullable = false, length = 100)
    private String password;

    @Column(name = "UFILE", length = 255)
    private String ufile;

    @Column(name = "CREATEDAT")
    private LocalDateTime createdAt;

    @Column(name = "MOBILE", length = 200)
    private String mobile;

    @Column(name = "PROVIDER", length = 50)
    private String provider="local";

    @Column(name = "PROVIDERID", length = 100)
    private String providerId="local";

    @Column(name = "SCORE")
    private Integer score;

    @Column(name = "GRADE", length = 50)
    private String grade;
    

	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
	}
    public User(String email, String nickname, String password) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.provider = "local";
        this.score = 0;
        this.grade = "새싹";
        this.role = "ROLE_MEMBER";
    }
    
    @Builder.Default
	@Column(nullable = false , length = 50)
	private String role="ROLE_MEMBER"; // 기본 권한
    
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Pet> pet = new ArrayList<>();
    
   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Tester> tester = new ArrayList<>();
   
   @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)  
   private List<Petdisease> petdis = new ArrayList<>();
   
   
   
}