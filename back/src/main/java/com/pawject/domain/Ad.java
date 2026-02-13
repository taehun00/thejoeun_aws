package com.pawject.domain;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity   //JPA 엔티티 선언
@Table(name= "ADS")
@Getter  @Setter 
public class Ad {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "ads_seq")  //시퀀스 사용
	@SequenceGenerator(name = "ads_seq", sequenceName = "ADS_SEQ" , allocationSize = 1) 
	private Long id; //PK

	@Column(nullable = false , name="CREATED_AT")
	private LocalDateTime createdAt; // 생성일시
	
	@Column(nullable = false , name="UPDATED_AT")
	private LocalDateTime updatedAt; // 수정일시

	@Column(nullable = false , name="TITLE" , length=100)
	private String title;

	@Column(nullable = false , name="CONTENT" , length=255)	
	private String content;
	
	@Column(name="IMG" , length=100)	
	private String img; 
	
	//@Column
	private boolean active;  //활용여부
	
	
	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}
	
	@PreUpdate
	void onUpdate() { 
		this.updatedAt = LocalDateTime.now();
	}

	@ManyToOne
	@JoinColumn(  name="USER_ID" , nullable=false )
	private User user;   // 작성자 (AppUser와 N:1 관계)
	
	
	
	
}
