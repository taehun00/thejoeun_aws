package com.pawject.dao.review;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.review.ReviewDto;
import com.pawject.dto.user.UserAuthDto;
import com.pawject.dto.user.UserDto;
@Mapper
public interface ReviewDao {
	
		//기초 crud
	//	<select  resultMap="ReviewMap" id="reviewSelectAll">
		public List<ReviewDto> reviewSelectAll();
	
	//	<select resultMap="ReviewMap" id="reviewSelect" parameterType="int">
		public ReviewDto reviewSelect(int reviewid);

	//	<insert id="reviewInsert" parameterType="ReviewDto">
		public int reviewInsert(ReviewDto dto);
		
	//	<update id="reviewUpdate" parameterType="ReviewDto">
		public int reviewUpdate(ReviewDto dto);
		
	//	<delete id="reviewDelete" parameterType="ReviewDto">
		public int reviewDelete(ReviewDto dto);
		
		
		//페이징
	//<select resultMap="ReviewMap" id="reviewSelect10"  parameterType="java.util.Map">
		public List<ReviewDto> reviewSelect10(HashMap<String, Object> para);
		
	//<select resultType="int" id="reviewSelectCnt">	
		public int reviewSelectCnt();
		
	// 서치+페이징
	//<select  resultMap="ReviewMap" id="reviewsearch" parameterType="java.util.HashMap">
		public List<ReviewDto> reviewsearch(HashMap<String, Object> para);
		
		
	//<select  resultMap="ReviewMap" id="reviewsearchcnt" parameterType="java.util.HashMap">
		public int reviewsearchcnt(HashMap<String, Object> para);
		
		
		//권한용 임시메서드
		//<select id="readAuthForReview" resultMap="userAuthMap" parameterType="UserDto">
		public UserAuthDto readAuthForReview(UserDto udto);
		//<select id="selectUserIdForReview" resultType="int" parameterType="String">
		public int selectUserIdForReview(String email);
		
		
		//사료-리뷰 연결
//		<select resultMap="ReviewMap" id="reviewsearchByFoodid" parameterType="int" >
		public List<ReviewDto> reviewsearchByFoodid(int foodid);
//		<select resultType="int" id="reviewsearchByFoodidCnt" parameterType="int">
		public int reviewsearchByFoodidCnt(int foodid);
		
		public int reviewDeleteByAdmin(int reviewid);
}


