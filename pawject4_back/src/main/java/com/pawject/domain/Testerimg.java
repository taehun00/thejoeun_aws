package com.pawject.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "TESTERIMG")
@Getter @Setter
public class Testerimg {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "testerimg_seq")
	@SequenceGenerator(name = "testerimg_seq", sequenceName = "TESTERIMG_SEQ",  allocationSize = 1 )
	private Long testerimgid;

	@Column(length=200 , nullable=false)
	private String imgsrc;

	@ManyToOne  //한 글은 여러 이미지를 갖는다.
	@JoinColumn(name="TESTERID" , nullable = false) 
	private Tester tester;


}
	