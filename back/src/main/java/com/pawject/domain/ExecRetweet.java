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
@Table(name= "EXECRETWEETS",
	uniqueConstraints = @UniqueConstraint(
		name="UK_RETWEET_USER_ORIG" ,	
		columnNames = {"USERID" , "EXECORIGINAL_POST_ID"}
	)
)
@Getter  @Setter @NoArgsConstructor
public class ExecRetweet {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execretweet_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execretweet_seq", sequenceName = "EXECRETWEET_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(nullable = false , name="CREATED_AT")
	private LocalDateTime createdAt; // 리트윗시점

		 
	@ManyToOne   
	@JoinColumn(name="USERID" , nullable = false)  // APP_USER_ID라는 외래키(FK)  
	private User user;  // 리트윗한 사람
	
	@ManyToOne  
	@JoinColumn(name="EXECORIGINAL_POST_ID" , nullable = false)  // ORIGINAL_POST_ID라는 외래키(FK)  
	private ExecPost originalPost; //원본 게시글
	
	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now(); 
	}

	public ExecRetweet(User user, ExecPost originalPost) {
		super();
		this.user = user;
		this.originalPost = originalPost;
	}
	
}

/*
 		1번유저 	1번글
 		2번유저 	1번글
 */

