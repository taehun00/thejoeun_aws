package com.pawject.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
// JPA관련 어노테이션
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


/**
 * 운동SNS 댓글 엔티티
 */
@Entity   //JPA 엔티티 선언
@Table(name= "EXECCOMMENTS")
@Getter  @Setter 
public class ExecComment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execcomments_seq")  //시퀀스 사용
	@SequenceGenerator(name = "EXECCOMMENTS_SEQ", sequenceName = "EXECCOMMENTS_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdAt; // 생성일시
	
	@Column(nullable = false , name="UPDATEDAT")
	private LocalDateTime updatedAt; // 수정일시

	@Column
	private boolean deleted=false; // 삭제 여부
	
	@Lob
	@Column(nullable = false)
	private String content;  // 게시글 내용 (긴 텍스트 가능)
	
	
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
	@JoinColumn( name="USERID" , nullable = false)
	private User user; //작성자
	
	@ManyToOne
	@JoinColumn( name="EXECPOSTID" , nullable = false)
	private ExecPost execPost;   // 어떤 게시글에 달린 댓글
	
}









