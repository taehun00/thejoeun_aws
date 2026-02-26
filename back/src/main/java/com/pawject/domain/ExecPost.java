package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
// JPA관련 어노테이션
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


/***
 * 게시글 엔티티
 */
@Entity   //JPA 엔티티 선언
@Table(name= "EXECPOSTS")
@Getter  @Setter 
public class ExecPost {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execpost_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execpost_seq", sequenceName = "EXECPOST_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(nullable = false , name="CREATED_AT")
	private LocalDateTime createdAt; // 생성일시
	
	@Column(nullable = false , name="UPDATED_AT")
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
	
	////// 글(Post) 쪽에서는 누가★ 썼는지 기억 (ManyToOne)
	@ManyToOne
	@JoinColumn(  name="USERID" , nullable=false )
	private User user;   // 작성자 (AppUser와 N:1 관계)
	
	////// 한 글은 여러 이미지를 갖는다
	@OneToMany( mappedBy = "post" ,  cascade = CascadeType.ALL , orphanRemoval = true)
	private List<ExecImage> images = new ArrayList<>();

	@OneToMany( mappedBy = "post" ,  cascade = CascadeType.ALL , orphanRemoval = true)
	private List<ExecComment> comments = new ArrayList<>();
	
	
	@OneToMany( mappedBy = "originalPost" , cascade = CascadeType.ALL , orphanRemoval = true )
	private List<ExecRetweet> retweets = new ArrayList<>();  // 나를 팔로우하는 사람들 
	
	@OneToMany( mappedBy = "post" , cascade = CascadeType.ALL , orphanRemoval = true )
	private List<ExecPostLike> likes = new ArrayList<>();  // 유저가 누른 좋아요 글들
	

	////// 글은 여러 해쉬태그를 갖는다
	@ManyToMany
	@JoinTable(
			name="EXECPOST_HASHTAG" ,
			joinColumns = @JoinColumn(name="EXECPOST_ID") , 
			inverseJoinColumns = @JoinColumn(name="EXECHASHTAG_ID") 
	)
	private  List<ExecHashtag> hashtags = new ArrayList<>();  // 게시글에 연결된 해쉬태그들
	///////////////////////////////////////
	// 좋아요 수 계산
	public int getLikeCount() {
		return likes != null? likes.size() : 0 ;
	}
	// 댓글 수 계산
	public int getCommentCount() {
		return comments != null? comments.size() : 0 ;
	}
}









