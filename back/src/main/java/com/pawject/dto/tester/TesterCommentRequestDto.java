package com.pawject.dto.tester;

import com.pawject.domain.TesterComment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TesterCommentRequestDto {
    private String content;
    private Long testerid;

    
}
