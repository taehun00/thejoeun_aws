package com.pawject.dto.tester;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TesterUserRequestDto {
	private Long testerid;
	private String category;
	private String title;
	private String content;
	private List<TesterImgDto> imgList;
    private Long userid;
    private int foodid;
}
