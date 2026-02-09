package com.pawject.dao.food;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.food.FoodDto;
import com.pawject.dto.food.FoodDtoForList;

@Mapper
public interface FoodDao {

	//<insert id="fooodinsert" parameterType="FoodDto">
	public int foodinsert(FoodDto dto);
	
	//<select resultType="FoodDto" id="foodselectAll">
	public List<FoodDto> foodselectAll();
	
	//<select resultType="FoodDto"  id="foodselect" parameterType="int">
	public FoodDto foodselect(int foodid);
	
	//<update id="foodupdate" parameterType="FoodDto">
	public int foodupdate(FoodDto dto);
	
	//<delete id="fooddelete" parameterType="int">
	public int fooddelete(int foodid);

	
	//<select resultMap="FoodMap"  id="foodselectForList">
	public List<FoodDtoForList> foodselectForList();
	
	//<select resultMap="FoodMap"    id="foodselectwithBrand" parameterType="int">
	public FoodDto foodselectwithBrand(int foodid);


	//페이징
	//<select resultMap="FoodMap"  id="foodselect10" parameterType="java.util.Map">
	public List<FoodDtoForList> foodselect10(HashMap<String, Object> para);
	
	//<select resultType="int" id="foodselectcnt" >
	public int foodselectcnt();

	
	//검색
	//	<select resultMap="FoodMap" id="foodsearch" parameterType="java.util.HashMap">
	public List<FoodDtoForList> foodsearch(HashMap<String, Object> para);
	
	//		<select resultType="int" id="foodsearchcnt" parameterType="java.util.HashMap">
	public int foodsearchcnt(HashMap<String, Object> para);
	
	
	//체험단연동
//	<select resultMap="FoodNameMap" id="foodselectName" >
	public List<FoodDto> foodselectName();
}
