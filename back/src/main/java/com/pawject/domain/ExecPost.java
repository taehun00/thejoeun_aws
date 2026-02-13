package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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

/**
 * 운동SNS 게시글 엔티티
 */

@Entity
@Getter @Setter
@Table(name = "EXECSNS")
public class ExecPost {

    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execsns_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execsns_seq", sequenceName = "EXECSNS_SEQ" , allocationSize = 1)    
    @Column(name = "POSTID")
    private Long postid;

    @Column(name = "ETITLE", nullable = false, length = 100)
    private String etitle;
    
	@Column
	private boolean deleted=false; // 삭제 여부
    
    @Lob
    @Column( nullable = false)
    private String econtent;
	
	@Column(name = "EHIT", nullable = false)
	private int ehit = 0; // 기본값 0
    
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdAt; // 생성일시
	
	@Column(nullable = false , name="UPDATEDAT")
	private LocalDateTime updatedAt; // 수정일시

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
	private User user;   // 작성자 (User와 N:1 관계)
	
	////// 한 글은 여러 이미지를 갖는다
	@OneToMany( mappedBy = "execPost" ,  cascade = CascadeType.ALL , orphanRemoval = true)
	private List<ExecImage> execImages = new ArrayList<>();

	@OneToMany( mappedBy = "execPost" ,  cascade = CascadeType.ALL , orphanRemoval = true)
	private List<ExecComment> execComments = new ArrayList<>();

	@OneToMany( mappedBy = "execPost" , cascade = CascadeType.ALL , orphanRemoval = true )
	private List<ExecPostLike> execLikes = new ArrayList<>();  // 유저가 누른 좋아요 글들

	@OneToMany( mappedBy = "originalPost" , cascade = CascadeType.ALL , orphanRemoval = true )
	private List<ExecRetweet> execRetweets = new ArrayList<>();  // 나를 팔로우하는 사람들 

	
	
	////// 글은 여러 해쉬태그를 갖는다
	@ManyToMany
	@JoinTable(
			name="EXECPOSTHASHTAG" ,
			joinColumns = @JoinColumn(name="EXECPOSTID") , 
			inverseJoinColumns = @JoinColumn(name="EXECHASHTAGSID") 
	)
	private  List<ExecHashtag> execHashtags = new ArrayList<>();  // 게시글에 연결된 해쉬태그들
	///////////////////////////////////////
	// 좋아요 수 계산
	public int getLikeCount() {
		return execLikes != null? execLikes.size() : 0 ;
	}
	// 댓글 수 계산
	public int getCommentCount() {
		return execComments != null? execComments.size() : 0 ;
	}


	
}
