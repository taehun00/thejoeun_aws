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
public class TesterCommentResponseDto {
	private Long testercommentid;
    private String createdat;
    private String updatedat;
    private boolean deleted;
    private String content;
    private Long userid;
    private Long testerid;

    
    public static TesterCommentResponseDto from(TesterComment t){

        return TesterCommentResponseDto.builder()
        	    .testercommentid(t.getTestercommentid() == null ? null : t.getTestercommentid().longValue())
        	    .createdat(t.getCreatedat() == null ? null : t.getCreatedat().toString())
        	    .updatedat(t.getUpdatedat() == null ? null : t.getUpdatedat().toString())
        	    .deleted(t.isDeleted())
        	    .content(t.getContent())
        	    .userid(t.getUser().getUserId().longValue())
        	    .testerid(t.getTester().getTesterid())
        	    .build();
    }
    
}
