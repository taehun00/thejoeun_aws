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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "PETDISEASE")
@Getter @Setter
public class Petdisease {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "petdisease_seq")
	@SequenceGenerator(name = "petdisease_seq", sequenceName = "PETDISEASE_SEQ",  allocationSize = 1 )
	private Long disno;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ADMINID", referencedColumnName = "USERID")
	private User admin;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PETTYPEID")
	private PetType pettype;

	// 읽기 전용
	@Column(name = "PETTYPEID", insertable = false, updatable = false)
	private Long pettypeid;
	
	@Column(nullable = false, length = 100)
	private String disname;
	
	@Column(nullable = false, length = 500)
	private String definition;
	
	@Column(nullable = false, length = 500)
	private String cause;
	
	@Column(nullable = false, length = 500)
	private String symptom;
	
	@Column(nullable = false, length = 500)
	private String treatment;
	
	@Column(length = 500)
	private String tip;
	
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdat; // 생성일시
	@Column(nullable = false , name="UPDATEDAT")
	private LocalDateTime updatedat; // 수정일시
	
	@PrePersist
	void onCreate() {
		this.createdat = LocalDateTime.now();
		this.updatedat = LocalDateTime.now();
	}
	
	@PreUpdate
	void onUpdate() { 
		this.updatedat = LocalDateTime.now();
	}


		
	}	
	
	
	

/**
 *-- (FK) ADMINID : USERS(USERID), PETTYPEID : PETTYPE(PETTYPEID)
CREATE TABLE PETDISEASE (
    disno       NUMBER PRIMARY KEY,                 -- 글 번호
    adminid     NUMBER NOT NULL,                    -- 작성자(운영자-users.userid 참조)
    pettypeid   NUMBER NOT NULL,                    -- 반려동물 종류(pettype.pettypeid)
    disname     VARCHAR2(100) NOT NULL,             -- 질환명

    definition  VARCHAR2(500) NOT NULL,             -- 정의
    cause       VARCHAR2(500) NOT N                 -- 원인
    symptom     VARCHAR2(500) NOT NULL,             -- 증상
    treatment   VARCHAR2(500) NOT NULL,             -- 치료/관리
    tip         VARCHAR2(500) NOT NULL,             -- 영양팁

    createdat   DATE DEFAULT SYSDATE,               -- 작성일자
    updatedat   DATE DEFAULT SYSDATE,               -- 수정일

    CONSTRAINT fk_disease_user FOREIGN KEY (adminid)
        REFERENCES USERS(userid),

    CONSTRAINT fk_disease_pettype FOREIGN KEY (pettypeid)
        REFERENCES PETTYPE(pettypeid)
);

-- 시퀀스
create sequence petdisease_seq;

 */