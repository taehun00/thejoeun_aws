package com.pawject.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.food.FoodDto;
import com.pawject.dto.food.FoodDtoForList;
import com.pawject.dto.food.NutriDto;
import com.pawject.service.food.FoodService;
import com.pawject.service.food.NaverOcrService;
import com.pawject.util.UtilPaging;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "FOOD", description = "사료 관리") 
@RestController 
@RequiredArgsConstructor 
@RequestMapping("/api/foodboard")
//@PreAuthorize("isAuthenticated() and hasRole('ROLE_ADMIN')")
public class FoodController {
	@Autowired private FoodService service;

	//페이징 적용 버전
	@Operation(summary = "사료리스트")
	@RequestMapping("/foodselectForList")
	public Map<String, Object> foodselectForList(
 		@RequestParam(name="condition", required=false) String condition,
	    @RequestParam(name="pageNo",defaultValue="1") int pageNo){	
		Map<String, Object> result = new HashMap<>();
		
		int total=service.foodselectcnt();
		List<FoodDtoForList> list = service.foodselect10(pageNo, condition);

        UtilPaging paging = new UtilPaging(total, pageNo);  

        result.put("paging", paging);
	    	result.put("total", total);
	    	result.put("list", list);
	
	    return result;
	}
	
	//빠른 삭제
	@Operation(summary = "빠른삭제")
	@PostMapping("/foodquikdelete")
	public Map<String, Object> foodquikdelete(@RequestParam(name="foodid") int foodid){
		Map<String, Object> result = new HashMap<>();
		FoodDto fdto = new FoodDto();
		fdto.setFoodid(foodid);
		result.put("result", service.fooddelete(foodid));
		return result;
	}
	
	
	//검색 기능+검색페이징
	@Operation(summary = "검색")
	@RequestMapping("/foodsearch")
	public Map<String, Object> foodsearch(
	        @RequestParam(name="keyword") String keyword,
	        @RequestParam(name="searchType") String searchType,
	        @RequestParam(name="condition", required=false) String condition,
	        @RequestParam(name="pageNo", defaultValue="1") int pageNo) {

	    Map<String, Object> result = new HashMap<>();
	    int total = service.foodsearchcnt(keyword, searchType);
	    		
	    List<FoodDtoForList> list = service.foodsearch(keyword, searchType, condition, pageNo);
	    UtilPaging paging = new UtilPaging(total, pageNo);
	    
	      result.put("total", total);   
	      result.put("list", list);
	      result.put("paging", paging);
	      result.put("search", keyword);

	    return result;
	}
	
	
	//api
	@Autowired private NaverOcrService nservice;
	@Operation(summary = "네이버 OCR")
	@PostMapping("/naverocr")
	@ResponseBody  //빼먹지 말기
    public String analyzeImage(@RequestParam(name="ocrfile") MultipartFile ocrfile) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + ocrfile.getOriginalFilename());
        ocrfile.transferTo(convFile);
        String result = nservice.callOcrApi(convFile);
        convFile.delete();
        
        return result;
    }

	@Operation(summary = "사료 등록/수정 정보")
	@GetMapping("/form")
	public Map<String, Object> foodFormData(
	        @RequestParam(name="foodid", required = false) Integer foodid) {

	    Map<String, Object> result = new HashMap<>();
	    //공통
	    result.put("brandlist", service.brandSelectAll());
	    result.put("nutrientlist", service.nutrientSelectName());

	    //수정폼 정보
	    if (foodid != null) {
	        result.put("dto", service.foodselect(foodid));
	        result.put("nutriList", service.nutriselectWithInfo(foodid));
	    }

	    return result;
	}
	
	@Operation(summary = "신규 사료 등록")
	@PostMapping("/foodwrite")
	public Map<String, Object> writeFood(
	        @ModelAttribute FoodDto fdto,
	        @RequestParam(name="nutrientid", required=false) List<String> nutrientid,
	        @RequestParam(name="amount", required=false) List<String> amount,
	        @RequestParam(name="file", required=false) MultipartFile file
	        ) throws IOException {
	    Map<String, Object> result = new HashMap<>();

	    // 사료 입력
	    int result1 = service.foodinsert(fdto, file);
	    // 영양소 입력
	    if (nutrientid != null && amount != null) {
	        for (int i = 0; i < nutrientid.size(); i++) {

	            if (amount.get(i) == null || amount.get(i).trim().equals("")) continue;
	            if (nutrientid.get(i) == null || nutrientid.get(i).trim().equals("")) continue;

	            NutriDto ndto = new NutriDto();
	            ndto.setFoodid(fdto.getFoodid());
	            ndto.setNutrientid(Integer.parseInt(nutrientid.get(i)));
	            ndto.setAmount(Double.parseDouble(amount.get(i)));

	            service.nutriinsert(ndto);
	        }
	    }

	    // 결과만 JSON으로
	    result.put("success", result1 > 0);
	    result.put("foodid", fdto.getFoodid());

	    return result;
	}
	
	
	@Operation(summary = "사료 상세 + 영양 정보")
	@GetMapping("/detail/{foodid}")
	public Map<String, Object> getFoodDetail(@PathVariable(name="foodid") int foodid) {
	    Map<String, Object> result = new HashMap<>();
	    result.put("fdto", service.foodselectwithBrand(foodid));
	    result.put("nutrientList", service.nutriselectWithInfo(foodid));
	    return result;
	}
	
	@Operation(summary = "사료 수정")
	@PutMapping("/edit/{foodid}")
	public Map<String, Object> updateFood(
			@PathVariable(name="foodid") int foodid,
	        FoodDto fdto,
	        @RequestParam(name="nutrientid", required = false) List<Integer> nutrientid,
	        @RequestParam(name="amount", required = false) List<String> amount,
	        @RequestParam(name="file" , required = false) MultipartFile file){
		fdto.setFoodid(foodid);  //누락 주의
		Map<String, Object> result = new HashMap<>();
		// 사료 입력
	    int result1 = service.foodupdate(fdto, file);
	    // 기존 영양소 전체 삭제** 
	    service.nutrideleteAll(foodid);

	    // 새 영양소 입력
	    if(nutrientid != null && amount != null){
	        for(int i=0; i<nutrientid.size(); i++){
	            if(amount.get(i) == null || amount.get(i).trim().equals("")) continue;
	            NutriDto ndto = new NutriDto();
	            ndto.setFoodid(foodid);
	            ndto.setNutrientid(nutrientid.get(i));
	            ndto.setAmount(Double.parseDouble(amount.get(i).trim()));

	            service.nutriinsert(ndto);
	        }
	    }
		
	    result.put("success", result1 > 0);
	    result.put("foodid", fdto.getFoodid());

	    return result;
	}
	@Operation(summary = "사료 삭제")
	@DeleteMapping
	public ResponseEntity<Void> deleteByFoodid(@RequestParam(name="foodid") int foodid){

	    service.nutrideleteAll(foodid);
	    int result = service.fooddelete(foodid);
	    if (result > 0) {
	        return ResponseEntity.noContent().build(); // 204
	    }
	    return ResponseEntity.notFound().build(); // 404 
  }

	
}