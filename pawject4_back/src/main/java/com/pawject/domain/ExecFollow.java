package com.pawject.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint; // ★ 추가
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 운동 SNS 팔로우 엔티티
 */

@Entity    
@Table(
    name= "EXECFOLLOWS",
    uniqueConstraints = @UniqueConstraint(columnNames = {"FOLLOWERID", "FOLLOWEEID"}) // ★ 유니크 제약조건 추가
)
@Getter  @Setter  @NoArgsConstructor
public class ExecFollow {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execfollows_seq")  // 시퀀스 사용
    @SequenceGenerator(name = "execfollows_seq", sequenceName = "EXECFOLLOWS_SEQ" , allocationSize = 1) 
    private Long id; // PK
    
    @Column(nullable = false , name="CREATEDAT")
    private LocalDateTime createdAt; // 생성일시

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now(); 
    }
    

    public ExecFollow(User follower, User followee) {
		this.follower = follower;
		this.followee = followee;
	}
    
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="FOLLOWERID" ,nullable = false)
    private User follower;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="FOLLOWEEID" ,nullable = false)
    private User followee;
}


/*
팔로워: 나를 구독, 내팬
팔로잉: 내가한구독, 김우빈, 신민아

나 : 1   김우빈 : 2   신민아: 3

    follower    (내가)    followee(팔로우를 당하는 사람들)
1   1           2        
2   1           3                    
*/
