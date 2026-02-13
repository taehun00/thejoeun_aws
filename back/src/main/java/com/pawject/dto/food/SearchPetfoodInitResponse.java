package com.pawject.dto.food;

import java.util.List;

import lombok.Data;

@Data
public class SearchPetfoodInitResponse {
    private List<BrandDto> brandList;
    private List<FoodDto> foodList;
    private List<NutriDto> nutrientList;
    private List<SearchPetfoodDto> rangeList;
}