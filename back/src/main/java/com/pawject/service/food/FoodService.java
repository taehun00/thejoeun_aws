package com.pawject.service.food;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.food.BrandDto;
import com.pawject.dto.food.FoodDto;
import com.pawject.dto.food.FoodDtoForList;
import com.pawject.dto.food.NutriDto;


public interface FoodService {

	//<insert id="fooodinsert" parameterType="FoodDto">
	public int foodinsert(FoodDto dto,  MultipartFile file);
	
	//<select resultType="FoodDto" id="foodselectAll">
	public List<FoodDto> foodselectAll();
	
	//<select resultType="FoodDto"  id="foodselect" parameterType="int">
	public FoodDto foodselect(int foodid);
	
	//<update id="foodupdate" parameterType="FoodDto">
	public int foodupdate(FoodDto dto, MultipartFile file);
	
	//<delete id="fooddelete" parameterType="int">
	public int fooddelete(int foodid);
		
	//<insert id="nutriinsert" parameterType="NutriDto">
	public int nutriinsert(NutriDto dto);
	
	//<select resultType="NutriDto" id="nutriselectAll">
	public List<NutriDto> nutriselectAll();
	
	//<select resultType="NutriDto" id="nutriselect" parameterType="int">
	public List<NutriDto> nutriselect(int foodid);
	
	//<update id="nutriupdate" parameterType="NutriDto">
	public int nutriupdate(NutriDto dto);
	
	//<delete id="nutridelete" parameterType="NutriDto">
	public int nutridelete(NutriDto dto);
	
	public int nutrideleteAll(int foodid);
	
	public List<FoodDtoForList> foodselectForList();
	
	public NutriDto nutriselectForWrite(int foodid);
	
	public List<BrandDto> brandSelectAll();
	
	public List<NutriDto> nutrientSelectName();
	
	public FoodDto foodselectwithBrand(int foodid);
	
	public List<NutriDto> nutriselectWithInfo(int foodid);

	

	public List<FoodDtoForList> foodselect10(int pstartno, String condition); 
	
	public int foodselectcnt();
	
	//dao랑 다름!!
	public List<FoodDtoForList> foodsearch(String keyword, String searchType, String condition, int pstartno);
	
	public int foodsearchcnt(String keyword, String searchType);
	
	
	//
	public List<FoodDto> foodselectName();
	

}
