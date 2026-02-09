package com.pawject.dao.food;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.food.SearchPetfoodDto;

@Mapper
public interface SearchPetfoodDao {

	//	<select resultMap="SearchPetfoodMap" id="resultcard">
	public List<SearchPetfoodDto> resultcard();
	
//	<select resultMap="SearchPetfoodMap" id="foodfilter" parameterType="java.util.HashMap">
	public List<SearchPetfoodDto> foodfilter(Map<String,Object> params);
	
	//	<select resultMap="RangeMap" id="rangeList">
	public List<SearchPetfoodDto> rangeList();
	
	
	//서치+페이징
	//<select resultMap="SearchPetfoodMap" id="foodfilter10" parameterType="java.util.HashMap">
	public List<SearchPetfoodDto> foodfilter10(Map<String,Object> params);
	
	//<select resultType="int" id="foodfilterCnt" parameterType="java.util.HashMap">
	public int foodfilterCnt(Map<String,Object> params);
	
	//ai데이터용
	//<select resultMap="SearchPetfoodMap" id="aiRecommend" >
	public List<SearchPetfoodDto> aiRecommend();
	
	//모달용
//	<select resultMap="SearchPetfoodMap" id="detailCard" parameterType="int">
	public SearchPetfoodDto detailCard(int foodid);
}
