package com.pawject.dto.support;

import lombok.Data;

@Data
public class FAQDto {
	private Long faqid;
	private String category;
	private String question;
	private String answer;
	private String keywords;
	private int isactive;
	private String createdat;
	private String updatedat;
}

/*
 이름        널?       유형            
--------- -------- ------------- 
FAQID     NOT NULL NUMBER        
CATEGORY           VARCHAR2(50)  
QUESTION  NOT NULL VARCHAR2(500) 
ANSWER    NOT NULL CLOB          
KEYWORDS           VARCHAR2(500) 
ISACTIVE  NOT NULL NUMBER(1)     
CREATEDAT          DATE          
UPDATEDAT          DATE       
 
 */
