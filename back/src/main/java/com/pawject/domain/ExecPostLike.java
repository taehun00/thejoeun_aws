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
@Table(name= "EXECPOSTLIKES",
	uniqueConstraints = @UniqueConstraint( columnNames = {"APP_USER_ID" , "POST_ID"} )
)
@Getter  @Setter @NoArgsConstructor
public class ExecPostLike {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execpostlikes_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execpostlikes_seq", sequenceName = "EXECPOSTLIKES_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdAt; // 좋아요 누른 시점

		 
	@ManyToOne   
	@JoinColumn(name="USERID" , nullable = false)  // APP_USER_ID라는 외래키(FK)  
	private User user;  // 좋아요 누른 사람
	
	@ManyToOne  
	@JoinColumn(name="EXECPOSTID" , nullable = false)  // POST_ID라는 외래키(FK)  
	private ExecPost execPost; // 좋아요 대상 게시글
	
	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now(); 
	}

	public ExecPostLike(User user, ExecPost execPost) {
		super();
		this.user = user;
		this.execPost = execPost;
	}


	
}

/*
 		1번유저 	1번글
 		2번유저 	1번글
 */

