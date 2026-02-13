package com.pawject.dto.food;

import lombok.Data;

@Data
public class NutriDto {

	private int foodid;
	private int nutrientid;
	private double amount;
	private String nutrientname;
	private String unit;
	private int rangeid;
	private int minvalue;
	private int maxvalue;
	private String rangelabel;
	private int pettypeid;
	
	
	
	
	
}

/*
---------- -- ------ 
FOODID        NUMBER 
NUTRIENTID    NUMBER 
AMOUNT        NUMBER 
이름           널?       유형            
------------ -------- ------------- 
NUTRIENTID   NOT NULL NUMBER        
NUTRIENTNAME NOT NULL VARCHAR2(100) 
UNIT                  VARCHAR2(50)  
이름         널?       유형           
---------- -------- ------------ 
RANGEID    NOT NULL NUMBER       
PETTYPEID           NUMBER       
NUTRIENTID          NUMBER       
MINVALUE   NOT NULL NUMBER       
MAXVALUE   NOT NULL NUMBER       
RANGELABEL NOT NULL VARCHAR2(50) 


 */