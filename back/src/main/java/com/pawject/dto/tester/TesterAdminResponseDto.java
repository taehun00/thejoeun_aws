package com.pawject.dto.tester;

import java.util.List;

import com.pawject.domain.Tester;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TesterAdminResponseDto {
	

    private Long testerid;
    private String category;
    private String title;
    private String content;
    private Long userid;
    private String nickname;
    private Integer foodid;   //null 가능하도록 변경
    private String foodname;
    private int status;
    private int views;
    private int isnotice;
    private Integer posttype;  
    private boolean deleted;
    private String createdat;
    private String updatedat;

    private List<TesterImgDto> imgList; 
    
    
    public static TesterAdminResponseDto from(Tester t){
        List<TesterImgDto> imgList = (t.getTesterimg() == null) ? List.of()
            : t.getTesterimg().stream()
                .map(img -> TesterImgDto.builder()
                    .testerimgid(img.getTesterimgid())
                    .imgsrc(img.getImgsrc())
                    .build())
                .toList();

        return TesterAdminResponseDto.builder()
        	    .testerid(t.getTesterid() == null ? null : t.getTesterid())
        	    .category(t.getCategory())
        	    .title(t.getTitle())
        	    .content(t.getContent())
        	    .userid(t.getUser() == null || t.getUser().getUserId() == null ? 0 : t.getUser().getUserId().longValue())
        	    .nickname(t.getUser() == null ? null : t.getUser().getNickname())
        	    .foodid(t.getFoodid() == null ? null : t.getFoodid().intValue())
        	    .foodname(null)
        	    .status(t.getStatus() == null ? 0 : t.getStatus())
        	    .views(t.getViews() == null ? 0 : t.getViews())
        	    .isnotice(t.getIsnotice() == null ? 0 : t.getIsnotice())
        	    .posttype(t.getPosttype() == null ? 0 : t.getPosttype())
        	    .deleted(t.isDeleted())
        	    .createdat(t.getCreatedat() == null ? null : t.getCreatedat().toString())
        	    .updatedat(t.getUpdatedat() == null ? null : t.getUpdatedat().toString())
        	    .imgList(imgList)
        	    .build();
    }
}
   
/**
 * tester 테이블 필요 컬럼
testerid - 시퀀스 이용, 고유 번호
category - 분류 (사료, 용품 등)
title 제목
content 내용
userid 유저
foodid 푸드랑 연관 있을 경우 - 이 경우 사료검색 게시판에서 테스터 모집중 버튼 노출 가능할지도?
status 모집상태
views 조회수
isnotice 공지여부-모집상태와 연동
createdat 등록일
updatedat 수정일
deketed 삭제여부

 */