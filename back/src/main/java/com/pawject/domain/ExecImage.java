package com.pawject.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity    
@Table(name= "EXECIMAGES")
@Getter  @Setter 
public class ExecImage {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "execimage_seq")  //시퀀스 사용
	@SequenceGenerator(name = "execimage_seq", sequenceName = "EXECIMAGE_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(name = "EXECIMGSRC", length=200, nullable=false)
	private String src;

	@ManyToOne  //한 글은 여러 이미지를 갖는다.
	@JoinColumn(name="EXECPOST_ID" , nullable = false)  // POST_ID라는 외래키(FK) , Post엔티티의 PK(id) 참조
	private ExecPost post;
}



