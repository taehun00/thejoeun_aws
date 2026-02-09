package com.pawject.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.review.ReviewDto;
import com.pawject.service.food.FoodService;
import com.pawject.service.review.ReviewApi;
import com.pawject.service.review.ReviewService;
import com.pawject.service.user.AuthUserJwtService;
import com.pawject.util.UtilPaging;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "REVIEW", description = "리뷰게시판") 
@RestController 
@RequiredArgsConstructor 
@RequestMapping("/api/reviewboard")
public class ReviewController {
	 private final ReviewService service;
     private final FoodService fservice;
 	private final AuthUserJwtService authUserJwtService;  
	
	@Operation(summary = "리뷰 등록/수정 정보")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
	@GetMapping("/form")
	public Map<String, Object> foodFormData(
	        @RequestParam(name = "reviewid", required = false) Integer reviewid) {
	    Map<String, Object> result = new HashMap<>();
	    //공통
	    result.put("brandlist", fservice.brandSelectAll());
	    result.put("foodlist", fservice.foodselectAll());

	    //수정폼 정보
	    if (reviewid != null) {
	        result.put("dto", service.reviewSelect(reviewid));
	        result.put("imglist", service.reviewimgSelect(reviewid));
	    }
	    return result;
	}
	
	
	@Operation(summary = "리뷰작성 (글+이미지)")
	@PostMapping("/reviewwrite")
	@PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER')")
	public int write(
	        Authentication authentication,
	        @ModelAttribute ReviewDto dto,
	        @RequestParam(name ="files", required = false) List<MultipartFile> files
	) {
	    Long userid = authUserJwtService.getCurrentUserId(authentication);
	    dto.setUserid(userid.intValue()); // dto가 int면 변환

	    return service.reviewInsertWithImg(dto, files);
	}
	
	@Operation(summary = "리뷰 수정 (글+이미지)")
	@PostMapping("/reviewedit/{reviewid}")
	@PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
	public int update(
	        Authentication authentication,
	        @PathVariable(name = "reviewid") int reviewid,
	        @ModelAttribute ReviewDto dto,
	        @RequestParam(name ="files" , required=false) List<MultipartFile> files,
	        @RequestParam(name = "keepImgIds", required=false) List<Integer> keepImgIds
	) {
	    Long userid = authUserJwtService.getCurrentUserId(authentication);
	    dto.setUserid(userid.intValue());
	    dto.setReviewid(reviewid);

	    return service.reviewUpdatetWithImg(dto, files, keepImgIds);
	}
	
	
	@Operation(summary = "모달 연동")
    @RequestMapping("/reviewsearchByFoodid")
    public Map<String, Object> reviewsearchByFoodid(@RequestParam(name = "foodid") int foodid){
    	Map<String, Object> result = new HashMap<>();
    	int total = service.reviewsearchByFoodidCnt(foodid);
    	List<ReviewDto> list = service.reviewsearchByFoodid(foodid);
    	
    	result.put("total", total);
    	result.put("list", list);
    	return result;
    }
    
    
	@Operation(summary = "페이징")
	@RequestMapping("/reviewPaging")
	public Map<String, Object> reviewPaging(
	        @RequestParam(name="condition", defaultValue="new") String condition,
	        @RequestParam(name="pageNo", defaultValue="1") int pageNo){	
    	Map<String, Object> result = new HashMap<>();
    	
    	int total= service.reviewSelectCnt();
    	List<ReviewDto> list = service.reviewSelect10(pageNo, condition);

    	UtilPaging paging = new UtilPaging(total, pageNo);  
        result.put("paging", paging);
    	result.put("total", total);
    	result.put("list", list);

		
	    return result;
	}
    		
	@Operation(summary = "리뷰검색")
    @RequestMapping("/reviewsearch")
    public Map<String, Object> reviewsearch(
	        @RequestParam(name = "keyword") String keyword,
	        @RequestParam(name = "searchType") String searchType,
	        @RequestParam(name = "condition", required=false) String condition,
	        @RequestParam(name = "pageNo", defaultValue="1") int pageNo){
    	
	    Map<String, Object> result = new HashMap<>();
	    int total = service.reviewsearchcnt(keyword, searchType);
	    List<ReviewDto> list = service.reviewsearch(keyword, searchType, condition, pageNo);
	    UtilPaging paging = new UtilPaging(total, pageNo);
	    
	      result.put("total", total);   
	      result.put("list", list);
	      result.put("paging", paging);
	      result.put("search", keyword);

	    return result;
	}

	@DeleteMapping
	@PreAuthorize("isAuthenticated() and hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
	public ResponseEntity<Void> deleteByreviewid(
	        Authentication authentication,
	        @RequestParam(name = "reviewid") int reviewid
	) {
	    Long userid = authUserJwtService.getCurrentUserId(authentication);

	    ReviewDto dto = new ReviewDto();
	    dto.setReviewid(reviewid);
	    dto.setUserid(userid.intValue());

	    boolean isAdmin = authentication.getAuthorities().stream()
	            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

	    int result;

	    if (isAdmin) {
	        result = service.reviewDeleteByAdmin(reviewid);
	    } else {
	        result = service.reviewDelete(dto);
	    }

	    if (result > 0) {
	        service.reviewimgdeleteById(reviewid);
	        return ResponseEntity.noContent().build();
	    }

	    return ResponseEntity.status(403).build();
	}
	
	@Autowired private ReviewApi apiservice;
	@Operation(summary = "리뷰 api")
	@PostMapping("/reviewapi")
	@ResponseBody
	public String openai(@RequestParam(name = "title") String title,
						 @RequestParam(name = "reviewcomment") String reviewcomment) {
	    return apiservice.helpReviewWriting(title, reviewcomment);
	}
	

}



