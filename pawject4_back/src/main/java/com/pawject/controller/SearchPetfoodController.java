package com.pawject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.food.SearchPetfoodDto;
import com.pawject.dto.food.SearchPetfoodInitResponse;
import com.pawject.dto.support.CSQuestionDto;
import com.pawject.service.food.FoodApi;
import com.pawject.service.food.FoodService;
import com.pawject.service.food.SearchPetfoodService;
import com.pawject.util.UtilPaging;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "PETFOODSEARCHER", description = "사료검색") 
@RestController 
@RequestMapping("/api/petfoodsearcher") 
@RequiredArgsConstructor 
public class SearchPetfoodController {
@Autowired private SearchPetfoodService service;
@Autowired private FoodService fservice;

	@Operation(summary = "초기값 불러오기")
    @GetMapping("/init")   //검색창 초기값 기존 model -> dto로 분리
    public ResponseEntity<SearchPetfoodInitResponse> init() {
    		SearchPetfoodInitResponse res = new SearchPetfoodInitResponse();
        res.setBrandList(fservice.brandSelectAll());
        res.setFoodList(fservice.foodselectAll());
        res.setNutrientList(fservice.nutrientSelectName());
        res.setRangeList(service.rangeList());
        return ResponseEntity.ok(res);
    }
    
 // 검색 + 페이징
	@Operation(summary = "검색")
    @GetMapping("/searchfilterPaging")
    public Map<String, Object> searchfilterPaging(    
            @RequestParam(name="keyword", required = false) String keyword,
            @RequestParam(name="pettypeid", required = false) Integer pettypeid,
            @RequestParam(name="foodtype", required = false) String foodtype,
            @RequestParam(name="brandid", required = false) Integer brandid,
            @RequestParam(name="foodid", required = false) Integer foodid,
            @RequestParam(name="category", required = false) String category,
            @RequestParam(name="petagegroup", required = false) String petagegroup,
            @RequestParam(name="isgrainfree", required = false) String isgrainfree,
            @RequestParam(name="origin", required = false) String origin,
            @RequestParam(name="rangeid", required = false) Integer rangeid,
            @RequestParam(name="minvalue", required = false) Integer minvalue,
            @RequestParam(name="maxvalue", required = false) Integer maxvalue,
            @RequestParam(name="pstartno", defaultValue = "1") int pstartno,
            @RequestParam(name="condition", required = false) String condition
    ) { 
        // 위치 주의
        if (minvalue != null && minvalue < 0) minvalue = null;
        if (maxvalue != null && maxvalue < 0) maxvalue = null;

        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("pettypeid", pettypeid);
        params.put("foodtype", foodtype);
        params.put("brandid", brandid);
        params.put("foodid", foodid);
        params.put("category", category);
        params.put("petagegroup", petagegroup);
        params.put("isgrainfree", isgrainfree);
        params.put("origin", origin);
        params.put("rangeid", rangeid);
        params.put("minvalue", minvalue);
        params.put("maxvalue", maxvalue);

        int total = service.foodfilterCnt(params);
        List<SearchPetfoodDto> list = service.foodfilter10(params, condition, pstartno);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);

        UtilPaging paging = new UtilPaging(total, pstartno, 5, 10);
        result.put("paging", paging);
        result.put("total", total);

        return result;
    }

	
	@Autowired private FoodApi apiservice;
	@Operation(summary = "사료 검색 AI 필터 변환")
	@PostMapping("/foodapi")
	public ResponseEntity<Map<String, Object>> foodapi(@RequestParam(name="userMessage") String userMessage) {
	    Map<String, Object> result = apiservice.aiChangeFilter(userMessage);
	    return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "사료 상세 카드 조회")
	@GetMapping("/modalcard/{foodid}")
	public ResponseEntity<SearchPetfoodDto> modalcard(@PathVariable(name="foodid") int foodid){
	    return ResponseEntity.ok(service.detailCard(foodid));
	}
}
