package com.pawject.dto.food;

import lombok.Data;

@Data
public class BrandDto {
	
	private int brandid;
	private String brandname;
	private String country;
	private String brandtype;
	private String origin;	
	private String brandinfo;
}

/*
 BRANDID   NOT NULL NUMBER        
BRANDNAME NOT NULL VARCHAR2(100) 
COUNTRY            VARCHAR2(100) 
BRANDTYPE NOT NULL VARCHAR2(50)  
CATEGORY           VARCHAR2(50)  
BRANDINFO          VARCHAR2(500) 

 */