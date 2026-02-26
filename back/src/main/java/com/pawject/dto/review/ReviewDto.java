package com.pawject.dto.review;

import java.sql.Date;
import java.util.List;

import lombok.Data;

@Data
public class ReviewDto {
	//리뷰테이블 구성
    private Integer reviewid;
    private Integer userid;
    private Integer brandid;
    private Integer foodid;
    private Integer rating;
    private String title;
    private String reviewcomment;
    private Date createdat;
    private Date updatedat;
	 
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