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
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity    
@Table(name= "EXECPOST_LIKES",
	uniqueConstraints = @UniqueConstraint( columnNames = {"USERID" , "EXECPOST_ID"} )
)
@Getter  @Setter @NoArgsConstructor
public class ExecPostLike {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execpost_like_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execpost_like_seq", sequenceName = "EXECPOST_LIKE_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(nullable = false , name="CREATED_AT")
	private LocalDateTime createdAt; // 좋아요 누른 시점

		 
	@ManyToOne   
	@JoinColumn(name="USERID" , nullable = false)  // APP_USER_ID라는 외래키(FK)  
	private User user;  // 좋아요 누른 사람
	
	@ManyToOne  
	@JoinColumn(name="EXECPOST_ID" , nullable = false)  // POST_ID라는 외래키(FK)  
	private ExecPost post; // 좋아요 대상 게시글
	
	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now(); 
	}

	public ExecPostLike(User user, ExecPost post) {
		super();
		this.user = user;
		this.post = post;
	}
	
}

/*
 		1번유저 	1번글
 		2번유저 	1번글
 */

