package com.pawject.dao.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.pawject.dto.review.ReviewImgDto;

@Mapper
public interface ReviewImgDao {
	
	//	<select resultMap="ReviewImgMap"  id="reviewimgselectAll" >
		public List<ReviewImgDto> reviewimgselectAll();
	
	//<select resultMap="ReviewImgMap" id="reviewimgSelect" parameterType="int">
		public List<ReviewImgDto> reviewimgSelect(int reviewid);
	
	//	<insert id="reviewimginsert" parameterType="ReviewImgDto">
		public int reviewimginsert(ReviewImgDto dto);
	
	//<update id="reviewimgupdate" parameterType="ReviewImgDto">
		public int reviewimgupdate(ReviewImgDto dto);
		
	//<delete id="reviewimgdeleteAll" parameterType="int">
		public int reviewimgdeleteAll(int reviewid);
	
	//	<delete id="reviewimgdelete" parameterType="int">
		public int reviewimgdelete(int reviewimgid);

		//	<select resultMap="ReviewImgMap" id="reviewimgIdSelect" parameterType="int">
		public ReviewImgDto  reviewimgIdSelect(int reviewimgid);
		
}
