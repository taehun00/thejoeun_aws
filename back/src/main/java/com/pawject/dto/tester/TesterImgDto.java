package com.pawject.dto.tester;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TesterImgDto {
    private Long testerimgid;
    private String imgsrc;
    private Long testerid;
}