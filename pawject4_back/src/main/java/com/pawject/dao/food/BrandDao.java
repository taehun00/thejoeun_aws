package com.pawject.dao.food;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.food.BrandDto;

@Mapper
public interface BrandDao {
	
	//<select resultMap="BrandMap" id="brandSelectAll" >
	public List<BrandDto> brandSelectAll();
}
