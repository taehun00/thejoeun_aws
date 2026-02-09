package com.pawject.service.review;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.pawject.dto.food.FoodDtoForList;
import com.pawject.dto.review.ReviewDto;
import com.pawject.dto.review.ReviewImgDto;
import com.pawject.dto.user.UserAuthDto;
import com.pawject.dto.user.UserDto;

public interface ReviewService {
	
	//리뷰테이블
	public ReviewDto reviewSelect(int reviewid) ;
	public int reviewDelete(ReviewDto dto);
	
	public int reviewSelectCnt();
	public List<ReviewDto> reviewSelect10(int pageNo, String condition);
	public int reviewsearchcnt(String keyword, String searchType);
	public List<ReviewDto> reviewsearch(String keyword, String searchType, String condition, int pageNo);
	
	//이미지테이블
	public List<ReviewImgDto> reviewimgSelect(int reviewid);
	 public int reviewimgdeleteById(int reviewid);
	 public int reviewimgdelete(int reviewimgid);
	//권한
	public int selectUserIdForReview(String email);
	
	//사료-리뷰 연결
	public List<ReviewDto> reviewsearchByFoodid(int foodid);
	public int reviewsearchByFoodidCnt(int foodid);
	
	
	//리액트용 신규
	public int reviewInsertWithImg(ReviewDto dto, List<MultipartFile> files);
	public int reviewUpdatetWithImg(ReviewDto dto, List<MultipartFile> files, List<Integer> keepImgIds);

	public int reviewDeleteByAdmin(int reviewid);
}