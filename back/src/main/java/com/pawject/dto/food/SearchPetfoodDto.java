package com.pawject.dto.food;

import lombok.Data;

@Data
public class SearchPetfoodDto {
	
	//펫타입
	private int pettypeid;
	private String pettypename;
	
	//브랜드
	private int brandid;
	private String brandname;
	private String country;
	private String brandtype;
	private String origin;	
	private String brandinfo;	

	//사료
	private int foodid;
	private String foodname;
	private String description;
	private String mainingredient;
	private String subingredient;
	private String category;
	private String petagegroup;
	private String isgrainfree;
	private double calorie;
	private String foodtype;
	private String foodimg;
	
	//영양
	private int nutrientid;
	private double amount;
	private String nutrientname;
	private String unit;
	private int rangeid;
	private int minvalue;
	private int maxvalue;
	private String rangelabel;

	private String nutriinfo;
	
	//칼로리검색용
	private int mincalorie;	
	private int maxcalorie;	

	//별점(요약카드)
	private double avgrating;


}
