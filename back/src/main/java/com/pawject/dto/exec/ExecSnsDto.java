package com.pawject.dto.exec;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@AllArgsConstructor
@NoArgsConstructor
public class ExecSnsDto { 
	private int     postid;       //POSTID 
	private String  etitle;       //ETITLE
	private String  econtent;     //ECONTENT
	private String  eimg;	      //EIMG
	private int     ehit;	      //EHIT
	private LocalDate  createdAt; //CREATEDAT
	private LocalDate  updatedAt; //UPDATEDAT
}
