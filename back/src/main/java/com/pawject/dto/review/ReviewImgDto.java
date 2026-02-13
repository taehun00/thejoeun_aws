package com.pawject.dto.review;

import lombok.Data;

@Data
public class ReviewImgDto {
	private int reviewimgid;
	private int reviewid;
	private String reviewimgname;
	private String createdat;
	

}

/*
이름            널?       유형            
------------- -------- ------------- 
REVIEWIMGID   NOT NULL NUMBER        
REVIEWID               NUMBER        
REVIEWIMGNAME NOT NULL VARCHAR2(300) 
CREATEDAT              DATE   
 
  */