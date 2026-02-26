package com.pawject.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; 
import jakarta.persistence.ManyToMany; 
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity    
@Table(name= "EXECHASHTAGS")
@Getter  @Setter 
public class ExecHashtag {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "exechashtag_seq")  //시퀀스 사용
	@SequenceGenerator(name = "exechashtag_seq", sequenceName = "EXECHASHTAG_SEQ" , allocationSize = 1) 
	private Long id; //PK
	
	@Column(length=200 , nullable=false , unique=true)
	private String name;
 
	////// 해쉬태그는 여러개의 글에서 사용가능하다
	@ManyToMany(mappedBy = "hashtags")
	private  List<ExecPost> posts = new ArrayList<>();   // 어떤 게시글들이 이 해쉬태그를 쓰는지	
}



