package com.pawject.dto.food;

import java.util.Date;

import lombok.Data;

@Data
public class FoodDto {
	
	private int foodid;
	private String foodname;
	private int brandid;
	private String description;
	private String mainingredient;
	private String subingredient;
	private int pettypeid;
	private String category;
	private String petagegroup;
	private String isgrainfree;
	private double calorie;
	private String foodtype;
	private String foodimg;
	private String createdat;
	private String updatedat;
	private String brandname;
	

	
	

}

/*
FOODID         NOT NULL NUMBER        
FOODNAME       NOT NULL VARCHAR2(100) 
BRANDID        NOT NULL NUMBER        
DESCRIPTION             VARCHAR2(500) 
MAININGREDIENT NOT NULL VARCHAR2(200) 
SUBINGREDIENT           VARCHAR2(200) 
PETTYPEID      NOT NULL NUMBER        
CATEGORY       NOT NULL VARCHAR2(50)  
PETAGEGROUP             VARCHAR2(50)  
ISGRAINFREE             CHAR(1)       
CALORIE                 NUMBER(5,1)   
FOODTYPE                VARCHAR2(20)  
FOODIMG                 VARCHAR2(300) 
 */