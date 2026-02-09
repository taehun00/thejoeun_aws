package com.pawject.dto.review;

import java.util.List;

import lombok.Data;

@Data
public class ReviewDto {
	//리뷰테이블 구성
	 private int reviewid;
	 private int userid;
	 private int brandid;
	 private int foodid;
	 private String reviewimg;
	 private int rating;
	 private String title;
	 private String reviewcomment;
	 private String createdat;
	 private String updatedat;
	 
	 //조인
	 private String nickname;
	 private String brandname;
	 private String foodname;
	 private String foodimg;
	 private int pettypeid;
	 
	 
	 //아작스
	 private List<ReviewImgDto> reviewimglist;

}


/*


이름            널?       유형            
------------- -------- ------------- 
REVIEWID      NOT NULL NUMBER        
USERID        NOT NULL NUMBER        
BRANDID                NUMBER        
FOODID                 NUMBER        
REVIEWIMG              VARCHAR2(300) 
RATING                 NUMBER(1)     
TITLE                  VARCHAR2(100) 
REVIEWCOMMENT          VARCHAR2(500) 
CREATEDAT              DATE          
UPDATEDAT              DATE          



 */