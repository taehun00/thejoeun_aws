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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "TESTER")
@Getter @Setter
public class Tester {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tester_seq")
	@SequenceGenerator(name = "tester_seq", sequenceName = "TESTER_SEQ",  allocationSize = 1 )
	private Long testerid;
	
	@Column	
	private String category;	
	
	@Column(nullable = false)
	private String title;

	@Lob
	@Column(nullable = false)
	private String content; 
	
//	@Column(nullable = false)
//	private Integer userid;
	
	@Column
	private Integer foodid=0;  // 사료게시판 사료와 연관이 있을 경우
	
	@Column
	private Integer status=0;  //0모집중 1모집완료 - 관리자 기능
	
	@Column
	private Integer views=0;
	
	@Column
	private Integer isnotice=0; //0공지x 1공지중  - 관리자 기능
	
	@Column
	private Integer posttype = 0; // 0 일반글(유저글) / 1 모집공고(관리자 공고) - 관리자 기능
	
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdat; // 생성일시
	@Column(nullable = false , name="UPDATEDAT")
	private LocalDateTime updatedat; // 수정일시

	
	@Column(name = "DELETED", nullable = false)
	private boolean deleted = false;   //DELETED NUMBER(1) / CHAR(1)
	
	@PrePersist
	void onCreate() {
		this.createdat = LocalDateTime.now();
		this.updatedat = LocalDateTime.now();
	}
	
	@PreUpdate
	void onUpdate() { 
		this.updatedat = LocalDateTime.now();
	}
	
	//유저 만들고 풀기
	@ManyToOne
	@JoinColumn(name = "USERID")
	private User user;

	@OneToMany(mappedBy = "tester", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Testerimg> testerimg = new ArrayList<>();

	@OneToMany(mappedBy = "tester", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<TesterComment> testercomment = new ArrayList<>();
	
	
}
/**
 * tester 테이블 필요 컬럼
testerid - 시퀀스 이용, 고유 번호
category - 분류 (사료, 용품 등)
title 제목
content 내용
userid 유저
foodid 푸드랑 연관 있을 경우 - 이 경우 사료검색 게시판에서 테스터 모집중 버튼 노출 가능할지도?
status 모집상태
views 조회수
isnotice 공지여부-모집상태와 연동
createdat 등록일
updatedat 수정일
deketed 삭제여부

 */